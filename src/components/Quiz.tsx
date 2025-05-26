import { h } from "preact";
import { useState, useEffect } from "preact/hooks";
import { wordStore } from "~/stores/wordStore";
import { supabase } from "~/lib/supabase";
import { useSignal } from "@preact/signals";
import type { Progress, Word } from "~/types";

// Utility to shuffle an array
const shuffleArray = function <T>(array: T[]): T[] {
  return array.sort(() => Math.random() - 0.5);
};

interface QuizProps {
  words: Word[];
}

export default function Quiz({ words }: QuizProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<string>("");
  const [isCorrect, setIsCorrect] = useState<boolean>(false);
  const currentWord = wordStore.currentWord;
  const quizOptions = wordStore.quizOptions;

  useEffect(() => {
    if (!words || words.length < 2) return;

    const randomWord = words[Math.floor(Math.random() * words.length)];
    const incorrectOptions = shuffleArray(
      words.filter((w) => w.id !== randomWord.id)
    ).slice(0, Math.min(3, words.length - 1));
    const options = shuffleArray([randomWord, ...incorrectOptions]);

    wordStore.setCurrentWord(randomWord);
    wordStore.setQuizOptions(options);
  }, [words]);

  const handleAnswer = async (selected: string) => {
    if (!currentWord.value) return;

    setSelectedAnswer(selected);
    const correct = selected === currentWord.value?.translation;
    setIsCorrect(correct);

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      console.error("User not logged in");
      return;
    }

    const progress: Progress = {
      userId: user.id,
      wordId: currentWord.value.id,
      status: correct ? "learning" : "review",
      lastReviewed: new Date(),
      nextReview: new Date(Date.now() + (correct ? 24 : 12) * 60 * 60 * 1000),
      correctAttempts: correct ? 1 : 0,
      incorrectAttempts: correct ? 0 : 1,
    };

    wordStore.updateProgress(progress);
    const { error } = await supabase.from("progress").upsert(progress);
    if (error) console.error("Error saving progress:", error.message);

    setTimeout(() => {
      setSelectedAnswer("");
      setIsCorrect(false);
      const newRandomWord = words[Math.floor(Math.random() * words.length)];
      const incorrectOptions = shuffleArray(
        words.filter((w) => w.id !== newRandomWord.id)
      ).slice(0, Math.min(3, words.length - 1));
      wordStore.setCurrentWord(newRandomWord);
      wordStore.setQuizOptions(
        shuffleArray([newRandomWord, ...incorrectOptions])
      );
    }, 1500);
  };

  if (!words || words.length < 2) {
    return <p>Not enough words to start the quiz. Please add more words.</p>;
  }

  if (!currentWord.value || quizOptions.value.length === 0) {
    return <p>Loading quiz...</p>;
  }

  return (
    <div className="p-4 border rounded-lg bg-white dark:bg-gray-800 shadow-md">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
        What is the translation of "{currentWord.value.word}"?
      </h2>
      <div className="grid gap-2">
        {quizOptions.value.map((option) => (
          <button
            key={option.id}
            className={`px-4 py-2 rounded transition-colors ${
              selectedAnswer === option.translation
                ? isCorrect
                  ? "bg-green-500 text-white"
                  : "bg-red-500 text-white"
                : "bg-blue-500 text-white hover:bg-blue-600"
            }`}
            onClick={() => handleAnswer(option.translation)}
            disabled={!!selectedAnswer}
          >
            {option.translation}
          </button>
        ))}
      </div>
      {isCorrect !== null && (
        <p
          className={`mt-4 text-lg ${
            isCorrect ? "text-green-600" : "text-red-600"
          }`}
        >
          {isCorrect ? "Correct!" : "Incorrect, try again!"}
        </p>
      )}
    </div>
  );
}
