import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Clock, FileText, CheckCircle2, AlertCircle, AlertTriangle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ExamWelcomeProps {
  onStart: () => void;
}

export const ExamWelcome = ({ onStart }: ExamWelcomeProps) => {
  const [disclaimerOpen, setDisclaimerOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 flex flex-col items-center justify-center p-4 sm:p-6 gap-4">
      {/* Disclaimer Button at Top */}
      <Dialog open={disclaimerOpen} onOpenChange={setDisclaimerOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm" className="w-full sm:w-auto">
            <AlertTriangle className="w-4 h-4 mr-2" />
            免責聲明
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-3xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle className="text-2xl">EAA 模擬試卷應用程式 - 免責聲明</DialogTitle>
            <DialogDescription>
              使用本應用程式即表示您已同意以下所有條款
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="h-[60vh] pr-4">
            <div className="space-y-6 text-left">
              <div className="space-y-3">
                <h3 className="text-lg font-bold flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-destructive" />
                  重要通知
                </h3>
                <p className="text-sm text-muted-foreground">
                  使用本應用程式即表示您已同意以下所有條款。如您不同意，請停止使用。
                </p>
              </div>

              <div className="space-y-3">
                <h3 className="text-lg font-bold">1. 應用程式用途</h3>
                <p className="text-sm">本應用程式<strong>僅供個人教育及訓練用途</strong>，幫助您準備香港地產代理人員資格考試（EAQE）。</p>
                <p className="text-sm font-semibold">本應用程式：</p>
                <ul className="text-sm space-y-1 list-disc list-inside">
                  <li>不是由香港地產代理監管局（EAA）官方開發或認可</li>
                  <li>不是官方考試資源</li>
                  <li>僅為輔助學習工具</li>
                </ul>
              </div>

              <div className="space-y-3">
                <h3 className="text-lg font-bold">2. 資料準確性 - 用戶責任</h3>
                <p className="text-sm font-semibold">重要：您必須保持最新的資訊</p>
                <p className="text-sm">本應用程式的試題資訊<strong>可能不是最新的</strong>。香港的房地產法律和考試內容會定期改變。</p>
                <p className="text-sm font-semibold">您的責任：</p>
                <ul className="text-sm space-y-1 list-disc list-inside">
                  <li>您必須主動查證所有資訊，特別是最新的法律條款、現行的考試內容、官方的規定和指引</li>
                  <li>您不能完全依賴本應用程式</li>
                  <li>應主要參考香港地產代理監管局（EAA）的官方資源</li>
                  <li>應在考試前確認資訊是否仍然適用</li>
                </ul>
                <p className="text-sm">如發現任何錯誤或過時資訊，請立即聯繫我們：📧 cs@lazydads.net</p>
                <p className="text-sm font-bold text-destructive">本應用程式不會頻繁更新。您有責任確保您的知識是最新的。</p>
              </div>

              <div className="space-y-3">
                <h3 className="text-lg font-bold">3. 免責聲明</h3>
                <p className="text-sm font-semibold">我們不提供任何擔保</p>
                <p className="text-sm">本應用程式按現狀提供，<strong>不提供任何保證</strong>：</p>
                <ul className="text-sm space-y-1 list-disc list-inside">
                  <li>不保證資訊 100% 準確</li>
                  <li>不保證能幫助您通過考試</li>
                  <li>不保證應用程式始終正常運作</li>
                  <li>不保證所有答案都正確</li>
                  <li>不保證沒有技術故障</li>
                </ul>
              </div>

              <div className="space-y-3">
                <h3 className="text-lg font-bold">4. 我們不承擔任何責任</h3>
                <p className="text-sm font-semibold">我們對以下所有情況概不負責：</p>
                <ul className="text-sm space-y-1 list-disc list-inside">
                  <li>考試失敗或成績不佳、失去工作機會、失去職業發展</li>
                  <li>資訊錯誤或遺漏、法律已改變但應用程式未更新</li>
                  <li>應用程式故障或崩潰、無法保存您的答案</li>
                  <li>經濟損失、名譽損害、任何心理傷害、任何其他間接損失</li>
                </ul>
              </div>

              <div className="space-y-3">
                <h3 className="text-lg font-bold">5. 您的責任</h3>
                <p className="text-sm">使用本應用程式時，<strong>您必須：</strong></p>
                <ul className="text-sm space-y-1 list-disc list-inside">
                  <li>為自己的學習進度負責</li>
                  <li>主動驗證所有重要資訊</li>
                  <li>參考官方的 EAA 資源</li>
                  <li>了解本應用程式的局限性</li>
                  <li>不能將考試失敗的責任歸咎於本應用程式</li>
                </ul>
              </div>

              <div className="space-y-3">
                <h3 className="text-lg font-bold">6. 錯誤回報</h3>
                <p className="text-sm">如您發現錯誤，請聯繫我們：</p>
                <p className="text-sm font-semibold">📧 電郵：cs@lazydads.net</p>
                <p className="text-sm">請提供：題目編號（Question ID）、錯誤的詳細描述、正確答案或來源（如有）</p>
              </div>

              <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 space-y-2">
                <p className="text-sm font-bold text-destructive">⚠️ 最後警告</p>
                <ul className="text-sm space-y-1">
                  <li>🔴 本應用程式不經常更新。您有責任保持最新的資訊。</li>
                  <li>🔴 不能依賴本應用程式通過考試。</li>
                  <li>🔴 開發者對任何損失概不負責。</li>
                  <li>🔴 請在使用前確保您同意所有條款。如不同意，請停止使用。</li>
                </ul>
              </div>

              <div className="text-xs text-muted-foreground text-center pt-4 border-t">
                <p>版本：1.0 | 最後更新：2025年11月</p>
              </div>
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>

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
                  <p className="text-base sm:text-lg text-muted-foreground mt-1">30條隨機選擇的題目</p>
                </div>
              </div>

              <div className="flex items-start gap-3 sm:gap-4">
                <Clock className="w-6 h-6 sm:w-7 sm:h-7 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-base sm:text-lg">考試時間</p>
                  <p className="text-base sm:text-lg text-muted-foreground mt-1">60分鐘倒數計時</p>
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
            <p className="text-base sm:text-lg text-foreground">
              <strong className="text-lg sm:text-xl">合格標準：</strong> 答對60%或以上（18題或以上）
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
