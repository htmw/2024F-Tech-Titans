import mongoose from "mongoose";

const TopicSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true }, // e.g., 'physics', 'programming'
  name: { type: String, required: true },
  icon: String,
  description: String,
  lessonCount: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
  order: Number,
});

const LessonSchema = new mongoose.Schema({
  id: { type: Number, required: true },
  topicId: { type: String, required: true },
  title: { type: String, required: true },
  content: { type: String, required: true },
  duration: String, // e.g., '15 min'
  videoUrl: String,
  order: Number,
});

const QuizSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true }, // e.g., 'math-1'
  title: { type: String, required: true },
  subject: String,
  questions: [
    {
      id: Number,
      question: String,
      options: [String],
      correctAnswer: Number,
      explanation: String,
      points: { type: Number, default: 1 },
    },
  ],
  duration: Number, // in seconds
  difficulty: {
    type: String,
    enum: ["Beginner", "Intermediate", "Advanced"],
  },
});

const UserProgressSchema = new mongoose.Schema({
  clerkId: { type: String, required: true },
  xp: { type: Number, default: 0 },
  streak: {
    current: { type: Number, default: 0 },
    lastActivityDate: Date,
  },
  completedQuizzes: [
    {
      quizId: String,
      score: Number,
      completedAt: Date,
    },
  ],
  completedLessons: [
    {
      topicId: String,
      lessonId: Number,
      completedAt: Date,
    },
  ],
  articlesRead: { type: Number, default: 0 },
});

export const Topic = mongoose.model("Topic", TopicSchema);
export const Lesson = mongoose.model("Lesson", LessonSchema);
export const Quiz = mongoose.model("Quiz", QuizSchema);
export const UserProgress = mongoose.model("UserProgress", UserProgressSchema);
