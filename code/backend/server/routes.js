import express from "express";
import { ClerkExpressRequireAuth } from "@clerk/clerk-sdk-node";
import { Topic, Lesson, Quiz, UserProgress } from "./models.js";

const router = express.Router();
const requireAuth = ClerkExpressRequireAuth({});

// Topics routes
router.get("/topics", requireAuth, async (req, res) => {
  try {
    const topics = await Topic.find({ isActive: true }).sort("order");
    res.json(topics);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/topics/:id", requireAuth, async (req, res) => {
  try {
    const topic = await Topic.findOne({ id: req.params.id });
    if (!topic) {
      return res.status(404).json({ error: "Topic not found" });
    }
    res.json(topic);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Lessons routes
router.get("/topics/:id/lessons", requireAuth, async (req, res) => {
  try {
    const lessons = await Lesson.find({ topicId: req.params.id }).sort("order");
    res.json(lessons);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/topics/:id/lessons/:lessonId", requireAuth, async (req, res) => {
  try {
    const lesson = await Lesson.findOne({
      topicId: req.params.id,
      id: req.params.lessonId,
    });
    if (!lesson) {
      return res.status(404).json({ error: "Lesson not found" });
    }
    res.json(lesson);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Quizzes routes
router.get("/quizzes", requireAuth, async (req, res) => {
  try {
    const quizzes = await Quiz.find().sort("subject");
    res.json(quizzes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/quiz/:id", requireAuth, async (req, res) => {
  try {
    const quiz = await Quiz.findOne({ id: req.params.id });
    if (!quiz) {
      return res.status(404).json({ error: "Quiz not found" });
    }
    res.json(quiz);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// User Progress routes
router.get("/user-progress", requireAuth, async (req, res) => {
  try {
    const { userId } = req.auth;
    let progress = await UserProgress.findOne({ clerkId: userId });

    if (!progress) {
      progress = await UserProgress.create({
        clerkId: userId,
        xp: 0,
        streak: {
          current: 0,
          lastActivityDate: new Date(),
        },
      });
    }

    res.json(progress);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/complete-lesson", requireAuth, async (req, res) => {
  try {
    const { userId } = req.auth;
    const { topicId, lessonId } = req.body;

    const progress = await UserProgress.findOneAndUpdate(
      { clerkId: userId },
      {
        $push: {
          completedLessons: {
            topicId,
            lessonId,
            completedAt: new Date(),
          },
        },
        $inc: { xp: 100 }, // Award XP for completing lesson
        "streak.lastActivityDate": new Date(),
      },
      { new: true, upsert: true },
    );

    await updateStreak(userId);
    res.json(progress);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/submit-quiz", requireAuth, async (req, res) => {
  try {
    const { userId } = req.auth;
    const { quizId, answers } = req.body;

    const quiz = await Quiz.findOne({ id: quizId });
    if (!quiz) {
      return res.status(404).json({ error: "Quiz not found" });
    }

    // Calculate score
    let correctAnswers = 0;
    const results = quiz.questions.map((question, index) => {
      const isCorrect = question.correctAnswer === answers[index];
      if (isCorrect) correctAnswers++;
      return {
        isCorrect,
        correctAnswer: question.options[question.correctAnswer],
        explanation: question.explanation,
      };
    });

    const score = (correctAnswers / quiz.questions.length) * 100;

    // Update user progress
    await UserProgress.findOneAndUpdate(
      { clerkId: userId },
      {
        $push: {
          completedQuizzes: {
            quizId,
            score,
            completedAt: new Date(),
          },
        },
        $inc: { xp: Math.round(score) }, // Award XP based on score
        "streak.lastActivityDate": new Date(),
      },
      { new: true, upsert: true },
    );

    await updateStreak(userId);
    res.json({ score, results });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Helper function to update streak
async function updateStreak(clerkId) {
  const progress = await UserProgress.findOne({ clerkId });
  if (!progress) return;

  const lastActivity = new Date(progress.streak.lastActivityDate);
  const today = new Date();
  const diffDays = Math.floor((today - lastActivity) / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return; // Already updated today

  if (diffDays === 1) {
    // Consecutive day
    await UserProgress.findOneAndUpdate(
      { clerkId },
      { $inc: { "streak.current": 1 } },
    );
  } else {
    // Streak broken
    await UserProgress.findOneAndUpdate({ clerkId }, { "streak.current": 1 });
  }
}

export default router;
