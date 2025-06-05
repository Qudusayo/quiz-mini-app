import { useEffect, useState, useMemo, useCallback } from "react";
import { decodeHtmlEntities } from "../../utils";
import { Typewriter } from "../components/typewriter";
import { Option } from "../components/quiz-option";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import Alert from "../components/alert";
import { Countdown } from "../components/countdown";
import { Score } from "../components/score";
import { GameOver } from "../components/game-over";
import { ComeBackTomorrow } from "../components/come-back-tomorrow";
import { useAccount } from "wagmi";
import { supabase } from "../../supabase";
import Button from "../components/button";
import { EndGameModal } from "../components/end-game-modal";
import { questions } from "../../questions";
import { Question } from "../../types";

// Helper function to get random questions by difficulty
function getRandomQuestionsByDifficulty(
  difficulty: string,
  count: number
): Question[] {
  const filteredQuestions = questions.filter(
    (q) => q.difficulty === difficulty
  );
  const shuffled = [...filteredQuestions].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

async function fetchQuestions(): Promise<Question[]> {
  try {
    const easyQuestions = getRandomQuestionsByDifficulty("easy", 1);
    const mediumQuestions = getRandomQuestionsByDifficulty("medium", 2);
    const hardQuestions = getRandomQuestionsByDifficulty("hard", 2);

    return [...easyQuestions, ...mediumQuestions, ...hardQuestions];
  } catch (error) {
    throw new Error("Failed to fetch questions");
  }
}

async function submitScore({
  address,
  score,
  elapsedTime,
}: {
  address: string;
  score: number;
  elapsedTime: number;
}) {
  const today = new Date().toISOString().slice(0, 10);

  const { error, data } = await supabase.from("daily_challenges").upsert(
    {
      wallet_address: address,
      score: score,
      date_played: today,
      time_taken: elapsedTime,
    },
    {
      onConflict: "wallet_address,date_played",
    }
  );

  if (error) {
    throw error;
  }

  return data;
}

async function checkDailyScore(address: string) {
  const today = new Date().toISOString().slice(0, 10);
  const { data, error } = await supabase
    .from("daily_challenges")
    .select("score")
    .eq("wallet_address", address)
    .eq("date_played", today)
    .single();

  if (error) {
    console.error("Error checking daily score:", error);
    return null;
  }

  return data;
}

function DailyChallenge() {
  const queryClient = useQueryClient();
  const { address } = useAccount();

  const { data: dailyScore, isLoading: isCheckingScore } = useQuery({
    queryKey: ["daily-score", address],
    queryFn: () => checkDailyScore(address!),
    enabled: !!address,
  });

  const {
    data: questions,
    isLoading: isLoadingQuestions,
    error,
  } = useQuery({
    queryKey: ["daily-questions"],
    queryFn: fetchQuestions,
    enabled: !!address && !dailyScore && !isCheckingScore, // Only fetch if we have address, no score, and done checking
    staleTime: Infinity,
    gcTime: 24 * 60 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    retry: true,
    retryDelay: 5000,
  });

  const { mutate: submitScoreMutation } = useMutation({
    mutationFn: submitScore,
    onError: (error) => {
      console.error("Error submitting score:", error);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["daily-score", address] });
    },
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
  const [hasScored, setHasScored] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [showEndGameModal, setShowEndGameModal] = useState(false);

  const currentQuestion = questions?.[currentQuestionIndex];

  // Add timer effect
  useEffect(() => {
    if (!isCountdownComplete || isGameOver) return;

    const timer = setInterval(() => {
      setElapsedTime((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [isCountdownComplete, isGameOver]);

  const allOptions = useMemo(() => {
    if (!currentQuestion) return [];
    return [
      currentQuestion.correct_answer,
      ...currentQuestion.incorrect_answers,
    ]
      .sort(() => Math.random() - 0.5)
      .map(decodeHtmlEntities);
  }, [currentQuestionIndex, currentQuestion]);

  const decodedCorrectAnswer = useMemo(() => {
    if (!currentQuestion) return "";
    return decodeHtmlEntities(currentQuestion.correct_answer);
  }, [currentQuestion]);

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
    setHasScored(false);
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
        // Update score based on difficulty when showing correct answer
        if (isCorrect && currentQuestion && !hasScored) {
          const difficultyPoints = {
            easy: 100,
            medium: 200,
            hard: 300,
          };
          setScore(
            (prev) =>
              prev +
              difficultyPoints[
                currentQuestion.difficulty as keyof typeof difficultyPoints
              ]
          );
          setHasScored(true);
        }
      }, 1800);

      // Move to next question after 5 seconds
      nextQuestionTimer = setTimeout(() => {
        if (questions && currentQuestionIndex === questions.length - 1) {
          setIsGameOver(true);
          // Submit score when game is over
          if (address) {
            submitScoreMutation({ address, score, elapsedTime });
          }
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
    questions,
    currentQuestionIndex,
    isCorrect,
    queryClient,
    address,
    score,
    submitScoreMutation,
    hasScored,
    currentQuestion,
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
    if (address) {
      submitScoreMutation({ address, score, elapsedTime });
    }
    setShowEndGameModal(false);
  };

  if (isCheckingScore) {
    return (
      <div className="h-full flex flex-col items-center justify-center w-fit mx-auto">
        <span className="text-white text-2xl font-semibold">
          Checking daily status...
        </span>
        <span className="loader"></span>
      </div>
    );
  }

  if (dailyScore) {
    return <ComeBackTomorrow score={dailyScore.score} />;
  }

  if (isLoadingQuestions) {
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

  if (!currentQuestion) {
    return (
      <div className="h-full flex items-center justify-center text-white">
        No question available
      </div>
    );
  }

  if (!isCountdownComplete) {
    return <Countdown onComplete={() => setIsCountdownComplete(true)} />;
  }

  if (isGameOver) {
    return <GameOver score={score} />;
  }

  return (
    <div className="relative h-full">
      <div className="absolute top- flex flex-row justify-between items-center w-full p-4">
        <Score value={score} elapsedTime={elapsedTime} />
        <Button
          onClick={() => setShowEndGameModal(true)}
          variant="danger"
          className="px-4 py-2 rounded-lg transition-colors m-0 min-h-10 w-32"
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

export default DailyChallenge;
