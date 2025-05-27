import { signal } from "@preact/signals";
import type { Word, Progress } from "~/types";

interface WordStore {
  currentWord: Word | null;
  progress: Progress[];
  quizOptions: Word[];
}

export const wordStore = {
  currentWord: signal<Word | null>(null),
  progress: signal<Progress[]>([]),
  quizOptions: signal<Word[]>([]),
  setCurrentWord: (word: Word) => {
    wordStore.currentWord.value = word;
  },
  setQuizOptions: (options: Word[]) => {
    wordStore.quizOptions.value = options;
  },
  updateProgress: (progress: Progress) => {
    const existingProgress = wordStore.progress.value.find(
      (p) => p.wordId === progress.wordId && p.userId === progress.userId
    );

    let intervalHours: number;
    if (!existingProgress) {
      intervalHours = progress.correctAttempts > 0 ? 24 : 12;
    } else {
      const baseInterval =
        existingProgress.correctAttempts > 0
          ? 24 * Math.pow(2, existingProgress.correctAttempts)
          : 12;
      intervalHours =
        progress.correctAttempts > existingProgress.correctAttempts
          ? baseInterval * 2
          : baseInterval / 2 || 12;
    }

    progress.lastReviewed = new Date();
    progress.nextReview = new Date(
      progress.lastReviewed.getTime() + intervalHours * 60 * 60 * 1000
    );

    wordStore.progress.value = [
      ...wordStore.progress.value.filter(
        (p) => p.wordId !== progress.wordId || p.userId !== progress.userId
      ),
      progress,
    ];
  },
};
