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
  BarChart2,
  Target,
  Brain,
  TrendingUp,
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

  const getWeakAreas = () => {
    const topicPerformance = new Map<
      string,
      { total: number; count: number }
    >();

    performances.forEach((perf) => {
      const questions = Object.values(quizQuestions)
        .flat()
        .filter((q) => q.articleId === perf.articleId);

      questions.forEach((q) => {
        const curr = topicPerformance.get(q.topic) || { total: 0, count: 0 };
        curr.total += perf.quizScore;
        curr.count += 1;
        topicPerformance.set(q.topic, curr);
      });
    });

    return Array.from(topicPerformance.entries())
      .map(([topic, stats]) => ({
        topic,
        average: stats.count > 0 ? stats.total / stats.count : 0,
      }))
      .filter((topic) => topic.average < 70)
      .sort((a, b) => a.average - b.average)
      .slice(0, 3);
  };

  const getRecommendedQuizzes = () => {
    const weakAreas = getWeakAreas();
    const weakTopics = new Set(weakAreas.map((area) => area.topic));

    return Object.values(quizQuestions)
      .flat()
      .filter((q) => weakTopics.has(q.topic))
      .filter((q) => !performances.some((p) => p.articleId === q.articleId))
      .slice(0, 3);
  };

  const getPerformanceStats = () => {
    if (performances.length === 0) return null;

    const totalQuizzes = performances.length;
    const avgScore =
      performances.reduce((sum, p) => sum + p.quizScore, 0) / totalQuizzes;
    const avgTime =
      performances.reduce((sum, p) => sum + p.timeSpent, 0) / totalQuizzes;

    return { totalQuizzes, avgScore, avgTime };
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

        {/* Performance Dashboard */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Performance Overview</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <BarChart2 size={24} color={THEME_COLOR} />
              <Text style={styles.statValue}>
                {getPerformanceStats()?.avgScore.toFixed(1)}%
              </Text>
              <Text style={styles.statLabel}>Avg Score</Text>
            </View>
            <View style={styles.statCard}>
              <Target size={24} color="#FF9500" />
              <Text style={styles.statValue}>
                {getPerformanceStats()?.totalQuizzes || 0}
              </Text>
              <Text style={styles.statLabel}>Quizzes</Text>
            </View>
            <View style={styles.statCard}>
              <Brain size={24} color="#CE82FF" />
              <Text style={styles.statValue}>{level}</Text>
              <Text style={styles.statLabel}>Level</Text>
            </View>
          </View>
        </View>

        {/* Recommended Quizzes */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recommended for You</Text>
            <TrendingUp size={20} color={THEME_COLOR} />
          </View>
          <Text style={styles.sectionSubtitle}>
            Based on your performance in weak areas
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {getRecommendedQuizzes().map((quiz) => (
              <TouchableOpacity
                key={quiz.id}
                style={styles.recommendationCard}
                onPress={() => setActiveQuiz(quiz.articleId)}
              >
                <View style={styles.recommendationHeader}>
                  <Text style={styles.recommendationTopic}>{quiz.topic}</Text>
                  <View style={styles.difficultyBadge}>
                    <Text style={styles.difficultyText}>
                      Level {Math.ceil(quiz.difficulty * 5)}
                    </Text>
                  </View>
                </View>
                <Text style={styles.recommendationTitle}>{quiz.question}</Text>
                <View style={styles.recommendationFooter}>
                  <Brain size={16} color="#666" />
                  <Text style={styles.recommendationHint}>
                    Practice to improve {quiz.topic}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Areas to Improve */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Areas to Improve</Text>
          {getWeakAreas().map((area) => (
            <View key={area.topic} style={styles.weakAreaCard}>
              <View style={styles.weakAreaHeader}>
                <Text style={styles.weakAreaTopic}>{area.topic}</Text>
                <Text style={styles.weakAreaScore}>
                  {area.average.toFixed(1)}%
                </Text>
              </View>
              <View style={styles.weakAreaProgress}>
                <View
                  style={[
                    styles.weakAreaProgressFill,
                    { width: `${area.average}%` },
                  ]}
                />
              </View>
            </View>
          ))}
        </View>

        {/* Continue Learning */}
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

        {/* Recent Activity */}
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
  // Base Container Styles
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  safeArea: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },

  // Header Styles
  header: {
    padding: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  welcome: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  xpContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF5E6",
    padding: 8,
    borderRadius: 16,
    gap: 4,
  },
  xpText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FF9500",
  },

  // Section Styles
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#333",
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: "#666",
    marginBottom: 16,
  },

  // Level Section Styles
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

  // Stats Grid Styles
  statsGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    gap: 8,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  statValue: {
    fontSize: 20,
    fontWeight: "700",
    color: "#333",
  },
  statLabel: {
    fontSize: 12,
    color: "#666",
    textAlign: "center",
  },

  // Quiz Card Styles
  quizCard: {
    width: SCREEN_WIDTH * 0.7,
    marginRight: 16,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  quizCardContent: {
    gap: 12,
  },
  quizCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  quizCardTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  progressBar: {
    height: 4,
    backgroundColor: "#F0F0F0",
    borderRadius: 2,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: THEME_COLOR,
  },
  progressText: {
    fontSize: 14,
    color: "#666",
  },

  // Recommendation Styles
  recommendationCard: {
    width: SCREEN_WIDTH * 0.7,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginRight: 16,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  recommendationHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  recommendationTopic: {
    fontSize: 14,
    fontWeight: "600",
    color: THEME_COLOR,
  },
  difficultyBadge: {
    backgroundColor: "#F0F0F0",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  difficultyText: {
    fontSize: 12,
    color: "#666",
  },
  recommendationTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 12,
    lineHeight: 22,
  },
  recommendationFooter: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  recommendationHint: {
    fontSize: 12,
    color: "#666",
  },

  // Weak Areas Styles
  weakAreaCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  weakAreaHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  weakAreaTopic: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  weakAreaScore: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FF4B4B",
  },
  weakAreaProgress: {
    height: 4,
    backgroundColor: "#F0F0F0",
    borderRadius: 2,
    overflow: "hidden",
  },
  weakAreaProgressFill: {
    height: "100%",
    backgroundColor: THEME_COLOR,
    borderRadius: 2,
  },

  // Activity Card Styles
  activityCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#F8F9FA",
    borderRadius: 12,
    marginBottom: 12,
  },
  activityContent: {
    flex: 1,
    marginLeft: 12,
  },
  activityTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
  },
  activityDate: {
    fontSize: 12,
    color: "#666",
    marginTop: 2,
  },
  scoreContainer: {
    backgroundColor: "#E8F4EA",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  scoreText: {
    fontSize: 14,
    fontWeight: "600",
    color: THEME_COLOR,
  },

  // Quiz Screen Styles
  quizContainer: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  quizHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  questionCounter: {
    fontSize: 16,
    color: "#666",
  },
  quizContent: {
    flex: 1,
    padding: 20,
  },
  question: {
    fontSize: 22,
    fontWeight: "600",
    color: "#333",
    marginBottom: 24,
    lineHeight: 30,
  },
  options: {
    gap: 12,
    marginBottom: 24,
  },
  option: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    backgroundColor: "#FFFFFF",
  },
  selectedOption: {
    borderColor: THEME_COLOR,
    backgroundColor: "#F0FFF4",
  },
  correctOption: {
    borderColor: THEME_COLOR,
    backgroundColor: "#F0FFF4",
  },
  incorrectOption: {
    borderColor: "#FF4B4B",
    backgroundColor: "#FFF0F0",
  },
  optionText: {
    fontSize: 16,
    color: "#333",
  },
  selectedOptionText: {
    color: THEME_COLOR,
    fontWeight: "600",
  },
  correctOptionText: {
    color: THEME_COLOR,
    fontWeight: "600",
  },
  incorrectOptionText: {
    color: "#FF4B4B",
    fontWeight: "600",
  },

  // Timer Styles
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

  // Streak Styles
  streakContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFF5E6",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginHorizontal: 20,
    marginTop: 12,
    marginBottom: 16,
  },
  streakText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FF9500",
  },

  // Quiz Complete Styles
  quizComplete: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  quizCompleteTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginTop: 16,
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
  quizCompleteScore: {
    fontSize: 24,
    fontWeight: "bold",
    color: THEME_COLOR,
  },
  quizCompleteTime: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FF9500",
  },
  quizCompleteStreak: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FF4B4B",
  },

  // Button Styles
  buttonContainer: {
    padding: 20,
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#F0F0F0",
    paddingBottom: Platform.OS === "ios" ? 0 : 20,
  },
  button: {
    backgroundColor: THEME_COLOR,
    padding: 16,
    borderRadius: 30,
    alignItems: "center",
    ...Platform.select({
      ios: {
        shadowColor: THEME_COLOR,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "700",
  },

  // Explanation Styles
  explanation: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "#F0FFF4",
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
    gap: 12,
  },
  explanationText: {
    flex: 1,
    fontSize: 14,
    color: "#333",
    lineHeight: 20,
  },
});
