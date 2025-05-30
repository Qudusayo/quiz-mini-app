// https://opentdb.com/api.php?amount=5&type=multiple&difficulty=medium#

const easyQuiz = {
  response_code: 0,
  results: [
    {
      type: "multiple",
      difficulty: "easy",
      category: "Sports",
      question: "The Los Angeles Dodgers were originally from what U.S. city?",
      correct_answer: "Brooklyn",
      incorrect_answers: ["Las Vegas", "Boston", "Seattle"],
    },
    {
      type: "multiple",
      difficulty: "easy",
      category: "Entertainment: Television",
      question:
        "Which actor portrays &quot;Walter White&quot; in the series &quot;Breaking Bad&quot;?",
      correct_answer: " Bryan Cranston",
      incorrect_answers: ["Andrew Lincoln", "Aaron Paul", "RJ Mitte"],
    },
    {
      type: "multiple",
      difficulty: "easy",
      category: "Entertainment: Video Games",
      question:
        "What is the name of a popular franchise that includes placing blocks down and surviving in an open world? ",
      correct_answer: "Minecraft",
      incorrect_answers: ["Unturned", "Roblox", "Grand Theft Auto V"],
    },
    {
      type: "multiple",
      difficulty: "easy",
      category: "Entertainment: Video Games",
      question:
        "In the game &quot;Fire Emblem: Shadow Dragon&quot;, what is the central protagonist&#039;s name?",
      correct_answer: "Marth",
      incorrect_answers: ["Roy", "Eliwood", "Robin"],
    },
    {
      type: "multiple",
      difficulty: "easy",
      category: "Science: Computers",
      question:
        "The Electron computer was released in Britain during 1983 for the home computing market, by which company? ",
      correct_answer: "Acorn Computers",
      incorrect_answers: [
        "Sinclair Research",
        "Amstrad PLC",
        "Commodore Business Machines",
      ],
    },
  ],
};

const mediumQuiz = {
  response_code: 0,
  results: [
    {
      type: "multiple",
      difficulty: "medium",
      category: "Entertainment: Comics",
      question:
        "What is the real name of the &quot;Master Of Magnetism&quot; Magneto?",
      correct_answer: "Max Eisenhardt",
      incorrect_answers: [
        "Charles Xavier",
        "Pietro Maximoff",
        "Johann Schmidt",
      ],
    },
    {
      type: "multiple",
      difficulty: "medium",
      category: "Entertainment: Books",
      question:
        "Which poet wrote &quot;The Ballad of Reading Gaol&quot; whilst imprisoned for being gay?",
      correct_answer: "Oscar Wilde",
      incorrect_answers: ["Lord Byron", "William Blake", "Wilfred Owen"],
    },
    {
      type: "multiple",
      difficulty: "medium",
      category: "Geography",
      question:
        "All of the following countries have official claims to territory in Antartica EXCEPT:",
      correct_answer: "United States",
      incorrect_answers: ["Australia", "Chile", "Norway"],
    },
    {
      type: "multiple",
      difficulty: "medium",
      category: "Sports",
      question: "What is the oldest team in the NFL?",
      correct_answer: "Arizona Cardinals",
      incorrect_answers: [
        "Chicago Bears",
        "Green Bay Packers",
        "New York Giants",
      ],
    },
    {
      type: "multiple",
      difficulty: "medium",
      category: "General Knowledge",
      question: "What is the Swedish word for &quot;window&quot;?",
      correct_answer: "F&ouml;nster",
      incorrect_answers: ["H&aring;l", "Sk&auml;rm", "Ruta"],
    },
  ],
};

const hardQuiz = {
  response_code: 0,
  results: [
    {
      type: "multiple",
      difficulty: "hard",
      category: "Entertainment: Musicals &amp; Theatres",
      question:
        "Which Shakespeare play features the stage direction &quot;Enter a messenger, with two heads and a hand&quot;?",
      correct_answer: "Titus Andronicus",
      incorrect_answers: ["Othello", "Macbeth", "King Lear"],
    },
    {
      type: "multiple",
      difficulty: "hard",
      category: "Entertainment: Video Games",
      question: "Which car did not appear in the 2002 Lego Game: Drome Racers?",
      correct_answer: "Wasp",
      incorrect_answers: ["Raptor", "Hornet", "Behemoth"],
    },
    {
      type: "multiple",
      difficulty: "hard",
      category: "General Knowledge",
      question:
        "The Quadrangularis Reversum is best described as which of the following?",
      correct_answer: "A percussion instrument",
      incorrect_answers: [
        "A building in Oxford University",
        "A chess move",
        "A geometric theorem",
      ],
    },
    {
      type: "multiple",
      difficulty: "hard",
      category: "History",
      question:
        "In addition to his career as an astrologer and &quot;prophet&quot;, Nostradamus published a 1555 treatise that included a section on what?",
      correct_answer: "Making jams and jellies",
      incorrect_answers: [
        "Teaching parrots to talk",
        "Cheating at card games",
        "Digging graves",
      ],
    },
    {
      type: "multiple",
      difficulty: "hard",
      category: "Entertainment: Books",
      question:
        "In The Lies Of Locke Lamora, what does &quot;Lamora&quot; mean in Throne Therin?",
      correct_answer: "Shadow",
      incorrect_answers: ["Thievery", "Justice", "Chaos"],
    },
  ],
};

const quiz = [...easyQuiz.results, ...mediumQuiz.results, ...hardQuiz.results];

export default quiz;
