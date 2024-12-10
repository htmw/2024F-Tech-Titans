import express from "express";
import { ClerkExpressRequireAuth } from "@clerk/clerk-sdk-node";
import {
  User,
  ContentType,
  Article,
  Quiz,
  UserProgress,
  Streak,
} from "./models.js";

const router = express.Router();

// Auth middleware
const requireAuth = ClerkExpressRequireAuth({});

// User routes
router.post("/users", requireAuth, async (req, res) => {
  try {
    const { userId } = req.auth;
    const userExists = await User.findOne({ clerkId: userId });

    if (!userExists) {
      const newUser = await User.create({
        clerkId: userId,
        email: req.body.email,
        name: req.body.name,
        profileImage: req.body.profileImage,
      });
      return res.status(201).json(newUser);
    }

    res.status(200).json(userExists);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Content routes
router.get("/content-types", requireAuth, async (req, res) => {
  try {
    const contentTypes = await ContentType.find({ isActive: true }).sort(
      "order",
    );
    res.json(contentTypes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/articles/:contentTypeId", requireAuth, async (req, res) => {
  try {
    const articles = await Article.find({
      contentTypeId: req.params.contentTypeId,
    }).sort("order");
    res.json(articles);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Progress routes
router.post("/progress", requireAuth, async (req, res) => {
  try {
    const { userId } = req.auth;
    const progress = await UserProgress.findOneAndUpdate(
      {
        clerkId: userId,
        articleId: req.body.articleId,
      },
      {
        ...req.body,
        lastReadAt: new Date(),
      },
      { upsert: true, new: true },
    );

    // Update streak
    await updateStreak(userId);

    res.json(progress);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Quiz routes
router.get("/quizzes/:articleId", requireAuth, async (req, res) => {
  try {
    const quiz = await Quiz.findOne({ articleId: req.params.articleId });
    res.json(quiz);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/quiz-attempts", requireAuth, async (req, res) => {
  try {
    const { userId } = req.auth;
    const quiz = await Quiz.findById(req.body.quizId);

    // Calculate score
    const score = calculateQuizScore(quiz, req.body.answers);

    // Update progress if passed
    if (score >= quiz.passingScore) {
      await UserProgress.findOneAndUpdate(
        { clerkId: userId, articleId: quiz.articleId },
        { status: "completed", comprehensionScore: score },
      );
    }

    res.json({ score });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Streak routes
router.get("/streaks", requireAuth, async (req, res) => {
  try {
    const { userId } = req.auth;
    const streak = await Streak.findOne({ clerkId: userId });
    res.json(streak || { currentStreak: 0, longestStreak: 0 });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Helper functions
async function updateStreak(clerkId) {
  const streak = await Streak.findOne({ clerkId });
  if (!streak) {
    return await Streak.create({
      clerkId,
      currentStreak: 1,
      longestStreak: 1,
      lastActivityDate: new Date(),
      streakHistory: [
        {
          date: new Date(),
          activities: [],
        },
      ],
    });
  }

  const today = new Date().toDateString();
  const lastActivity = new Date(streak.lastActivityDate).toDateString();

  if (today === lastActivity) {
    return streak;
  }

  const isConsecutiveDay =
    new Date(lastActivity).getTime() === new Date().getTime() - 86400000;

  const currentStreak = isConsecutiveDay ? streak.currentStreak + 1 : 1;
  const longestStreak = Math.max(currentStreak, streak.longestStreak);

  return await Streak.findOneAndUpdate(
    { clerkId },
    {
      currentStreak,
      longestStreak,
      lastActivityDate: new Date(),
    },
    { new: true },
  );
}

function calculateQuizScore(quiz, userAnswers) {
  let totalPoints = 0;
  let earnedPoints = 0;

  quiz.questions.forEach((question, index) => {
    const userAnswer = userAnswers[index];
    totalPoints += question.points;
    if (
      userAnswer &&
      question.options.find((o) => o.isCorrect && o.text === userAnswer)
    ) {
      earnedPoints += question.points;
    }
  });

  return (earnedPoints / totalPoints) * 100;
}

export default router;
