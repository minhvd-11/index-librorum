import { h } from "preact";
import { useState, useEffect } from "preact/hooks";
import { supabase } from "~/lib/supabase";
import { wordStore } from "~/stores/wordStore";
import type { Progress, Word } from "~/types";

interface Props {
  words: Word[];
}

export default function Quiz({ words }: Props) {
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
      wordStore.setCurrentWord(randomWord);
      wordStore.setQuizOptions(randomOptions);
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
      const progress: Progress = {
        userId: user.id,
        wordId: currentQuestion.id,
        status: isCorrect ? "learning" : "review",
        lastReviewed: new Date(),
        nextReview: new Date(
          Date.now() + (isCorrect ? 24 : 12) * 60 * 60 * 1000
        ),
        correctAttempts: isCorrect ? 1 : 0,
        incorrectAttempts: isCorrect ? 0 : 1,
      };
      wordStore.updateProgress(progress);
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
      wordStore.setCurrentWord(nextWord);
      wordStore.setQuizOptions(nextOptions);
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
}
