import { signal } from "@preact/signals";
import type { Word, Progress } from "~/types";

interface WordStore {
  currentWord?: Word;
  progress: Progress[];
  quizOptions: Word[];
}

export const wordStore = {
  currentWord: signal<Word>(),
  progress: signal<Progress[]>([]),
  quizOptions: signal<Word[]>([]),
  setCurrentWord: (word: Word) => {
    wordStore.currentWord.value = word;
  },
  setQuizOptions: (options: Word[]) => {
    wordStore.quizOptions.value = options;
  },
  updateProgress: (progress: Progress) => {
    wordStore.progress.value = [
      ...wordStore.progress.value.filter((p) => p.wordId !== progress.wordId),
      progress,
    ];
  },
};
