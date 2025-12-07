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
import { useLanguage } from "@/contexts/LanguageContext";
import { sify } from 'chinese-conv';

type ExamState = "welcome" | "topicSelection" | "exam" | "results";
type ExamMode = "mock" | "practice";

const EXAM_DURATION = 60 * 60; // 60 minutes in seconds

const Index = () => {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const [examState, setExamState] = useState<ExamState>("welcome");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [allQuestions, setAllQuestions] = useState<Question[]>([]);
  const [originalQuestions, setOriginalQuestions] = useState<Question[]>([]); // Store original Traditional Chinese questions
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

  // Convert question to appropriate language
  const convertQuestionToSimplified = (question: Question): Question => {
    // Convert to Simplified Chinese
    return {
      ...question,
      question: sify(question.question),
      optionA: sify(question.optionA),
      optionB: sify(question.optionB),
      optionC: sify(question.optionC),
      optionD: sify(question.optionD),
      optionE: question.optionE ? sify(question.optionE) : undefined,
      explanation: sify(question.explanation)
    };
  };

  // Convert questions array to Simplified Chinese
  const convertQuestionsToSimplified = (questions: Question[]): Question[] => {
    return questions.map(convertQuestionToSimplified);
  };

  // Get questions in the current language
  const getQuestionsInCurrentLanguage = (questions: Question[]): Question[] => {
    if (language === 'zh-CN') {
      return convertQuestionsToSimplified(questions);
    }
    // Return original for Traditional Chinese
    return questions;
  };

  // Update the displayed questions when language changes
  useEffect(() => {
    if (questions.length > 0) {
      // Convert current questions to the current language
      const convertedQuestions = getQuestionsInCurrentLanguage(questions);
      setQuestions(convertedQuestions);
    }
  }, [language]);

  // Load questions from JSON file
  useEffect(() => {
    const loadQuestions = async () => {
      try {
        // Try multiple paths for data loading to handle different deployment scenarios
        const pathsToTry = [
          '/data/eaa-questions.json',  // For GitHub Pages deployment
          './data/eaa-questions.json', // For local development
          '/eaatrial/data/eaa-questions.json' // Alternative path
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
        
        // Store original questions and set all questions in current language
        setOriginalQuestions(convertedQuestions);
        setAllQuestions(getQuestionsInCurrentLanguage(convertedQuestions));
        setIsLoading(false);
      } catch (error) {
        console.error('Failed to load questions:', error);
        toast.error(t('loadingQuestions') + ': ' + (error as Error).message);
        setIsLoading(false);
      }
    };
    
    loadQuestions();
  }, [t]);

  const getRandomQuestions = (count: number = 30): Question[] => {
    const shuffled = [...originalQuestions].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, Math.min(count, originalQuestions.length));
    return getQuestionsInCurrentLanguage(selected);
  };

  useEffect(() => {
    if (examState === "exam" && startTime > 0) {
      const checkInterval = setInterval(() => {
        const elapsed = Math.floor((Date.now() - startTime) / 1000);
        const remaining = EXAM_DURATION - elapsed;

        if (remaining === 300 && !hasShownFiveMinuteWarning) {
          toast.warning(t('fiveMinutesLeft'), {
            description: t('checkAnswers'),
          });
          setHasShownFiveMinuteWarning(true);
        }
      }, 1000);

      return () => clearInterval(checkInterval);
    }
  }, [examState, startTime, hasShownFiveMinuteWarning, t]);

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
    toast.success(t('examStarted'), {
      description: t('goodLuck'),
    });
  };

  const handleStartPractice = () => {
    setExamState("topicSelection");
  };

  const handleSelectTopic = (topicNumber: string) => {
    setExamMode("practice");
    setSelectedTopic(topicNumber);
    
    // Filter questions by topic using original questions
    const topicQuestions = originalQuestions.filter(q => 
      q.category && q.category.startsWith(`${topicNumber}.`)
    );
    
    if (topicQuestions.length === 0) {
      toast.error(t('noQuestionsInTopic'));
      return;
    }
    
    // Randomly select 20 questions (or all if less than 20)
    const shuffled = [...topicQuestions].sort(() => 0.5 - Math.random());
    const selectedQuestions = shuffled.slice(0, Math.min(20, topicQuestions.length));
    const convertedQuestions = getQuestionsInCurrentLanguage(selectedQuestions);
    
    setQuestions(convertedQuestions);
    setCurrentQuestionIndex(0);
    setAnswers({});
    setStartTime(Date.now());
    setEndTime(0);
    setExamState("exam");
    toast.success(`${t('startPractice')} ${topicNumber}`, {
      description: `${t('questionsCount')} ${selectedQuestions.length} ${t('questions')}`,
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
    toast.error(t('timeUp'), {
      description: t('examAutoSubmitted'),
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
          <p className="text-muted-foreground">{t('loadingQuestions')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative">
      {/* Version number - bottom left corner */}
      <div className="fixed bottom-0 left-0 p-2 text-xs text-muted-foreground pointer-events-none z-0">
        t1.03
      </div>

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
            <AlertDialogTitle>{t('submitExam')}</AlertDialogTitle>
            <AlertDialogDescription>
              {unansweredCount > 0 ? (
                <span className="text-destructive font-medium">
                  {t('questionsCount')} {unansweredCount} {t('questions')}
                </span>
              ) : (
                t('continueExam')
              )}
              <br />
              {t('examAutoSubmitted')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('continueExam')}</AlertDialogCancel>
            <AlertDialogAction onClick={handleSubmitExam}>
              {t('submitExam')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Index;