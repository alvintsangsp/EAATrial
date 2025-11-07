import { Question } from "@/types/question";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { ChevronLeft, ChevronRight, List } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useEffect, useRef } from "react";

interface ExamQuestionProps {
  question: Question;
  currentIndex: number;
  totalQuestions: number;
  selectedAnswer: string;
  onAnswerSelect: (answer: string) => void;
  onPrevious: () => void;
  onNext: () => void;
  onReview: () => void;
  onSubmit: () => void;
  onHome: () => void;
  canGoPrevious: boolean;
  canGoNext: boolean;
}

export const ExamQuestion = ({
  question,
  currentIndex,
  totalQuestions,
  selectedAnswer,
  onAnswerSelect,
  onPrevious,
  onNext,
  onReview,
  onSubmit,
  onHome,
  canGoPrevious,
  canGoNext,
}: ExamQuestionProps) => {
  const questionTopRef = useRef<HTMLDivElement>(null);

  const options = [
    { value: "A", label: question.optionA },
    { value: "B", label: question.optionB },
    { value: "C", label: question.optionC },
    { value: "D", label: question.optionD },
  ];

  if (question.optionE) {
    options.push({ value: "E", label: question.optionE });
  }

  const progress = ((currentIndex + 1) / totalQuestions) * 100;

  // Auto-scroll to top when question changes
  useEffect(() => {
    if (questionTopRef.current) {
      questionTopRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [currentIndex]);

  return (
    <div className="space-y-4 pb-32">
      {/* Progress Section */}
      <div ref={questionTopRef} />
      <Card className="p-3 sm:p-4">
        <div className="space-y-2">
          <div className="flex justify-between items-center text-sm sm:text-base">
            <span className="font-semibold">題目進度</span>
            <span className="text-muted-foreground font-medium">
              第 {currentIndex + 1} / {totalQuestions} 題
            </span>
          </div>
          <Progress value={progress} className="h-2 sm:h-3" />
        </div>
      </Card>

      {/* Question Card */}
      <Card className="p-4 sm:p-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <p className="text-sm sm:text-base text-muted-foreground font-medium">
              題目編號：{question.id}
            </p>
            <h2 className="text-base sm:text-lg lg:text-xl font-bold leading-relaxed">
              {question.question}
            </h2>
          </div>

          <RadioGroup value={selectedAnswer} onValueChange={onAnswerSelect}>
            <div className="space-y-2">
              {options.map((option) => (
                <div
                  key={option.value}
                  className={`flex items-start space-x-2 sm:space-x-3 p-3 rounded-lg border-2 transition-all cursor-pointer hover:bg-muted/50 active:scale-[0.98] ${
                    selectedAnswer === option.value
                      ? "border-primary bg-primary/5 shadow-md"
                      : "border-border"
                  }`}
                  onClick={() => onAnswerSelect(option.value)}
                >
                  <RadioGroupItem
                    value={option.value}
                    id={`option-${option.value}`}
                    className="mt-0.5 w-4 h-4"
                  />
                  <Label
                    htmlFor={`option-${option.value}`}
                    className="flex-1 cursor-pointer text-sm sm:text-base leading-relaxed"
                  >
                    <span className="font-bold mr-1.5 text-primary">{option.value}.</span>
                    {option.label}
                  </Label>
                </div>
              ))}
            </div>
          </RadioGroup>
        </div>
      </Card>

      {/* Review and Home Buttons */}
      <div className="space-y-2">
        <Button
          variant="outline"
          size="default"
          onClick={onReview}
          className="w-full text-sm sm:text-base"
        >
          <List className="w-4 h-4 mr-2" />
          檢閱答案
        </Button>
        <Button
          variant="outline"
          size="default"
          onClick={onHome}
          className="w-full text-sm sm:text-base"
        >
          返回主頁
        </Button>
      </div>

      {/* Fixed Navigation at Bottom */}
      <div className="fixed bottom-0 left-0 right-0 bg-background border-t shadow-lg z-50">
        <div className="max-w-4xl mx-auto px-3 sm:px-4 py-3">
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onPrevious}
              disabled={!canGoPrevious}
              className="flex-1 h-12 text-sm sm:text-base"
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              上一題
            </Button>
            <Button
              variant="default"
              size="sm"
              onClick={onSubmit}
              className="flex-1 h-12 text-sm sm:text-base bg-destructive hover:bg-destructive/90"
            >
              提交考試
            </Button>
            <Button
              variant="default"
              size="sm"
              onClick={onNext}
              disabled={!canGoNext}
              className="flex-1 h-12 text-sm sm:text-base"
            >
              下一題
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
