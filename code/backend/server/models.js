import mongoose from "mongoose";

const TopicSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, index: true }, // e.g., 'physics', 'programming'
    name: { type: String, required: true },
    icon: { type: String, default: null }, // Optional field for icon URL
    description: { type: String, default: null }, // Optional field for topic description
    lessonCount: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
    order: { type: Number, default: 0 }, // Order for display purposes
  },
  {
    timestamps: true, // Automatically add createdAt and updatedAt fields
  },
);

const LessonSchema = new mongoose.Schema(
  {
    id: { type: Number, required: true },
    topicId: { type: String, required: true, ref: "Topic" }, // Reference to Topic
    title: { type: String, required: true },
    content: { type: String, required: true },
    duration: { type: String, default: "15 min" }, // e.g., '15 min'
    videoUrl: { type: String, default: null }, // Optional field for video URL
    order: { type: Number, default: 0 }, // Order for display purposes
  },
  {
    timestamps: true, // Automatically add createdAt and updatedAt fields
  },
);

const QuizSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, index: true }, // e.g., 'math-1'
    title: { type: String, required: true },
    subject: { type: String, required: true },
    questions: [
      {
        id: { type: Number, required: true },
        question: { type: String, required: true },
        options: { type: [String], required: true },
        correctAnswer: { type: Number, required: true },
        explanation: { type: String, default: null }, // Optional explanation
        points: { type: Number, default: 1 }, // Default points per question
      },
    ],
    duration: { type: Number, required: true }, // in seconds
    difficulty: {
      type: String,
      enum: ["Beginner", "Intermediate", "Advanced"],
      required: true,
    },
    xp: { type: Number, default: 0 }, // XP awarded for completing the quiz
  },
  {
    timestamps: true, // Automatically add createdAt and updatedAt fields
  },
);

const UserProgressSchema = new mongoose.Schema(
  {
    clerkId: { type: String, required: true, unique: true }, // Unique user ID
    xp: { type: Number, default: 0 }, // Total XP earned by the user
    streak: {
      current: { type: Number, default: 0 }, // Current streak count
      lastActivityDate: { type: Date, default: null }, // Date of last activity
    },
    completedQuizzes: [
      {
        quizId: { type: String, ref: "Quiz" }, // Reference to Quiz
        score: { type: Number, required: true }, // User's score in the quiz
        completedAt: { type: Date, default: Date.now }, // Completion timestamp
      },
    ],
    completedLessons: [
      {
        topicId: { type: String, ref: "Topic" }, // Reference to Topic
        lessonId: { type: Number, ref: "Lesson" }, // Reference to Lesson
        completedAt: { type: Date, default: Date.now }, // Completion timestamp
      },
    ],
    articlesRead: { type: Number, default: 0 }, // Count of articles read
  },
  {
    timestamps: true, // Automatically add createdAt and updatedAt fields
  },
);

export const Topic = mongoose.model("Topic", TopicSchema);
export const Lesson = mongoose.model("Lesson", LessonSchema);
export const Quiz = mongoose.model("Quiz", QuizSchema);
export const UserProgress = mongoose.model("UserProgress", UserProgressSchema);
