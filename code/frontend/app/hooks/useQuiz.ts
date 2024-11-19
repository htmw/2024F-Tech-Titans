import { useState, useCallback } from "react";
import { QuizQuestion } from "../types/quiz";
import { performanceStorage } from "../utils/performanceStorage";

export const useQuiz = (userId: string, onComplete?: () => void) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [score, setScore] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);

  const handleAnswer = useCallback(
    (questionId: string, answerIndex: number, correctAnswer: number) => {
      setAnswers((prev) => ({
        ...prev,
        [questionId]: answerIndex,
      }));

      if (answerIndex === correctAnswer) {
        setScore((prev) => prev + 1);
      }

      setShowExplanation(true);
    },
    [],
  );

  const handleNextQuestion = useCallback(
    (totalQuestions: number) => {
      if (currentQuestionIndex < totalQuestions - 1) {
        setCurrentQuestionIndex((prev) => prev + 1);
        setShowExplanation(false);
      }
    },
    [currentQuestionIndex],
  );

  const saveQuizResult = useCallback(
    async (articleId: string, totalQuestions: number, timeSpent: number) => {
      const finalScore = (score / totalQuestions) * 100;

      const performance = {
        articleId,
        quizScore: finalScore,
        timeSpent,
        lastReviewed: new Date(),
        reviewCount: 1,
        difficulty: 0.7,
        masteryLevel: finalScore / 100,
      };

      await performanceStorage.updateUserPerformance(userId, performance);

      if (onComplete) {
        onComplete();
      }
    },
    [score, userId, onComplete],
  );

  const resetQuiz = useCallback(() => {
    setCurrentQuestionIndex(0);
    setAnswers({});
    setScore(0);
    setShowExplanation(false);
  }, []);

  return {
    currentQuestionIndex,
    answers,
    score,
    showExplanation,
    handleAnswer,
    handleNextQuestion,
    saveQuizResult,
    resetQuiz,
  };
};
