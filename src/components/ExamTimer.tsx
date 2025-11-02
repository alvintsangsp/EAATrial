import { useEffect, useState } from "react";
import { Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface ExamTimerProps {
  startTime: number;
  duration: number; // in seconds
  onTimeUp: () => void;
}

export const ExamTimer = ({ startTime, duration, onTimeUp }: ExamTimerProps) => {
  const [timeLeft, setTimeLeft] = useState(duration);

  useEffect(() => {
    const interval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startTime) / 1000);
      const remaining = Math.max(0, duration - elapsed);
      
      setTimeLeft(remaining);

      if (remaining === 0) {
        clearInterval(interval);
        onTimeUp();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [startTime, duration, onTimeUp]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const isLowTime = timeLeft <= 300; // 5 minutes or less
  const isCritical = timeLeft <= 60; // 1 minute or less

  return (
    <div
      className={cn(
        "flex items-center gap-2 sm:gap-3 px-4 sm:px-6 py-3 sm:py-4 rounded-lg font-mono text-xl sm:text-2xl font-bold transition-colors shadow-lg",
        isCritical && "bg-destructive text-destructive-foreground animate-pulse",
        isLowTime && !isCritical && "bg-warning text-warning-foreground",
        !isLowTime && "bg-primary text-primary-foreground"
      )}
    >
      <Clock className="w-6 h-6 sm:w-7 sm:h-7" />
      <span>
        {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
      </span>
    </div>
  );
};
