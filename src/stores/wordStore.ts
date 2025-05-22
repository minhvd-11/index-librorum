import { create } from "zustand";
import type { Word, Progress } from "~/types";

interface WordStore {
  currentWord: Word | null;
  progress: Progress[];
  setCurrentWord: (word: Word) => void;
  updateProgress: (progress: Progress) => void;
}

export const useWordStore = create<WordStore>((set) => ({
  currentWord: null,
  progress: [],
  setCurrentWord: (word) => set({ currentWord: word }),
  updateProgress: (progress) =>
    set((state) => ({
      progress: [
        ...state.progress.filter((p) => p.wordId !== progress.wordId),
        progress,
      ],
    })),
}));
