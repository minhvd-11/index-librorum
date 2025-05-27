import { useState, useEffect } from "react";
import { supabase } from "~/lib/supabase";
import type { Word } from "~/types";

interface Props {
  words: Word[];
}

const Quiz: React.FC<Props> = ({ words }) => {
  const [currentQuestion, setCurrentQuestion] = useState<Word | null>(null);
  const [options, setOptions] = useState<Word[]>([]);
  const [feedback, setFeedback] = useState<string | null>(null);

  useEffect(() => {
    if (words.length > 0) {
      const randomWord = words[Math.floor(Math.random() * words.length)];
      const randomOptions = [...words]
        .sort(() => Math.random() - 0.5)
        .slice(0, 4)
        .filter((w) => w.id !== randomWord.id);
      if (!randomOptions.find((w) => w.id === randomWord.id)) {
        randomOptions[Math.floor(Math.random() * 4)] = randomWord;
      }
      setCurrentQuestion(randomWord);
      setOptions(randomOptions);
    }
  }, [words]);

  const handleAnswer = async (selected: Word) => {
    if (!currentQuestion) return;
    const isCorrect = selected.id === currentQuestion.id;
    setFeedback(isCorrect ? "Correct!" : "Try again!");

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) {
      const progress = {
        userId: user.id,
        wordId: currentQuestion.id,
        correctAttempts: isCorrect ? 1 : 0,
        lastReviewed: new Date().toISOString(),
        nextReview: new Date().toISOString(),
      };
      await supabase.from("progress").upsert(progress);
    }

    setTimeout(() => {
      setFeedback(null);
      const nextWord = words[Math.floor(Math.random() * words.length)];
      const nextOptions = [...words]
        .sort(() => Math.random() - 0.5)
        .slice(0, 4)
        .filter((w) => w.id !== nextWord.id);
      if (!nextOptions.find((w) => w.id === nextWord.id)) {
        nextOptions[Math.floor(Math.random() * 4)] = nextWord;
      }
      setCurrentQuestion(nextWord);
      setOptions(nextOptions);
    }, 1000);
  };

  if (!currentQuestion) {
    return <p className="text-gray-600 dark:text-gray-300">Loading quiz...</p>;
  }

  return (
    <div className="p-4 border rounded-lg bg-white dark:bg-gray-800 shadow-md">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
        What is the translation of "{currentQuestion.word}"?
      </h3>
      <div className="grid gap-2">
        {options.map((option) => (
          <button
            key={option.id}
            onClick={() => handleAnswer(option)}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            {option.translation}
          </button>
        ))}
      </div>
      {feedback && (
        <p
          className={`mt-2 ${
            feedback === "Correct!" ? "text-green-500" : "text-red-500"
          }`}
        >
          {feedback}
        </p>
      )}
    </div>
  );
};

export default Quiz;
