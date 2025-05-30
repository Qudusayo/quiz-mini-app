import OptionButton from "./button";
import { cn } from "../../utils";

export const Option = ({
  text,
  onClick,
  isSelected,
  isCorrect,
  isIncorrect,
  showAsCorrect,
  disabled,
}: {
  text: string;
  onClick: () => void;
  isSelected: boolean;
  isCorrect: boolean;
  isIncorrect: boolean;
  showAsCorrect: boolean;
  disabled: boolean;
}) => {
  return (
    <div className="relative animate-slide-up">
      <div className="relative">
        <OptionButton
          className={cn(
            "lg:w-3/5 w-4/5 mx-auto block",
            (disabled || isSelected) && "cursor-not-allowed"
          )}
          onClick={onClick}
          isCorrect={isCorrect || showAsCorrect}
          isIncorrect={isIncorrect}
          disabled={disabled || isSelected}
        >
          {text}
        </OptionButton>
        <div className="absolute inset-0 flex items-center">
          <div className="w-full h-[2px] bg-white"></div>
        </div>
      </div>
    </div>
  );
};
