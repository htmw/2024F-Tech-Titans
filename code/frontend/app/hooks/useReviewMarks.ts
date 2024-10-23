import { useState, useEffect, useCallback } from "react";
import { storage, StorageKeys } from "../utils/storage";

export const useReviewMarks = () => {
  const [reviewMarks, setReviewMarks] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadReviewMarks = useCallback(async () => {
    setIsLoading(true);
    try {
      const stored = await storage.get<string[]>(StorageKeys.REVIEW_MARKS);
      setReviewMarks(stored || []);
    } catch (error) {
      console.error("Error loading review marks:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadReviewMarks();
  }, [loadReviewMarks]);

  const toggleReviewMark = async (articleId: string) => {
    try {
      let newMarks: string[];
      if (reviewMarks.includes(articleId)) {
        newMarks = reviewMarks.filter((id) => id !== articleId);
      } else {
        newMarks = [...reviewMarks, articleId];
      }
      await storage.set(StorageKeys.REVIEW_MARKS, newMarks);
      setReviewMarks(newMarks);
      return true;
    } catch (error) {
      console.error("Error toggling review mark:", error);
      return false;
    }
  };

  return {
    reviewMarks,
    isLoading,
    toggleReviewMark,
    isMarkedForReview: (articleId: string) => reviewMarks.includes(articleId),
    refresh: loadReviewMarks,
  };
};
