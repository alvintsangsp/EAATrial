import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { AlertTriangle, Mail } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const Disclaimer = () => {
  const [agreed, setAgreed] = useState(false);
  const navigate = useNavigate();

  const handleAccept = () => {
    if (agreed) {
      localStorage.setItem("disclaimerAccepted", "true");
      navigate("/");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 py-6 sm:py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header Warning Box */}
        <Card className="bg-destructive/10 border-destructive p-6 sm:p-8">
          <div className="flex items-start gap-4">
            <AlertTriangle className="w-8 h-8 sm:w-10 sm:h-10 text-destructive flex-shrink-0" />
            <div className="space-y-2">
              <h1 className="text-2xl sm:text-3xl font-bold text-destructive">⚠️ 重要通知</h1>
              <p className="text-base sm:text-lg leading-relaxed">
                <strong>本應用程式不會頻繁更新。</strong>您<strong>必須</strong>主動向官方 EAA 資源查證所有資訊，以保持您的知識是最新的。您有責任確保資訊準確及最新。
              </p>
            </div>
          </div>
        </Card>

        {/* Main Disclaimer Content */}
        <Card className="p-6 sm:p-8">
          <div className="space-y-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-center">免責聲明及使用條款</h2>

            <div className="space-y-5 text-base sm:text-lg">
              <div className="space-y-3">
                <h3 className="text-xl font-bold">1. 應用程式用途</h3>
                <p>本應用程式<strong>僅供個人教育及訓練用途</strong>，幫助您準備香港地產代理人員資格考試（EAQE）。</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>不是由香港地產代理監管局（EAA）官方開發或認可</li>
                  <li>不是官方考試資源</li>
                  <li>僅為輔助學習工具</li>
                </ul>
              </div>

              <div className="space-y-3">
                <h3 className="text-xl font-bold">2. 資料準確性 - 用戶責任</h3>
                <p className="font-semibold text-destructive">重要：您必須保持最新的資訊</p>
                <p>本應用程式的試題資訊<strong>可能不是最新的</strong>。香港的房地產法律和考試內容會定期改變。</p>
                <p className="font-semibold">您的責任：</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>您必須主動查證所有資訊，特別是最新的法律條款、現行的考試內容、官方的規定和指引</li>
                  <li>您不能完全依賴本應用程式</li>
                  <li>應主要參考香港地產代理監管局（EAA）的官方資源</li>
                  <li>應在考試前確認資訊是否仍然適用</li>
                </ul>
              </div>

              <div className="space-y-3">
                <h3 className="text-xl font-bold">3. 免責聲明</h3>
                <p>本應用程式按現狀提供，<strong>不提供任何保證</strong>：</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>❌ 不保證資訊 100% 準確</li>
                  <li>❌ 不保證能幫助您通過考試</li>
                  <li>❌ 不保證應用程式始終正常運作</li>
                  <li>❌ 不保證所有答案都正確</li>
                  <li>❌ 不保證沒有技術故障</li>
                </ul>
              </div>

              <div className="space-y-3">
                <h3 className="text-xl font-bold">4. 我們不承擔任何責任</h3>
                <p className="font-semibold">我們對以下所有情況概不負責：</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>考試失敗或成績不佳</li>
                  <li>失去工作機會或職業發展</li>
                  <li>資訊錯誤或遺漏</li>
                  <li>法律已改變但應用程式未更新</li>
                  <li>應用程式故障或崩潰</li>
                  <li>經濟損失、名譽損害或任何其他損失</li>
                </ul>
              </div>

              <div className="space-y-3">
                <h3 className="text-xl font-bold">5. 您的責任</h3>
                <p>使用本應用程式時，您必須：</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>為自己的學習進度負責</li>
                  <li>主動驗證所有重要資訊</li>
                  <li>參考官方的 EAA 資源</li>
                  <li>了解本應用程式的局限性</li>
                  <li>不能將考試失敗的責任歸咎於本應用程式</li>
                </ul>
              </div>

              <div className="space-y-3">
                <h3 className="text-xl font-bold">6. 使用規則</h3>
                <p>您<strong>不能</strong>：</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>複製或分享本應用程式的內容</li>
                  <li>用於商業目的</li>
                  <li>修改應用程式</li>
                  <li>進行任何非法活動</li>
                </ul>
              </div>

              <div className="bg-muted/50 rounded-lg p-5 space-y-3">
                <h3 className="text-xl font-bold flex items-center gap-2">
                  <Mail className="w-6 h-6 text-primary" />
                  錯誤回報
                </h3>
                <p>如您發現錯誤或有疑問，請聯繫我們：</p>
                <a 
                  href="mailto:cs@lazydads.net?subject=EAA%20Mock%20Exam%20-%20Error%20Report"
                  className="inline-flex items-center gap-2 text-primary hover:underline font-semibold"
                >
                  <Mail className="w-5 h-5" />
                  cs@lazydads.net
                </a>
                <p className="text-sm text-muted-foreground">請提供：題目編號、錯誤的詳細描述、正確答案或來源（如有）</p>
              </div>

              <div className="bg-destructive/10 border-2 border-destructive rounded-lg p-5 space-y-3">
                <p className="text-xl font-bold text-destructive">⚠️ 最後警告</p>
                <ul className="space-y-2">
                  <li>🔴 本應用程式不經常更新。您有責任保持最新的資訊。</li>
                  <li>🔴 不能依賴本應用程式通過考試。</li>
                  <li>🔴 開發者對任何損失概不負責。</li>
                  <li>🔴 請確保您同意所有條款。如不同意，請停止使用。</li>
                </ul>
              </div>
            </div>

            {/* Agreement Section */}
            <div className="border-t pt-6 space-y-6">
              <div className="flex items-start gap-3 p-4 bg-muted/30 rounded-lg">
                <Checkbox 
                  id="agree" 
                  checked={agreed}
                  onCheckedChange={(checked) => setAgreed(checked === true)}
                  className="mt-1"
                />
                <label 
                  htmlFor="agree" 
                  className="text-base sm:text-lg leading-relaxed cursor-pointer"
                >
                  我理解並同意上述所有條款。我明白本應用程式不會頻繁更新，我有責任向官方 EAA 資源查證所有資訊，以確保我的知識是最新和準確的。
                </label>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  onClick={handleAccept}
                  disabled={!agreed}
                  size="lg"
                  className="flex-1 text-lg py-6"
                >
                  同意並繼續
                </Button>
                <Button 
                  onClick={() => window.history.back()}
                  variant="outline"
                  size="lg"
                  className="flex-1 text-lg py-6"
                >
                  不同意
                </Button>
              </div>
            </div>

            <div className="text-center text-sm text-muted-foreground pt-4 border-t">
              <p>版本：1.0 | 最後更新：2025年11月</p>
              <p className="mt-2">使用本應用程式即表示您已閱讀、理解並同意上述所有條款。</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Disclaimer;
