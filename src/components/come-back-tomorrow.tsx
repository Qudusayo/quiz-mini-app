import { useEffect, useState } from "react";
import { ButtonLink } from "./button-link";

interface ComeBackTomorrowProps {
  score: number;
}

export function ComeBackTomorrow({ score }: ComeBackTomorrowProps) {
  const [timeLeft, setTimeLeft] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const tomorrow = new Date(now);
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0);

      const difference = tomorrow.getTime() - now.getTime();

      const hours = Math.floor(difference / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft({ hours, minutes, seconds });
    };

    // Calculate immediately
    calculateTimeLeft();

    // Update every second
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="h-full flex flex-col justify-center gap-12">
      <div className="text-center space-y-8">
        <div className="space-y-4">
          <span className="text-white text-2xl font-medium">
            Your Score Today:
          </span>
          <p className="text-white text-9xl font-inter">{score}</p>
        </div>
        <div className="space-y-4">
          <span className="text-white text-2xl font-medium">
            Next Challenge In:
          </span>
          <div className="flex justify-center gap-4 text-white text-4xl font-medium">
            <div className="flex flex-col items-center">
              <span className="font-inter">
                {timeLeft.hours.toString().padStart(2, "0")}
              </span>
              <span className="text-sm">Hours</span>
            </div>
            <span>:</span>
            <div className="flex flex-col items-center">
              <span className="font-inter">
                {timeLeft.minutes.toString().padStart(2, "0")}
              </span>
              <span className="text-sm">Minutes</span>
            </div>
            <span>:</span>
            <div className="flex flex-col items-center">
              <span className="font-inter">
                {timeLeft.seconds.toString().padStart(2, "0")}
              </span>
              <span className="text-sm">Seconds</span>
            </div>
          </div>
        </div>
      </div>
      <ButtonLink to="/">Back to Home</ButtonLink>
    </div>
  );
}
