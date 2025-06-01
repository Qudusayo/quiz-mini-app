import { useEffect, useState } from "react";
import { ButtonLink } from "./button-link";

interface GameOverProps {
  score: number;
}

export function GameOver({ score }: GameOverProps) {
  const [displayScore, setDisplayScore] = useState(0);

  useEffect(() => {
    const duration = 1500; // Animation duration in milliseconds
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const currentValue = Math.round(score * easeOutQuart);

      setDisplayScore(currentValue);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [score]);

  return (
    <div className="h-full flex flex-col justify-center gap-12">
      <div className="text-center space-y-8">
        <h1 className="text-white text-4xl font-medium">Game Over!</h1>
        <span className="text-white text-2xl font-medium">
          Your Final Score:
        </span>
        <p className="text-white text-9xl ">{displayScore}</p>
      </div>
      <ButtonLink to="/">Back to Home</ButtonLink>
    </div>
  );
}
