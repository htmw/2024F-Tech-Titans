import * as SecureStore from "expo-secure-store";

export const StorageKeys = {
  REVIEW_MARKS: "review_marks",
} as const;

export const storage = {
  async get<T>(key: string): Promise<T | null> {
    try {
      const item = await SecureStore.getItemAsync(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error(`Error getting item ${key}:`, error);
      return null;
    }
  },

  async set(key: string, value: any): Promise<boolean> {
    try {
      await SecureStore.setItemAsync(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error(`Error setting item ${key}:`, error);
      return false;
    }
  },

  async remove(key: string): Promise<boolean> {
    try {
      await SecureStore.deleteItemAsync(key);
      return true;
    } catch (error) {
      console.error(`Error removing item ${key}:`, error);
      return false;
    }
  },
};
