// app/(tabs)/index.tsx
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Platform,
  Dimensions,
  Animated,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
  Trophy,
  Flame,
  ChevronRight,
  Book,
  AlertCircle,
  Clock,
  Star,
} from "lucide-react-native";
import { performanceStorage } from "../utils/performanceStorage";
import { quizQuestions } from "../utils/quizData";
import { UserPerformance } from "../types/learning";
import { QuizQuestion } from "../types/quiz";

const THEME_COLOR = "#58CC02";
const SCREEN_WIDTH = Dimensions.get("window").width;
const QUESTION_TIME = 30; // 30 seconds per question

interface QuizCardProps {
  subject: string;
  progress: number;
  onPress: () => void;
}

const QuizCard: React.FC<QuizCardProps> = ({ subject, progress, onPress }) => (
  <TouchableOpacity style={styles.quizCard} onPress={onPress}>
    <View style={styles.quizCardContent}>
      <View style={styles.quizCardHeader}>
        <Text style={styles.quizCardTitle}>{subject}</Text>
        <ChevronRight size={20} color="#666" />
      </View>
      <View style={styles.progressBar}>
        <View style={[styles.progressFill, { width: `${progress}%` }]} />
      </View>
      <Text style={styles.progressText}>{progress}% Complete</Text>
    </View>
  </TouchableOpacity>
);

