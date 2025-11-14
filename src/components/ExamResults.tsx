import { Question } from "@/types/question";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { CheckCircle2, XCircle, Trophy, Clock, Mail } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/LanguageContext";

interface ExamResultsProps {
  questions: Question[];
  answers: Record<number, string>;
  timeTaken: number; // in seconds
  onRetake: () => void;
  onExit: () => void;
  isPracticeMode?: boolean;
}

export const ExamResults = ({
  questions,
  answers,
  timeTaken,
  onRetake,
  onExit,
  isPracticeMode = false,
}: ExamResultsProps) => {
  const { t } = useLanguage();
  const correctCount = questions.filter(
    (q, i) => answers[i] === q.correctAnswer
  ).length;
  const totalQuestions = questions.length;
  const percentage = Math.round((correctCount / totalQuestions) * 100);
  const passed = percentage >= 60;

  const minutes = Math.floor(timeTaken / 60);
  const seconds = timeTaken % 60;

  const handleReportError = () => {
    const subject = encodeURIComponent(
      `[香港地產代理人員資格考試（EAQE）/ 營業員資格 (SQE) Mock Exam] Question Feedback - ${new Date().toLocaleDateString()}`
    );
    const body = encodeURIComponent(
      t('questionFeedback')
    );
    window.location.href = `mailto:cs@lazydads.net?subject=${subject}&body=${body}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 py-6 sm:py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-5 sm:space-y-6">
        {/* Header Card */}
        <Card
          className={cn(
            "p-6 sm:p-8 text-center",
            passed ? "bg-success/10 border-success/20" : "bg-destructive/10 border-destructive/20"
          )}
        >
          <div className="space-y-4 sm:space-y-6">
            <div className="inline-block p-3 sm:p-4 bg-background rounded-full">
              <Trophy
                className={cn(
                  "w-10 h-10 sm:w-12 sm:h-12",
                  passed ? "text-success" : "text-destructive"
                )}
              />
            </div>

            <div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-3">
                {passed ? t('passed') : t('failed')}
              </h1>
              <p className="text-lg sm:text-xl lg:text-2xl text-muted-foreground font-medium">
                {t('yourScore')}{correctCount}/{totalQuestions} ({percentage}%)
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:gap-4 pt-4">
              <div className="space-y-2 p-3 sm:p-4 bg-background/50 rounded-lg">
                <p className="text-sm sm:text-base text-muted-foreground">{t('totalQuestions')}</p>
                <p className="text-2xl sm:text-3xl font-bold">{totalQuestions}</p>
              </div>
              <div className="space-y-2 p-3 sm:p-4 bg-background/50 rounded-lg">
                <p className="text-sm sm:text-base text-muted-foreground">{t('correct')}</p>
                <p className="text-2xl sm:text-3xl font-bold text-success">{correctCount}</p>
              </div>
              <div className="space-y-2 p-3 sm:p-4 bg-background/50 rounded-lg">
                <p className="text-sm sm:text-base text-muted-foreground">{t('wrong')}</p>
                <p className="text-2xl sm:text-3xl font-bold text-destructive">
                  {totalQuestions - correctCount}
                </p>
              </div>
              <div className="space-y-2 p-3 sm:p-4 bg-background/50 rounded-lg">
                <p className="text-sm sm:text-base text-muted-foreground">{t('timeTaken')}</p>
                <p className="text-2xl sm:text-3xl font-bold">
                  {minutes}:{String(seconds).padStart(2, "0")}
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* Questions Review */}
        <Card className="p-5 sm:p-6">
          <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">{t('questionReview')}</h2>
          <Accordion type="multiple" className="w-full">
            {questions.map((question, index) => {
              const userAnswer = answers[index];
              const isCorrect = userAnswer === question.correctAnswer;

              return (
                <AccordionItem key={question.id} value={`question-${index}`}>
                  <AccordionTrigger className="hover:no-underline py-4 sm:py-5">
                    <div className="flex items-center gap-3 sm:gap-4 text-left">
                      {isCorrect ? (
                        <CheckCircle2 className="w-6 h-6 sm:w-5 sm:h-5 text-success flex-shrink-0" />
                      ) : (
                        <XCircle className="w-6 h-6 sm:w-5 sm:h-5 text-destructive flex-shrink-0" />
                      )}
                      <span className="flex-1 text-base sm:text-lg leading-relaxed">
                        {index + 1}. {question.question}
                      </span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-4 sm:space-y-5 pt-4">
                      <div className="space-y-3 sm:space-y-4">
                        {["A", "B", "C", "D", "E"].map((option) => {
                          const optionKey = `option${option}` as keyof Question;
                          const optionText = question[optionKey];
                          
                          if (!optionText) return null;

                          const isUserAnswer = userAnswer === option;
                          const isCorrectAnswer = question.correctAnswer === option;

                          return (
                            <div
                              key={option}
                              className={cn(
                                "p-4 sm:p-5 rounded-lg border-2",
                                isCorrectAnswer && "bg-success/10 border-success",
                                isUserAnswer && !isCorrect && "bg-destructive/10 border-destructive",
                                !isCorrectAnswer && !isUserAnswer && "bg-muted/30 border-border"
                              )}
                            >
                              <div className="flex items-start gap-3">
                                <span className="font-bold text-base sm:text-lg">{option}.</span>
                                <span className="flex-1 text-base sm:text-lg leading-relaxed">{optionText}</span>
                                {isCorrectAnswer && (
                                  <CheckCircle2 className="w-6 h-6 sm:w-5 sm:h-5 text-success flex-shrink-0" />
                                )}
                                {isUserAnswer && !isCorrect && (
                                  <XCircle className="w-6 h-6 sm:w-5 sm:h-5 text-destructive flex-shrink-0" />
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      <div className="bg-muted/50 p-4 sm:p-5 rounded-lg">
                        <h4 className="font-bold mb-3 text-base sm:text-lg">{t('explanation')}</h4>
                        <p className="text-base sm:text-lg leading-relaxed">{question.explanation}</p>
                      </div>

                      {!isCorrect && (
                        <div className="bg-destructive/10 border border-destructive/20 p-4 sm:p-5 rounded-lg">
                          <p className="text-base sm:text-lg leading-relaxed">
                            <strong>{t('yourAnswer')}</strong> {userAnswer || t('notAnswered')}{" "}
                            <strong className="ml-4">{t('correctAnswer')}</strong>{" "}
                            {question.correctAnswer}
                          </p>
                        </div>
                      )}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>
        </Card>

        {/* Action Buttons */}
        <Card className="p-5 sm:p-6">
          <div className="space-y-4 sm:space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <Button size="lg" onClick={onRetake} className="text-base sm:text-lg py-6">
                {isPracticeMode ? t('retakeSameTopic') : t('retakeExam')}
              </Button>
              <Button size="lg" variant="outline" onClick={onExit} className="text-base sm:text-lg py-6">
                {t('backToHome')}
              </Button>
            </div>

            <div className="flex items-start gap-3 sm:gap-4 p-4 sm:p-5 bg-muted/50 rounded-lg">
              <Mail className="w-6 h-6 sm:w-5 sm:h-5 text-primary mt-0.5" />
              <div className="flex-1">
                <p className="font-semibold mb-2 text-base sm:text-lg">{t('errorReporting')}</p>
                <p className="text-base sm:text-sm text-muted-foreground mb-3 sm:mb-4">
                  {t('reportProblem')}
                </p>
                <Button variant="outline" size="default" onClick={handleReportError} className="text-base sm:text-sm">
                  {t('reportProblem')}
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};