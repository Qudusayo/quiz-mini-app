import { cn } from "../../utils";
import { useState } from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isCorrect?: boolean;
  isIncorrect?: boolean;
  variant?: "danger" | "primary" | "secondary";
}

const Button = ({
  children,
  variant = "primary",
  isCorrect,
  isIncorrect,
  className = "",
  ...props
}: ButtonProps) => {
  const [isFlashing, setIsFlashing] = useState(false);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    setIsFlashing(true);
    setTimeout(() => setIsFlashing(false), 2000);
    props.onClick?.(e);
  };

  const baseStyles =
    "relative mx-auto text-center leading-2 align-middle text-white inline-block border-0 border-solid border-white p-2 cursor-pointer bg-transparent min-h-12.5 before:content-[''] before:absolute before:border-white before:border-solid before:h-1/2 before:w-full before:left-0 before:z-10 before:bg-[#5f4da0] before:border-t-2 before:border-r-2 before:border-l-2 before:border-b-0 before:top-0 before:origin-bottom before:[transform:perspective(0.5rem)_rotateX(3deg)] after:content-[''] after:absolute after:border-white after:border-solid after:h-1/2 after:w-full after:left-0 after:z-10 after:bg-[#5f4da0] after:border-b-2 after:border-r-2 after:border-l-2 after:border-t-0 after:bottom-0 after:origin-top after:[transform:perspective(0.5rem)_rotateX(-3deg)] text-base transition-colors duration-200 text-balance py-5";

  const variantStyles = {
    primary: "before:bg-[#5f4da0] after:bg-[#5f4da0]",
    secondary: "before:bg-[#5f4da0] after:bg-[#5f4da0]",
    danger: "before:bg-[#dc2626] after:bg-[#dc2626]",
  };

  return (
    <button
      {...props}
      onClick={handleClick}
      className={cn(
        baseStyles,
        variantStyles[variant],
        isFlashing && isCorrect && "animate-flash-success",
        isFlashing && isIncorrect && "animate-flash-error",
        isCorrect && "before:bg-[#1cac5a] after:bg-[#1cac5a]",
        isIncorrect && "before:bg-[#dc2626] after:bg-[#dc2626]",
        className
      )}
    >
      <span className="z-20 relative leading-0.5">{children}</span>
    </button>
  );
};

export default Button;
