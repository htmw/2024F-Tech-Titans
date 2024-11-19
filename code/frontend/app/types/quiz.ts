export interface QuizQuestion {
  id: string;
  articleId: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  topic: string;
  difficulty: number;
}

export interface QuizHistory {
  id: string;
  date: Date;
  score: number;
  timeSpent: number;
  subjectId: string;
  questionsAnswered: number;
  correctAnswers: number;
  streak: number;
}

export interface QuizStats {
  currentStreak: number;
  bestStreak: number;
  totalQuizzes: number;
  averageScore: number;
  totalXP: number;
  level: number;
}
