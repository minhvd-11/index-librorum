export interface Word {
  id: string;
  word: string;
  translation: string;
  exampleSentence: string;
  audioUrl?: string;
  difficulty: "easy" | "medium" | "hard";
  category?: string;
}

export interface Progress {
  userId: string;
  wordId: string;
  status: "learning" | "review" | "mastered";
  lastReviewed: Date;
  nextReview: Date;
  correctAttempts: number;
  incorrectAttempts: number;
}
