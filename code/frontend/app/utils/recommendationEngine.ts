export class RecommendationEngine {
  static getRecommendedArticles(
    userPerformance: UserPerformance[],
    metadata: Map<string, ArticleMetadata>,
    currentMasteryLevel: number,
  ): string[] {
    const weakAreas = this.identifyWeakAreas(userPerformance, metadata);
    const targetDifficulty =
      this.calculateTargetDifficulty(currentMasteryLevel);

    const recommendations = Array.from(metadata.values())
      .filter((article) => {
        const hasWeakTopic = article.topics.some((t) => weakAreas.includes(t));
        const appropriateDifficulty =
          Math.abs(article.difficulty - targetDifficulty) <= 0.2;
        const notRecentlyReviewed = !userPerformance.some(
          (p) =>
            p.articleId === article.id &&
            Date.now() - p.lastReviewed.getTime() < 24 * 60 * 60 * 1000,
        );

        return hasWeakTopic && appropriateDifficulty && notRecentlyReviewed;
      })
      .sort(
        (a, b) =>
          Math.abs(a.difficulty - targetDifficulty) -
          Math.abs(b.difficulty - targetDifficulty),
      )
      .map((article) => article.id);

    return recommendations;
  }

  private static identifyWeakAreas(
    performances: UserPerformance[],
    metadata: Map<string, ArticleMetadata>,
  ): string[] {
    const topicPerformance = new Map<string, number[]>();

    performances.forEach((perf) => {
      const article = metadata.get(perf.articleId);
      if (!article) return;

      article.topics.forEach((topic) => {
        const scores = topicPerformance.get(topic) || [];
        scores.push(perf.quizScore);
        topicPerformance.set(topic, scores);
      });
    });

    return Array.from(topicPerformance.entries())
      .map(([topic, scores]) => ({
        topic,
        avgScore: scores.reduce((a, b) => a + b, 0) / scores.length,
      }))
      .filter((tp) => tp.avgScore < 70)
      .sort((a, b) => a.avgScore - b.avgScore)
      .map((tp) => tp.topic);
  }

  private static calculateTargetDifficulty(masteryLevel: number): number {
    return Math.min(1, masteryLevel + 0.1);
  }
}

interface SimilarityScore {
  article: Article;
  similarity: number;
}

export class ArticleRecommendationEngine {
  static calculateCosineSimilarity(
    vector1: number[],
    vector2: number[],
  ): number {
    const dotProduct = vector1.reduce(
      (acc, val, i) => acc + val * vector2[i],
      0,
    );
    const magnitude1 = Math.sqrt(
      vector1.reduce((acc, val) => acc + val * val, 0),
    );
    const magnitude2 = Math.sqrt(
      vector2.reduce((acc, val) => acc + val * val, 0),
    );
    return dotProduct / (magnitude1 * magnitude2);
  }

  static extractFeatureVector(article: Article): Map<string, number> {
    const words = article.content.toLowerCase().split(/\W+/);
    const vector = new Map<string, number>();

    words.forEach((word) => {
      if (word.length > 2) {
        vector.set(word, (vector.get(word) || 0) + 1);
      }
    });

    // Add topic and tags to the feature vector
    vector.set(article.topic, (vector.get(article.topic) || 0) + 3); // Weight topics more
    article.tags.forEach((tag) => {
      vector.set(tag, (vector.get(tag) || 0) + 2); // Weight tags
    });

    return vector;
  }

  static getArticleRecommendations(
    readArticles: Article[],
    allArticles: Article[],
    limit: number = 5,
  ): Article[] {
    if (!readArticles.length) return allArticles.slice(0, limit);

    // Create feature vectors for all articles
    const articleVectors = new Map<string, Map<string, number>>();
    allArticles.forEach((article) => {
      articleVectors.set(article.id, this.extractFeatureVector(article));
    });

    // Calculate user profile
    const userProfile = new Map<string, number>();
    readArticles.forEach((article) => {
      const vector = articleVectors.get(article.id);
      vector?.forEach((value, key) => {
        userProfile.set(key, (userProfile.get(key) || 0) + value);
      });
    });

    // Calculate similarities
    const similarities: SimilarityScore[] = allArticles
      .filter((article) => !readArticles.some((read) => read.id === article.id))
      .map((article) => {
        const similarity = this.calculateCosineSimilarity(
          Array.from(userProfile.values()),
          Array.from(articleVectors.get(article.id)?.values() || []),
        );
        return { article, similarity };
      })
      .sort((a, b) => b.similarity - a.similarity);

    return similarities.slice(0, limit).map((item) => item.article);
  }
}
