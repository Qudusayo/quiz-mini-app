import { cn } from "../../utils";
function Alert({
  isCorrect,
  showAlert,
  alertText,
}: {
  isCorrect: boolean;
  showAlert: boolean;
  alertText?: string;
}) {
  return (
    <div
      className={cn(
        "fixed top-4 left-1/2 -translate-x-1/2 px-4 py-2 rounded-md text-white transform transition-all duration-300 ease-in-out pointer-events-none",
        isCorrect ? "bg-green-500" : "bg-red-500",
        showAlert ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"
      )}
    >
      {alertText || (isCorrect ? "Correct!" : "Incorrect!")}
    </div>
  );
}

export default Alert;
