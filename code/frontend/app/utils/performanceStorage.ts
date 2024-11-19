import { storage } from "./storage";

export const StorageKeys = {
  ...storage.StorageKeys,
  USER_PERFORMANCE: "user_performance",
  ARTICLE_METADATA: "article_metadata",
} as const;

export const performanceStorage = {
  async getUserPerformance(userId: string): Promise<UserPerformance[]> {
    const key = `${StorageKeys.USER_PERFORMANCE}_${userId}`;
    return (await storage.get<UserPerformance[]>(key)) || [];
  },

  async updateUserPerformance(
    userId: string,
    performance: UserPerformance,
  ): Promise<boolean> {
    const key = `${StorageKeys.USER_PERFORMANCE}_${userId}`;
    const performances = await this.getUserPerformance(userId);
    const index = performances.findIndex(
      (p) => p.articleId === performance.articleId,
    );

    if (index >= 0) {
      performances[index] = performance;
    } else {
      performances.push(performance);
    }

    return await storage.set(key, performances);
  },
};
