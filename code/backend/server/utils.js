export const calculateSpacedRepetition = (repetitionLevel, performance) => {
  const baseInterval = 1; // day
  const easeFactor = Math.max(1.3, 2.5 - 0.2 * (5 - performance));
  return Math.round(baseInterval * easeFactor * repetitionLevel);
};

export const validateQuizAnswers = (questions, answers) => {
  return questions.map((q, i) => ({
    isCorrect: q.options.find((o) => o.isCorrect).text === answers[i],
    correctAnswer: q.options.find((o) => o.isCorrect).text,
    explanation: q.explanation,
  }));
};
