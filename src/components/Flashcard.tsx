import { h } from "preact";
import { useState } from "preact/hooks";
import type { Word } from "~/types";

interface Props {
  word: Word;
}

export default function Flashcard({ word }: Props) {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  return (
    <div
      className="p-4 border rounded-lg bg-white dark:bg-gray-800 shadow-md cursor-pointer"
      onClick={handleFlip}
    >
      {isFlipped ? (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {word.translation}
          </h3>
          <p className="text-gray-600 dark:text-gray-300">
            {word.exampleSentence}
          </p>
        </div>
      ) : (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {word.word}
          </h3>
          <p className="text-gray-600 dark:text-gray-300">
            Click to reveal translation
          </p>
        </div>
      )}
    </div>
  );
}
