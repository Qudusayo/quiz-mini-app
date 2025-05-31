import { useEffect, useState, useMemo, useCallback } from "react";
import { CircularLoader } from "../components/loader";
import { decodeHtmlEntities } from "../../utils";
import { Typewriter } from "../components/typewriter";
import { Option } from "../components/quiz-option";
import { useQuery } from "@tanstack/react-query";
import Alert from "../components/alert";
import { Countdown } from "../components/countdown";

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

async function fetchQuestionsByDifficulty(difficulty: string): Promise<Question[]> {
  const response = await fetch(
    `https://opentdb.com/api.php?amount=5&type=multiple&difficulty=${difficulty}`
  );
  const data: QuizResponse = await response.json();

  if (data.response_code !== 0) {
    throw new Error(`Failed to fetch ${difficulty} questions`);
  }

  return data.results;
}

// Helper function to add delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

async function fetchQuestions(): Promise<Question[]> {
  try {
    // Fetch questions sequentially with delays
    const easyQuestions = await fetchQuestionsByDifficulty("easy");
    await delay(5000); // Wait 3 seconds

    const mediumQuestions = await fetchQuestionsByDifficulty("medium");
    await delay(5000); // Wait 3 seconds

    const hardQuestions = await fetchQuestionsByDifficulty("hard");

    // Combine all questions in order of difficulty
    return [...easyQuestions, ...mediumQuestions, ...hardQuestions];
  } catch (error) {
    throw new Error("Failed to fetch questions");
  }
}

function DailyChallenge() {
  const {
    data: questions,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["daily-questions"],
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
  const [_, setScore] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showAlert, setShowAlert] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showCorrectAnswer, setShowCorrectAnswer] = useState(false);
  const [isAnswerLocked, setIsAnswerLocked] = useState(false);
  const [isQuestionTyped, setIsQuestionTyped] = useState(false);
  const [isTyping, setIsTyping] = useState(true);
  const [isCountdownComplete, setIsCountdownComplete] = useState(false);

  const currentQuestion = questions?.[currentQuestionIndex];
  const progress = questions ? (currentQuestionIndex / questions.length) * 100 : 0;

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
      }, 1800);

      // Move to next question after 5 seconds
      nextQuestionTimer = setTimeout(() => {
        moveToNextQuestion();
      }, 5000);
    }

    return () => {
      if (notificationTimer) clearTimeout(notificationTimer);
      if (hideNotificationTimer) clearTimeout(hideNotificationTimer);
      if (correctAnswerTimer) clearTimeout(correctAnswerTimer);
      if (nextQuestionTimer) clearTimeout(nextQuestionTimer);
    };
  }, [selectedOption, moveToNextQuestion]);

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

    if (correct) {
      setScore((prev) => prev + 1);
    }
  };

  const handleTypingComplete = useCallback(() => {
    setIsTyping(false);
    setIsQuestionTyped(true);
  }, []);

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

  return (
    <div className="relative h-full">
      <div className="absolute top-4 left-4">
        <CircularLoader progress={progress} size={50} />
      </div>
      <div className="absolute top-[40%] left-1/2 -translate-x-1/2 -translate-y-1/2 text-white text-center text-2xl font-semibold w-full max-w-10/12">
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
    </div>
  );
}

export default DailyChallenge;
