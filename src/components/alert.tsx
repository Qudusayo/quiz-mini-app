import { cn } from "../../utils";
function Alert({
  isCorrect,
  showAlert,
}: {
  isCorrect: boolean;
  showAlert: boolean;
}) {
  return (
    <div
      className={cn(
        "fixed top-4 left-1/2 -translate-x-1/2 px-4 py-2 rounded-md text-white transform transition-all duration-300 ease-in-out pointer-events-none",
        isCorrect ? "bg-green-500" : "bg-red-500",
        showAlert ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"
      )}
    >
      {isCorrect ? "Correct!" : "Incorrect!"}
    </div>
  );
}

export default Alert;
