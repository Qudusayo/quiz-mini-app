import { useEffect, useRef, useState } from "react";

export const Typewriter = ({
  text,
  isTyping,
  onComplete,
}: {
  text: string;
  isTyping: boolean;
  onComplete: () => void;
}) => {
  const [displayText, setDisplayText] = useState("");
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    let currentIndex = 0;

    const typeNextChar = () => {
      if (currentIndex < text.length) {
        setDisplayText(text.slice(0, currentIndex + 1));
        currentIndex++;
        timeoutRef.current = setTimeout(typeNextChar, 70);
      } else {
        onComplete();
      }
    };

    if (isTyping) {
      setDisplayText("");
      currentIndex = 0;
      timeoutRef.current = setTimeout(typeNextChar, 70);
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [text, isTyping, onComplete]);

  return (
    <div className="relative">
      {displayText}
      {isTyping && (
        <span className="inline-block w-[2px] h-[1em] bg-white ml-[2px] animate-blink" />
      )}
    </div>
  );
};
