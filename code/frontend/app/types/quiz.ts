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
