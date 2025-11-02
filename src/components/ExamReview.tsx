import { Question } from "@/data/questions";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CheckCircle2, Circle, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface ExamReviewProps {
  questions: Question[];
  answers: Record<number, string>;
  isOpen: boolean;
  onClose: () => void;
  onJumpToQuestion: (index: number) => void;
  onSubmit?: () => void;
}

export const ExamReview = ({
  questions,
  answers,
  isOpen,
  onClose,
  onJumpToQuestion,
  onSubmit,
}: ExamReviewProps) => {
  const answeredCount = Object.keys(answers).length;
  const unansweredCount = questions.length - answeredCount;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[85vh] sm:max-h-[80vh] p-4 sm:p-6">
        <DialogHeader>
          <DialogTitle className="text-xl sm:text-2xl">檢閱答案</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 sm:space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 p-4 sm:p-5 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-2 sm:gap-3">
              <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6 text-success" />
              <span className="text-base sm:text-lg font-medium">已回答：{answeredCount} 題</span>
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              <XCircle className="w-5 h-5 sm:w-6 sm:h-6 text-destructive" />
              <span className="text-base sm:text-lg font-medium">未回答：{unansweredCount} 題</span>
            </div>
          </div>

          <ScrollArea className="h-[350px] sm:h-[400px] pr-2 sm:pr-4">
            <div className="grid grid-cols-1 gap-3 sm:gap-4">
              {questions.map((question, index) => {
                const isAnswered = answers[index] !== undefined;
                
                return (
                  <button
                    key={question.id}
                    onClick={() => {
                      onJumpToQuestion(index);
                      onClose();
                    }}
                    className={cn(
                      "flex items-start gap-3 sm:gap-4 p-4 sm:p-5 rounded-lg border-2 text-left transition-all hover:bg-muted/50 active:scale-[0.98]",
                      isAnswered ? "border-success/50 bg-success/5" : "border-destructive/50 bg-destructive/5"
                    )}
                  >
                    <div className="flex-shrink-0 mt-1">
                      {isAnswered ? (
                        <CheckCircle2 className="w-6 h-6 sm:w-5 sm:h-5 text-success" />
                      ) : (
                        <Circle className="w-6 h-6 sm:w-5 sm:h-5 text-destructive" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="font-bold mb-2 text-base sm:text-lg">題目 {index + 1}</div>
                      <div className="text-base sm:text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                        {question.question}
                      </div>
                      {isAnswered && (
                        <div className="text-base sm:text-sm font-semibold mt-2 text-primary">
                          已選擇：{answers[index]}
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </ScrollArea>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button variant="outline" onClick={onClose} className="flex-1 text-base sm:text-sm py-6 sm:py-3">
              繼續答題
            </Button>
            {onSubmit && (
              <Button onClick={onSubmit} className="flex-1 text-base sm:text-sm py-6 sm:py-3">
                提交考試
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
