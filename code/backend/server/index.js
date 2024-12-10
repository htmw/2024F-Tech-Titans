import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import { ClerkExpressWithAuth } from "@clerk/clerk-sdk-node";
import dotenv from "dotenv";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());
app.use(ClerkExpressWithAuth());

mongoose.connect(process.env.MONGODB_URI);

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

app.listen(process.env.PORT || 3000, () => {
  console.log(`Server running on port ${process.env.PORT || 3000}`);
});

// ------------------------------
// models.js - All MongoDB Schemas
import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  clerkId: { type: String, required: true, unique: true },
  email: String,
  name: String,
  profileImage: String,
  createdAt: { type: Date, default: Date.now },
  lastLoginAt: Date,
  settings: {
    notifications: { type: Boolean, default: true },
    emailPreferences: {
      dailyDigest: { type: Boolean, default: true },
      weeklyProgress: { type: Boolean, default: true },
    },
  },
});

const ContentTypeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  order: Number,
  isActive: { type: Boolean, default: true },
});

const ArticleSchema = new mongoose.Schema({
  contentTypeId: { type: mongoose.Schema.Types.ObjectId, ref: "ContentType" },
  title: { type: String, required: true },
  content: { type: String, required: true },
  order: Number,
  difficulty: { type: String, enum: ["beginner", "intermediate", "advanced"] },
  estimatedReadTime: Number,
  prerequisites: [{ type: mongoose.Schema.Types.ObjectId, ref: "Article" }],
  keyPoints: [String],
  metadata: {
    topic: String,
    subtopic: String,
    learningObjectives: [String],
  },
});

const QuizSchema = new mongoose.Schema({
  articleId: { type: mongoose.Schema.Types.ObjectId, ref: "Article" },
  title: String,
  description: String,
  questions: [
    {
      questionText: String,
      options: [
        {
          text: String,
          isCorrect: Boolean,
        },
      ],
      explanation: String,
      points: Number,
    },
  ],
  difficulty: String,
  timeLimit: Number,
  passingScore: Number,
});

const UserProgressSchema = new mongoose.Schema({
  clerkId: { type: String, required: true },
  contentTypeId: { type: mongoose.Schema.Types.ObjectId, ref: "ContentType" },
  articleId: { type: mongoose.Schema.Types.ObjectId, ref: "Article" },
  status: { type: String, enum: ["not_started", "in_progress", "completed"] },
  readCount: { type: Number, default: 0 },
  lastReadAt: Date,
  comprehensionScore: Number,
  notes: String,
  nextReviewDate: Date,
  repetitionLevel: Number,
});

const StreakSchema = new mongoose.Schema({
  clerkId: { type: String, required: true },
  currentStreak: { type: Number, default: 0 },
  longestStreak: { type: Number, default: 0 },
  lastActivityDate: Date,
  streakHistory: [
    {
      date: Date,
      activities: [
        {
          type: String,
          contentTypeId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "ContentType",
          },
          itemId: mongoose.Schema.Types.ObjectId,
        },
      ],
    },
  ],
});

export const User = mongoose.model("User", UserSchema);
export const ContentType = mongoose.model("ContentType", ContentTypeSchema);
export const Article = mongoose.model("Article", ArticleSchema);
export const Quiz = mongoose.model("Quiz", QuizSchema);
export const UserProgress = mongoose.model("UserProgress", UserProgressSchema);
export const Streak = mongoose.model("Streak", StreakSchema);
