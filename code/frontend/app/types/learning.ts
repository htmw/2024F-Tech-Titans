export interface UserPerformance {
  articleId: string;
  quizScore: number;
  timeSpent: number;
  lastReviewed: Date;
  reviewCount: number;
  difficulty: number;
  masteryLevel: number;
}

export interface ArticleMetadata {
  id: string;
  difficulty: number;
  subject: string;
  topics: string[];
  prerequisites: string[];
}
