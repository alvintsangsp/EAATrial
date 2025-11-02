import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Clock, FileText, CheckCircle2, AlertCircle } from "lucide-react";

interface ExamWelcomeProps {
  onStart: () => void;
}

export const ExamWelcome = ({ onStart }: ExamWelcomeProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 flex items-center justify-center p-4 sm:p-6">
      <Card className="max-w-2xl w-full p-6 sm:p-8 shadow-xl">
        <div className="text-center space-y-6 sm:space-y-8">
          <div className="inline-block p-3 sm:p-4 bg-primary/10 rounded-full">
            <FileText className="w-10 h-10 sm:w-12 sm:h-12 text-primary" />
          </div>
          
          <div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-2 sm:mb-3">EAA 模擬考試</h1>
            <p className="text-lg sm:text-xl text-muted-foreground">地產代理資格考試練習平台</p>
          </div>

          <div className="bg-muted/50 rounded-lg p-5 sm:p-6 space-y-4 sm:space-y-5 text-left">
            <h2 className="text-xl sm:text-2xl font-semibold mb-4">考試須知：</h2>
            
            <div className="space-y-4 sm:space-y-5">
              <div className="flex items-start gap-3 sm:gap-4">
                <FileText className="w-6 h-6 sm:w-7 sm:h-7 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-base sm:text-lg">題目數量</p>
                  <p className="text-base sm:text-lg text-muted-foreground mt-1">20條隨機選擇的題目</p>
                </div>
              </div>

              <div className="flex items-start gap-3 sm:gap-4">
                <Clock className="w-6 h-6 sm:w-7 sm:h-7 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-base sm:text-lg">考試時間</p>
                  <p className="text-base sm:text-lg text-muted-foreground mt-1">20分鐘倒數計時</p>
                </div>
              </div>

              <div className="flex items-start gap-3 sm:gap-4">
                <CheckCircle2 className="w-6 h-6 sm:w-7 sm:h-7 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-base sm:text-lg">題目格式</p>
                  <p className="text-base sm:text-lg text-muted-foreground mt-1">多項選擇題（4-5個選項）</p>
                </div>
              </div>

              <div className="flex items-start gap-3 sm:gap-4">
                <AlertCircle className="w-6 h-6 sm:w-7 sm:h-7 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-base sm:text-lg">考試功能</p>
                  <p className="text-base sm:text-lg text-muted-foreground mt-1">可在提交前檢閱及修改答案</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-accent/10 border border-accent/20 rounded-lg p-4 sm:p-5">
            <p className="text-base sm:text-lg text-accent-foreground">
              <strong className="text-lg sm:text-xl">合格標準：</strong> 答對60%或以上（12題或以上）
            </p>
          </div>

          <Button 
            onClick={onStart}
            size="lg"
            className="w-full text-lg sm:text-xl py-6 sm:py-7"
          >
            開始考試
          </Button>
        </div>
      </Card>
    </div>
  );
};
