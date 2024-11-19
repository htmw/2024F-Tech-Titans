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
