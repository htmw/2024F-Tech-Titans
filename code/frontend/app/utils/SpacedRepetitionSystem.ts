export class SpacedRepetitionSystem {
  private static readonly INITIAL_INTERVAL = 24 * 60 * 60 * 1000; // 1 day in ms
  private static readonly EASE_FACTOR = 2.5;
  private static readonly MIN_INTERVAL = 24 * 60 * 60 * 1000; // 1 day
  private static readonly MAX_INTERVAL = 365 * 24 * 60 * 60 * 1000; // 1 year

  static calculateNextReview(performance: UserPerformance): Date {
    const baseInterval = this.INITIAL_INTERVAL;
    const successFactor = performance.quizScore / 100;
    const intervalMultiplier = Math.pow(
      this.EASE_FACTOR,
      performance.reviewCount,
    );

    let interval = baseInterval * intervalMultiplier * successFactor;
    interval = Math.max(
      this.MIN_INTERVAL,
      Math.min(this.MAX_INTERVAL, interval),
    );

    return new Date(Date.now() + interval);
  }

  static needsReview(performance: UserPerformance): boolean {
    return (
      Date.now() >= performance.lastReviewed.getTime() &&
      performance.masteryLevel < 0.9
    );
  }
}