const QuizScreen: React.FC<{
  questions: QuizQuestion[];
  onComplete: (score: number, timeSpent: number) => void;
  onClose: () => void;
}> = ({ questions, onComplete, onClose }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(QUESTION_TIME);
  const [streak, setStreak] = useState(0);
  const [timeSpent, setTimeSpent] = useState(0);
  const [isTimerActive, setIsTimerActive] = useState(true);

  // Question timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimerActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && !showExplanation) {
      handleTimerExpired();
    }
    return () => clearInterval(interval);
  }, [timeLeft, isTimerActive]);

  // Total time tracker
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeSpent((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleTimerExpired = () => {
    setShowExplanation(true);
    setIsTimerActive(false);
    setStreak(0);
  };

  const handleAnswer = (index: number) => {
    setSelectedAnswer(index);
    setShowExplanation(true);
    setIsTimerActive(false);

    const isCorrect = index === questions[currentQuestion].correctAnswer;
    if (isCorrect) {
      setScore((prev) => prev + 1);
      setStreak((prev) => prev + 1);
    } else {
      setStreak(0);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
      setTimeLeft(QUESTION_TIME);
      setIsTimerActive(true);
    } else {
      setCompleted(true);
      onComplete((score / questions.length) * 100, timeSpent);
    }
  };

  if (completed) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.quizContainer}>
          <View style={styles.quizComplete}>
            <Trophy size={48} color={THEME_COLOR} />
            <Text style={styles.quizCompleteTitle}>Quiz Complete!</Text>
            <View style={styles.scoreBreakdown}>
              <View style={styles.scoreItem}>
                <Star size={24} color="#FFD700" />
                <Text style={styles.scoreLabel}>Score</Text>
                <Text style={styles.quizCompleteScore}>
                  {((score / questions.length) * 100).toFixed(0)}%
                </Text>
              </View>
              <View style={styles.scoreItem}>
                <Clock size={24} color="#FF9500" />
                <Text style={styles.scoreLabel}>Time</Text>
                <Text style={styles.quizCompleteTime}>
                  {Math.floor(timeSpent / 60)}:
                  {(timeSpent % 60).toString().padStart(2, "0")}
                </Text>
              </View>
              <View style={styles.scoreItem}>
                <Flame size={24} color="#FF4B4B" />
                <Text style={styles.scoreLabel}>Best Streak</Text>
                <Text style={styles.quizCompleteStreak}>{streak}</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.button} onPress={onClose}>
              <Text style={styles.buttonText}>Return to Home</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.quizContainer}>
        <View style={styles.quizHeader}>
          <Text style={styles.questionCounter}>
            Question {currentQuestion + 1} of {questions.length}
          </Text>
          <View style={styles.timerContainer}>
            <Clock
              size={16}
              color={timeLeft <= 5 ? "#FF4B4B" : "#666"}
              style={timeLeft <= 5 && styles.timerWarningPulse}
            />
            <Text
              style={[
                styles.timerText,
                timeLeft <= 5 && styles.timerWarningText,
              ]}
            >
              {timeLeft}s
            </Text>
          </View>
          <TouchableOpacity
            onPress={onClose}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="close" size={24} color="#666" />
          </TouchableOpacity>
        </View>

        <View style={styles.streakContainer}>
          <Flame size={16} color="#FF9500" />
          <Text style={styles.streakText}>Streak: {streak}</Text>
        </View>

        <ScrollView
          style={styles.quizContent}
          bounces={false}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.question}>
            {questions[currentQuestion].question}
          </Text>

          <View style={styles.options}>
            {questions[currentQuestion].options.map((option, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.option,
                  selectedAnswer === index && styles.selectedOption,
                  showExplanation &&
                    index === questions[currentQuestion].correctAnswer &&
                    styles.correctOption,
                  showExplanation &&
                    selectedAnswer === index &&
                    selectedAnswer !==
                      questions[currentQuestion].correctAnswer &&
                    styles.incorrectOption,
                ]}
                onPress={() => !showExplanation && handleAnswer(index)}
                disabled={showExplanation}
              >
                <Text
                  style={[
                    styles.optionText,
                    selectedAnswer === index && styles.selectedOptionText,
                    showExplanation &&
                      (index === questions[currentQuestion].correctAnswer
                        ? styles.correctOptionText
                        : selectedAnswer === index
                          ? styles.incorrectOptionText
                          : styles.optionText),
                  ]}
                >
                  {option}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {showExplanation && (
            <View style={styles.explanation}>
              <AlertCircle size={20} color={THEME_COLOR} />
              <Text style={styles.explanationText}>
                {questions[currentQuestion].explanation}
              </Text>
            </View>
          )}
        </ScrollView>

        {showExplanation && (
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.button}
              onPress={handleNextQuestion}
            >
              <Text style={styles.buttonText}>
                {currentQuestion < questions.length - 1
                  ? "Next Question"
                  : "Complete Quiz"}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

export default function HomeScreen() {
  const [performances, setPerformances] = useState<UserPerformance[]>([]);
  const [activeQuiz, setActiveQuiz] = useState<string | null>(null);
  const [userId] = useState("user123"); // In real app, get from auth
  const [currentStreak, setCurrentStreak] = useState(0);
  const [level, setLevel] = useState(1);
  const [totalXP, setTotalXP] = useState(0);

  useEffect(() => {
    loadPerformance();
  }, []);

  const loadPerformance = async () => {
    const data = await performanceStorage.getUserPerformance(userId);
    setPerformances(data);

    // Calculate total XP and level
    const xp = data.reduce((sum, p) => sum + p.quizScore, 0);
    setTotalXP(xp);
    setLevel(Math.floor(xp / 1000) + 1);
  };

  const handleQuizComplete = async (score: number, timeSpent: number) => {
    if (activeQuiz) {
      const performance: UserPerformance = {
        articleId: activeQuiz,
        quizScore: score,
        timeSpent,
        lastReviewed: new Date(),
        reviewCount: 1,
        difficulty: 0.7,
        masteryLevel: score / 100,
      };
      await performanceStorage.updateUserPerformance(userId, performance);
      await loadPerformance();
      setActiveQuiz(null);
    }
  };

  const calculateSubjectProgress = (subjectId: string) => {
    const subjectQuizzes = quizQuestions[subjectId] || [];
    const completedQuizzes = performances.filter((p) =>
      subjectQuizzes.some((q) => q.articleId === p.articleId),
    ).length;
    return Math.round((completedQuizzes / subjectQuizzes.length) * 100);
  };

  if (activeQuiz) {
    const subjectQuestions = Object.values(quizQuestions)
      .flat()
      .filter((q) => q.articleId === activeQuiz);

    return (
      <QuizScreen
        questions={subjectQuestions}
        onComplete={handleQuizComplete}
        onClose={() => setActiveQuiz(null)}
      />
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <Text style={styles.welcome}>Welcome back!</Text>
          <View style={styles.xpContainer}>
            <Flame size={20} color="#FF9500" />
            <Text style={styles.xpText}>{totalXP} XP</Text>
          </View>
        </View>

        <View style={styles.levelSection}>
          <View style={styles.levelHeader}>
            <Text style={styles.levelTitle}>Level {level}</Text>
            <Text style={styles.levelProgress}>
              {totalXP % 1000}/{1000} XP to next level
            </Text>
          </View>
          <View style={styles.levelProgressBar}>
            <View
              style={[
                styles.levelProgressFill,
                { width: `${(totalXP % 1000) / 10}%` },
              ]}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Continue Learning</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <QuizCard
              subject="Mathematics"
              progress={calculateSubjectProgress("1")}
              onPress={() => setActiveQuiz("1")}
            />
            <QuizCard
              subject="Physics"
              progress={calculateSubjectProgress("2")}
              onPress={() => setActiveQuiz("6")}
            />
            <QuizCard
              subject="Chemistry"
              progress={calculateSubjectProgress("3")}
              onPress={() => setActiveQuiz("11")}
            />
          </ScrollView>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          {performances
            .slice(-3)
            .reverse()
            .map((performance) => (
              <View key={performance.articleId} style={styles.activityCard}>
                <Book size={20} color={THEME_COLOR} />
                <View style={styles.activityContent}>
                  <Text style={styles.activityTitle}>Quiz Completed</Text>
                  <Text style={styles.activityDate}>
                    {new Date(performance.lastReviewed).toLocaleDateString()}
                  </Text>
                </View>
                <View style={styles.scoreContainer}>
                  <Text style={styles.scoreText}>{performance.quizScore}%</Text>
                </View>
              </View>
            ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  // ... (keeping all existing styles)

  // New styles
  timerContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F0F0F0",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 4,
  },
  timerText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#666",
  },
  timerWarningText: {
    color: "#FF4B4B",
  },
  timerWarningPulse: {
    opacity: 0.7,
  },
  streakContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFF5E6",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginBottom: 16,
    gap: 4,
  },
  streakText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FF9500",
  },
  scoreBreakdown: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    paddingHorizontal: 20,
    marginVertical: 24,
  },
  scoreItem: {
    alignItems: "center",
    gap: 8,
  },
  scoreLabel: {
    fontSize: 14,
    color: "#666",
    fontWeight: "500",
  },
  levelSection: {
    padding: 20,
    backgroundColor: "#F8F9FA",
    marginHorizontal: 20,
    borderRadius: 12,
    marginBottom: 20,
  },
  levelHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  levelTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  levelProgress: {
    fontSize: 14,
    color: "#666",
  },
  levelProgressBar: {
    height: 8,
    backgroundColor: "#E0E0E0",
    borderRadius: 4,
    overflow: "hidden",
  },
  levelProgressFill: {
    height: "100%",
    backgroundColor: THEME_COLOR,
    borderRadius: 4,
  },
  buttonContainer: {
    padding: 20,
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#F0F0F0",
    paddingBottom: Platform.OS === "ios" ? 0 : 20,
  },
  // Animation related styles
  fadeIn: {
    opacity: 1,
    transform: [{ translateY: 0 }],
  },
  fadeOut: {
    opacity: 0,
    transform: [{ translateY: 20 }],
  },
});
