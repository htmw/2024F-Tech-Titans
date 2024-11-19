export const quizStorage = {
  async getQuizHistory(userId: string): Promise<QuizHistory[]> {
    const key = `${StorageKeys.QUIZ_HISTORY}_${userId}`;
    return (await storage.get<QuizHistory[]>(key)) || [];
  },

  async saveQuizHistory(userId: string, history: QuizHistory): Promise<void> {
    const key = `${StorageKeys.QUIZ_HISTORY}_${userId}`;
    const histories = await this.getQuizHistory(userId);
    histories.push(history);
    await storage.set(key, histories);
  },

  async getQuizStats(userId: string): Promise<QuizStats> {
    const key = `${StorageKeys.QUIZ_STATS}_${userId}`;
    return (
      (await storage.get<QuizStats>(key)) || {
        currentStreak: 0,
        bestStreak: 0,
        totalQuizzes: 0,
        averageScore: 0,
        totalXP: 0,
        level: 1,
      }
    );
  },

  async updateQuizStats(
    userId: string,
    stats: Partial<QuizStats>,
  ): Promise<void> {
    const key = `${StorageKeys.QUIZ_STATS}_${userId}`;
    const currentStats = await this.getQuizStats(userId);
    await storage.set(key, { ...currentStats, ...stats });
  },
};
