import { h } from "preact";
import { useState } from "preact/hooks";
import { wordStore } from "~/stores/wordStore";
import { supabase } from "~/lib/supabase";
import type { Word } from "~/types";

interface FlashcardProps {
  word: Word;
}

export default function Flashcard({ word }: FlashcardProps) {
  const [isFlipped, setIsFlipped] = useState<boolean>(false);

  const handleCorrect = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      console.error("User not logged in");
      return;
    }

    const progress = {
      userId: user.id,
      wordId: word.id,
      status: "learning" as const,
      lastReviewed: new Date(),
      nextReview: new Date(Date.now() + 24 * 60 * 60 * 1000),
      correctAttempts: 1,
      incorrectAttempts: 0,
    };

    wordStore.setCurrentWord(word);
    wordStore.updateProgress(progress);

    const { error } = await supabase.from("progress").upsert(progress);
    if (error) console.error("Error saving progress:", error.message);
  };

  return (
    <div
      className="p-4 border rounded-lg cursor-pointer bg-white dark:bg-gray-800 shadow-md hover:shadow-lg transition-shadow"
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
        {isFlipped ? word.translation : word.word}
      </h2>
      <p className="mt-2 text-gray-600 dark:text-gray-300">
        {word.exampleSentence}
      </p>
      <div className="mt-4 flex gap-2">
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          onClick={(e) => {
            e.stopPropagation();
            setIsFlipped(!isFlipped);
          }}
        >
          {isFlipped ? "Show Word" : "Show Translation"}
        </button>
        <button
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
          onClick={(e) => {
            e.stopPropagation();
            handleCorrect();
          }}
        >
          Mark as Correct
        </button>
      </div>
    </div>
  );
}
