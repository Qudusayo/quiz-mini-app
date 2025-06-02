import { useEffect, useState, useMemo, useCallback } from "react";
import { decodeHtmlEntities } from "../../utils";
import { Typewriter } from "../components/typewriter";
import { Option } from "../components/quiz-option";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import Alert from "../components/alert";
import { Countdown } from "../components/countdown";
import { Score } from "../components/score";
import { GameOver } from "../components/game-over";
import Button from "../components/button";
import { EndGameModal } from "../components/end-game-modal";

interface Question {
  type: string;
  difficulty: string;
  category: string;
  question: string;
  correct_answer: string;
  incorrect_answers: string[];
}

interface QuizResponse {
  response_code: number;
  results: Question[];
}

async function fetchQuestions(): Promise<Question[]> {
  const response = await fetch(
    "https://opentdb.com/api.php?amount=5&type=multiple"
  );
  const data: QuizResponse = await response.json();

  if (data.response_code !== 0) {
    throw new Error("Failed to fetch questions");
  }

  return data.results;
}

function getQuestionPoints(difficulty: string): number {
  switch (difficulty) {
    case "easy":
      return 100;
    case "medium":
      return 200;
    case "hard":
      return 300;
    default:
      return 0;
  }
}

function QuickPlay() {
  const queryClient = useQueryClient();
  const {
    data: questions,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["questions"],
    queryFn: fetchQuestions,
    staleTime: Infinity,
    gcTime: 24 * 60 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    retry: true,
    retryDelay: 5000,
  });

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showAlert, setShowAlert] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showCorrectAnswer, setShowCorrectAnswer] = useState(false);
  const [isAnswerLocked, setIsAnswerLocked] = useState(false);
  const [isQuestionTyped, setIsQuestionTyped] = useState(false);
  const [isTyping, setIsTyping] = useState(true);
  const [isCountdownComplete, setIsCountdownComplete] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [showEndGameModal, setShowEndGameModal] = useState(false);

  const allOptions = useMemo(() => {
    if (!questions || questions.length === 0) return [];
    const currentQuestion = questions[currentQuestionIndex];
    return [
      currentQuestion.correct_answer,
      ...currentQuestion.incorrect_answers,
    ]
      .sort(() => Math.random() - 0.5)
      .map(decodeHtmlEntities);
  }, [currentQuestionIndex, questions]);

  const decodedCorrectAnswer = useMemo(() => {
    if (!questions || questions.length === 0) return "";
    const currentQuestion = questions[currentQuestionIndex];
    return decodeHtmlEntities(currentQuestion.correct_answer);
  }, [currentQuestionIndex, questions]);

  const moveToNextQuestion = useCallback(() => {
    if (questions && currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  }, [currentQuestionIndex, questions]);

  // Reset states when question changes
  useEffect(() => {
    setSelectedOption(null);
    setShowAlert(false);
    setIsCorrect(false);
    setShowCorrectAnswer(false);
    setIsAnswerLocked(false);
    setIsQuestionTyped(false);
    setIsTyping(true);
  }, [currentQuestionIndex]);

  // Handle timers when an option is selected
  useEffect(() => {
    let notificationTimer: ReturnType<typeof setTimeout>;
    let hideNotificationTimer: ReturnType<typeof setTimeout>;
    let correctAnswerTimer: ReturnType<typeof setTimeout>;
    let nextQuestionTimer: ReturnType<typeof setTimeout>;

    if (selectedOption) {
      // Show notification after 2 seconds
      notificationTimer = setTimeout(() => {
        setShowAlert(true);
      }, 1800);

      // Hide notification after 4 seconds
      hideNotificationTimer = setTimeout(() => {
        setShowAlert(false);
      }, 4000);

      // Show correct answer after animation completes (2.1 seconds)
      correctAnswerTimer = setTimeout(() => {
        setShowCorrectAnswer(true);
        // Update score when showing correct answer
        if (isCorrect && questions && questions.length > 0) {
          const points = getQuestionPoints(
            questions[currentQuestionIndex].difficulty
          );
          setScore((prev) => prev + points);
        }
      }, 1800);

      // Move to next question after 5 seconds
      nextQuestionTimer = setTimeout(() => {
        if (questions && currentQuestionIndex === questions.length - 1) {
          setIsGameOver(true);
          queryClient.invalidateQueries({ queryKey: ["questions"] });
        } else {
          moveToNextQuestion();
        }
      }, 5000);
    }

    return () => {
      if (notificationTimer) clearTimeout(notificationTimer);
      if (hideNotificationTimer) clearTimeout(hideNotificationTimer);
      if (correctAnswerTimer) clearTimeout(correctAnswerTimer);
      if (nextQuestionTimer) clearTimeout(nextQuestionTimer);
    };
  }, [
    selectedOption,
    moveToNextQuestion,
    isCorrect,
    questions,
    currentQuestionIndex,
    queryClient,
  ]);

  const handleOptionClick = (option: string) => {
    if (isAnswerLocked) return;

    // Reset states first
    setShowAlert(false);
    setShowCorrectAnswer(false);

    // Set new states
    setSelectedOption(option);
    const correct = option === decodedCorrectAnswer;
    setIsCorrect(correct);
    setIsAnswerLocked(true);
  };

  const handleTypingComplete = useCallback(() => {
    setIsTyping(false);
    setIsQuestionTyped(true);
  }, []);

  const handleEndGame = () => {
    setIsGameOver(true);
    queryClient.invalidateQueries({ queryKey: ["questions"] });
    setShowEndGameModal(false);
  };

  if (isLoading) {
    return (
      <div className="h-full flex flex-col items-center justify-center w-fit mx-auto">
        <span className="text-white text-2xl font-semibold">
          Loading questions
        </span>
        <span className="loader"></span>
      </div>
    );
  }

  if (error || !questions || questions.length === 0) {
    return (
      <div className="h-full flex items-center justify-center text-white">
        {error instanceof Error ? error.message : "No questions available"}
      </div>
    );
  }

  if (!isCountdownComplete) {
    return <Countdown onComplete={() => setIsCountdownComplete(true)} />;
  }

  if (isGameOver) {
    return <GameOver score={score} />;
  }

  const currentQuestion = questions[currentQuestionIndex];
  if (!currentQuestion) {
    return (
      <div className="h-full flex items-center justify-center text-white">
        No question available
      </div>
    );
  }

  return (
    <div className="relative h-full">
      <div className="absolute top- flex flex-row justify-between items-center w-full p-4">
        <Score value={score} />
        <Button
          onClick={() => setShowEndGameModal(true)}
          variant="danger"
          className="px-4 py-2 rounded-lg transition-colors m-0 min-h-10 w-40"
        >
          End Game
        </Button>
      </div>
      <div className="absolute top-[40%] left-1/2 -translate-x-1/2 -translate-y-1/2 text-white text-center text-2xl font-semibold w-full max-w-10/12">
        <span className="text-white text-sm font-semibold">
          Question {currentQuestionIndex + 1} of {questions.length}
        </span>
        <Typewriter
          text={decodeHtmlEntities(currentQuestion.question)}
          isTyping={isTyping}
          onComplete={handleTypingComplete}
        />
      </div>
      {isQuestionTyped && (
        <div className="absolute bottom-12 left-0 right-0 space-y-2">
          {allOptions.map((option, index) => (
            <Option
              key={`${currentQuestionIndex}-${index}`}
              text={option}
              onClick={() => handleOptionClick(option)}
              isSelected={selectedOption === option}
              isCorrect={selectedOption === option && isCorrect}
              isIncorrect={selectedOption === option && !isCorrect}
              showAsCorrect={
                showCorrectAnswer && option === decodedCorrectAnswer
              }
              disabled={isAnswerLocked}
            />
          ))}
        </div>
      )}
      <Alert isCorrect={isCorrect} showAlert={showAlert} />
      {showEndGameModal && (
        <EndGameModal
          onConfirm={handleEndGame}
          onCancel={() => setShowEndGameModal(false)}
        />
      )}
    </div>
  );
}

export default QuickPlay;
