import { Article } from "../types/article";

interface SimilarityScore {
  article: Article;
  score: number;
}

export class ArticleRecommendationEngine {
  static getArticleRecommendations(
    readArticles: Article[],
    allArticles: Article[],
    limit: number = 5,
  ): Article[] {
    // If no articles read, return first 5 articles sorted by XP (easiest first)
    if (!readArticles.length) {
      return allArticles.sort((a, b) => a.xp - b.xp).slice(0, limit);
    }

    // Calculate average XP of read articles to determine user level
    const avgXP =
      readArticles.reduce((sum, article) => sum + article.xp, 0) /
      readArticles.length;

    // Get articles user hasn't read yet
    const unreadArticles = allArticles.filter(
      (article) => !readArticles.some((read) => read.id === article.id),
    );

    // Calculate content similarity using TF-IDF
    const scoredArticles: SimilarityScore[] = unreadArticles.map((article) => {
      let score = 0;

      // Base score from XP similarity (closer = higher score)
      score += 1 - Math.abs(article.xp - avgXP) / 30;

      // Topic similarity bonus
      if (readArticles.some((read) => read.topic === article.topic)) {
        score += 0.5;
      }

      // Content similarity using word overlap
      const articleWords = new Set(article.content.toLowerCase().split(/\W+/));
      readArticles.forEach((readArticle) => {
        const readWords = new Set(
          readArticle.content.toLowerCase().split(/\W+/),
        );
        const overlap = [...articleWords].filter((word) =>
          readWords.has(word),
        ).length;
        score += overlap / 1000; // Normalize content similarity score
      });

      const difficultyScore = article.xp > avgXP ? 0.2 : 0;
      score += difficultyScore;

      return { article, score };
    });

    // Sort by score and return top N articles
    return scoredArticles
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map((item) => item.article);
  }

  static calculateReadingLevel(articles: Article[]): number {
    if (!articles.length) return 1;
    const avgXP =
      articles.reduce((sum, article) => sum + article.xp, 0) / articles.length;
    return Math.ceil(avgXP / 10);
  }

  static getNextRecommendedLevel(currentXP: number): number {
    return Math.min(Math.ceil(currentXP / 1000) + 1, 5);
  }
}
