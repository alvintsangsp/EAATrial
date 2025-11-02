import { useState, useEffect } from "react";
import { ExamWelcome } from "@/components/ExamWelcome";
import { ExamQuestion } from "@/components/ExamQuestion";
import { ExamTimer } from "@/components/ExamTimer";
import { ExamReview } from "@/components/ExamReview";
import { ExamResults } from "@/components/ExamResults";
import { getRandomQuestions, Question } from "@/data/questions";
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

type ExamState = "welcome" | "exam" | "results";

const EXAM_DURATION = 20 * 60; // 20 minutes in seconds

const Index = () => {
  const [examState, setExamState] = useState<ExamState>("welcome");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [startTime, setStartTime] = useState(0);
  const [endTime, setEndTime] = useState(0);
  const [showReview, setShowReview] = useState(false);
  const [showSubmitDialog, setShowSubmitDialog] = useState(false);
  const [hasShownFiveMinuteWarning, setHasShownFiveMinuteWarning] = useState(false);

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
    const randomQuestions = getRandomQuestions(20);
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
    setExamState("welcome");
  };

  const handleExit = () => {
    setExamState("welcome");
  };

  const unansweredCount = questions.length - Object.keys(answers).length;
  const timeTaken = endTime > 0 ? Math.floor((endTime - startTime) / 1000) : 0;

  return (
    <div className="min-h-screen">
      {examState === "welcome" && <ExamWelcome onStart={handleStartExam} />}

      {examState === "exam" && (
        <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 py-4 sm:py-6 lg:py-8 px-3 sm:px-4">
          <div className="max-w-4xl mx-auto space-y-4 sm:space-y-6">
            {/* Timer Header */}
            <div className="flex justify-center sticky top-4 z-10">
              <ExamTimer
                startTime={startTime}
                duration={EXAM_DURATION}
                onTimeUp={handleTimeUp}
              />
            </div>

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
