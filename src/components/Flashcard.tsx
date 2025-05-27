import { useState } from "react";
import { motion } from "framer-motion";
import type { Word } from "~/types";

interface Props {
  word: Word;
}

const Flashcard: React.FC<Props> = ({ word }) => {
  const [isFlipped, setIsFlipped] = useState<boolean>(false);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  return (
    <motion.div
      className="p-4 border rounded-lg bg-white dark:bg-gray-800 shadow-md cursor-pointer h-48"
      onClick={handleFlip}
      style={{ perspective: "1000px" }}
      initial={false}
    >
      <motion.div
        className="relative w-full h-full"
        style={{ transformStyle: "preserve-3d" }}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.3 }}
      >
        <div
          className="absolute w-full h-full p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md"
          style={{ backfaceVisibility: "hidden" }}
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {word.word}
          </h3>
          <p className="text-gray-600 dark:text-gray-300">
            Click to reveal translation
          </p>
        </div>
        <div
          className="absolute w-full h-full p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md"
          style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {word.translation}
          </h3>
          <p className="text-gray-600 dark:text-gray-300">
            {word.exampleSentence}
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Flashcard;
