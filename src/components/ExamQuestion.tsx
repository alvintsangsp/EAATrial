import { Question } from "@/data/questions";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { ChevronLeft, ChevronRight, List } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface ExamQuestionProps {
  question: Question;
  currentIndex: number;
  totalQuestions: number;
  selectedAnswer: string;
  onAnswerSelect: (answer: string) => void;
  onPrevious: () => void;
  onNext: () => void;
  onReview: () => void;
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
  canGoPrevious,
  canGoNext,
}: ExamQuestionProps) => {
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

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Progress Section */}
      <Card className="p-4 sm:p-5">
        <div className="space-y-3">
          <div className="flex justify-between items-center text-base sm:text-lg">
            <span className="font-semibold">題目進度</span>
            <span className="text-muted-foreground font-medium">
              第 {currentIndex + 1} / {totalQuestions} 題
            </span>
          </div>
          <Progress value={progress} className="h-3 sm:h-4" />
        </div>
      </Card>

      {/* Question Card */}
      <Card className="p-5 sm:p-8">
        <div className="space-y-5 sm:space-y-6">
          <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
            <h2 className="text-lg sm:text-xl lg:text-2xl font-bold leading-relaxed flex-1">
              {currentIndex + 1}. {question.question}
            </h2>
            <Button
              variant="outline"
              size="default"
              onClick={onReview}
              className="flex-shrink-0 w-full sm:w-auto text-base sm:text-sm"
            >
              <List className="w-4 h-4 mr-2" />
              檢閱答案
            </Button>
          </div>

          <RadioGroup value={selectedAnswer} onValueChange={onAnswerSelect}>
            <div className="space-y-3 sm:space-y-4">
              {options.map((option) => (
                <div
                  key={option.value}
                  className={`flex items-start space-x-3 sm:space-x-4 p-4 sm:p-5 rounded-lg border-2 transition-all cursor-pointer hover:bg-muted/50 active:scale-[0.98] ${
                    selectedAnswer === option.value
                      ? "border-primary bg-primary/5 shadow-md"
                      : "border-border"
                  }`}
                  onClick={() => onAnswerSelect(option.value)}
                >
                  <RadioGroupItem
                    value={option.value}
                    id={`option-${option.value}`}
                    className="mt-1 w-5 h-5 sm:w-4 sm:h-4"
                  />
                  <Label
                    htmlFor={`option-${option.value}`}
                    className="flex-1 cursor-pointer text-base sm:text-lg leading-relaxed"
                  >
                    <span className="font-bold mr-2 text-primary">{option.value}.</span>
                    {option.label}
                  </Label>
                </div>
              ))}
            </div>
          </RadioGroup>
        </div>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between gap-3 sm:gap-4">
        <Button
          variant="outline"
          size="lg"
          onClick={onPrevious}
          disabled={!canGoPrevious}
          className="flex-1 sm:flex-none text-base sm:text-lg py-6"
        >
          <ChevronLeft className="w-5 h-5 mr-2" />
          上一題
        </Button>
        <Button
          size="lg"
          onClick={onNext}
          disabled={!canGoNext}
          className="flex-1 sm:flex-none text-base sm:text-lg py-6"
        >
          {currentIndex === totalQuestions - 1 ? "完成" : "下一題"}
          <ChevronRight className="w-5 h-5 ml-2" />
        </Button>
      </div>
    </div>
  );
};
