import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ExamWelcome } from "@/components/ExamWelcome";
import { ExamQuestion } from "@/components/ExamQuestion";
import { ExamTimer } from "@/components/ExamTimer";
import { ExamReview } from "@/components/ExamReview";
import { ExamResults } from "@/components/ExamResults";
import { TopicSelection } from "@/components/TopicSelection";
import { Question } from "@/types/question";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

type ExamState = "welcome" | "topicSelection" | "exam" | "results";
type ExamMode = "mock" | "practice";

const EXAM_DURATION = 60 * 60; // 60 minutes in seconds

const Index = () => {
  const navigate = useNavigate();
  const [examState, setExamState] = useState<ExamState>("welcome");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [allQuestions, setAllQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [startTime, setStartTime] = useState(0);
  const [endTime, setEndTime] = useState(0);
  const [showReview, setShowReview] = useState(false);
  const [showSubmitDialog, setShowSubmitDialog] = useState(false);
  const [hasShownFiveMinuteWarning, setHasShownFiveMinuteWarning] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [examMode, setExamMode] = useState<ExamMode>("mock");
  const [selectedTopic, setSelectedTopic] = useState<string>("");

  // Check if disclaimer has been accepted
  useEffect(() => {
    const disclaimerAccepted = localStorage.getItem("disclaimerAccepted");
    if (!disclaimerAccepted) {
      navigate("/disclaimer");
    }
  }, [navigate]);

  // Load questions from JSON file
  useEffect(() => {
    const loadQuestions = async () => {
      try {
        // Try multiple paths for data loading to handle different deployment scenarios
        const pathsToTry = [
          './data/eaa-questions.json',
          '/data/eaa-questions.json',
          './eaatrial/data/eaa-questions.json'
        ];
        
        let data;
        let response;
        
        for (const path of pathsToTry) {
          try {
            response = await fetch(path);
            if (response.ok) {
              data = await response.json();
              console.log(`Successfully loaded data from ${path}`);
              break;
            }
          } catch (error) {
            console.log(`Failed to load data from ${path}:`, error);
          }
        }
        
        if (!data) {
          throw new Error('Failed to load questions data from any path');
        }
        
        // Convert from JSON format to app format
        const convertedQuestions: Question[] = data.questions.map((q: any) => ({
          id: q.id,
          question: q.question,
          optionA: q.options.A,
          optionB: q.options.B,
          optionC: q.options.C,
          optionD: q.options.D,
          optionE: q.options.E,
          correctAnswer: q.correctAnswer,
          explanation: q.explanation,
          category: q.category
        }));
        
        setAllQuestions(convertedQuestions);
        setIsLoading(false);
      } catch (error) {
        console.error('Failed to load questions:', error);
        toast.error('載入問題失敗: ' + (error as Error).message);
        setIsLoading(false);
      }
    };
    
    loadQuestions();
  }, []);

  const getRandomQuestions = (count: number = 30): Question[] => {
    const shuffled = [...allQuestions].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, Math.min(count, allQuestions.length));
  };

  useEffect(() => {
    if (examState === "exam" && startTime > 0) {
      const checkInterval = setInterval(() => {
        const elapsed = Math.floor((Date.now() - startTime) / 1000);
        const remaining = EXAM_DURATION - elapsed;

        if (remaining === 300 && !hasShownFiveMinuteWarning) {
          toast.warning("只剩下5分鐘！", {
            description: "請檢查你的答案",
          });
          setHasShownFiveMinuteWarning(true);
        }
      }, 1000);

      return () => clearInterval(checkInterval);
    }
  }, [examState, startTime, hasShownFiveMinuteWarning]);

  const handleStartExam = () => {
    setExamMode("mock");
    const randomQuestions = getRandomQuestions(30);
    setQuestions(randomQuestions);
    setCurrentQuestionIndex(0);
    setAnswers({});
    setStartTime(Date.now());
    setEndTime(0);
    setExamState("exam");
    setHasShownFiveMinuteWarning(false);
    toast.success("考試已開始", {
      description: "祝你好運！",
    });
  };

  const handleStartPractice = () => {
    setExamState("topicSelection");
  };

  const handleSelectTopic = (topicNumber: string) => {
    setExamMode("practice");
    setSelectedTopic(topicNumber);
    
    // Filter questions by topic
    const topicQuestions = allQuestions.filter(q => 
      q.category && q.category.startsWith(`${topicNumber}.`)
    );
    
    if (topicQuestions.length === 0) {
      toast.error("此主題暫無題目");
      return;
    }
    
    // Randomly select 20 questions (or all if less than 20)
    const shuffled = [...topicQuestions].sort(() => 0.5 - Math.random());
    const selectedQuestions = shuffled.slice(0, Math.min(20, topicQuestions.length));
    
    setQuestions(selectedQuestions);
    setCurrentQuestionIndex(0);
    setAnswers({});
    setStartTime(Date.now());
    setEndTime(0);
    setExamState("exam");
    toast.success(`開始練習：主題 ${topicNumber}`, {
      description: `共有 ${selectedQuestions.length} 題`,
    });
  };

  const handleAnswerSelect = (answer: string) => {
    setAnswers((prev) => ({
      ...prev,
      [currentQuestionIndex]: answer,
    }));
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      // Last question, show submit dialog
      setShowSubmitDialog(true);
    }
  };

  const handleTimeUp = () => {
    toast.error("時間到！", {
      description: "考試已自動提交",
    });
    handleSubmitExam();
  };

  const handleSubmitExam = () => {
    setEndTime(Date.now());
    setExamState("results");
    setShowSubmitDialog(false);
  };

  const handleRetake = () => {
    if (examMode === "practice") {
      // Retake the same topic
      handleSelectTopic(selectedTopic);
    } else {
      setExamState("welcome");
    }
  };

  const handleExit = () => {
    setExamState("welcome");
  };

  const unansweredCount = questions.length - Object.keys(answers).length;
  const timeTaken = endTime > 0 ? Math.floor((endTime - startTime) / 1000) : 0;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">載入問題中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {examState === "welcome" && (
        <ExamWelcome 
          onStart={handleStartExam} 
          onStartPractice={handleStartPractice}
        />
      )}

      {examState === "topicSelection" && (
        <TopicSelection 
          onSelectTopic={handleSelectTopic}
          onBack={handleExit}
        />
      )}

      {examState === "exam" && (
        <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 py-4 sm:py-6 lg:py-8 px-3 sm:px-4">
          <div className="max-w-4xl mx-auto space-y-4 sm:space-y-6">
            {/* Timer Header - only for mock exam */}
            {examMode === "mock" && (
              <div className="flex justify-center">
                <ExamTimer
                  startTime={startTime}
                  duration={EXAM_DURATION}
                  onTimeUp={handleTimeUp}
                />
              </div>
            )}

            {/* Question */}
            <ExamQuestion
              question={questions[currentQuestionIndex]}
              currentIndex={currentQuestionIndex}
              totalQuestions={questions.length}
              selectedAnswer={answers[currentQuestionIndex] || ""}
              onAnswerSelect={handleAnswerSelect}
              onPrevious={handlePrevious}
              onNext={handleNext}
              onReview={() => setShowReview(true)}
              onSubmit={() => setShowSubmitDialog(true)}
              onHome={handleExit}
              canGoPrevious={currentQuestionIndex > 0}
              canGoNext={true}
            />
          </div>
        </div>
      )}

      {examState === "results" && (
        <ExamResults
          questions={questions}
          answers={answers}
          timeTaken={timeTaken}
          onRetake={handleRetake}
          onExit={handleExit}
          isPracticeMode={examMode === "practice"}
        />
      )}

      {/* Review Dialog */}
      <ExamReview
        questions={questions}
        answers={answers}
        isOpen={showReview}
        onClose={() => setShowReview(false)}
        onJumpToQuestion={(index) => setCurrentQuestionIndex(index)}
        onSubmit={() => setShowSubmitDialog(true)}
      />

      {/* Submit Confirmation Dialog */}
      <AlertDialog open={showSubmitDialog} onOpenChange={setShowSubmitDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>確認提交考試？</AlertDialogTitle>
            <AlertDialogDescription>
              {unansweredCount > 0 ? (
                <span className="text-destructive font-medium">
                  你還有 {unansweredCount} 題未回答。
                </span>
              ) : (
                "你已完成所有題目。"
              )}
              <br />
              提交後將無法修改答案。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>繼續答題</AlertDialogCancel>
            <AlertDialogAction onClick={handleSubmitExam}>
              確認提交
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Index;
