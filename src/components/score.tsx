import { useEffect, useState } from "react";

interface ScoreProps {
  value: number;
  elapsedTime?: number;
}

export function Score({ value, elapsedTime }: ScoreProps) {
  const [displayValue, setDisplayValue] = useState(value);

  useEffect(() => {
    const duration = 1000; // Animation duration in milliseconds
    const startValue = displayValue;
    const endValue = value;
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const currentValue = Math.round(
        startValue + (endValue - startValue) * easeOutQuart
      );

      setDisplayValue(currentValue);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [value]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  return (
    <div className="flex flex-col">
      {elapsedTime !== undefined && (
        <span className="text-white text-sm font-semibold">
          {formatTime(elapsedTime)}
        </span>
      )}

      <div className="flex flex-row gap-2 items-center">
        <span className="text-white text-base font-semibold uppercase leading-5">
          Score:
        </span>
        <span className="text-white text-base font-semibold ">
          {displayValue}
        </span>
      </div>
    </div>
  );
}
