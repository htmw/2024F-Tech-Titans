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
} from "lucide-react-native";
import { performanceStorage } from "../utils/performanceStorage";
import { quizQuestions } from "../utils/quizData";
import { UserPerformance } from "../types/learning";
import { QuizQuestion } from "../types/quiz";

const THEME_COLOR = "#58CC02";
const SCREEN_WIDTH = Dimensions.get("window").width;

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
  onComplete: (score: number) => void;
  onClose: () => void;
}> = ({ questions, onComplete, onClose }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [completed, setCompleted] = useState(false);

  if (completed) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.quizContainer}>
          <View style={styles.quizComplete}>
            <Trophy size={48} color={THEME_COLOR} />
            <Text style={styles.quizCompleteTitle}>Quiz Complete!</Text>
            <Text style={styles.quizCompleteScore}>
              Score: {((score / questions.length) * 100).toFixed(0)}%
            </Text>
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
          <TouchableOpacity
            onPress={onClose}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="close" size={24} color="#666" />
          </TouchableOpacity>
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
              onPress={() => {
                if (currentQuestion < questions.length - 1) {
                  setCurrentQuestion(currentQuestion + 1);
                  setSelectedAnswer(null);
                  setShowExplanation(false);
                } else {
                  setCompleted(true);
                  onComplete((score / questions.length) * 100);
                }
              }}
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

  useEffect(() => {
    loadPerformance();
  }, []);

  const loadPerformance = async () => {
    const data = await performanceStorage.getUserPerformance(userId);
    setPerformances(data);
  };

  const handleQuizComplete = async (score: number) => {
    if (activeQuiz) {
      const performance: UserPerformance = {
        articleId: activeQuiz,
        quizScore: score,
        timeSpent: 300, // Example time in seconds
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
            <Text style={styles.xpText}>
              {performances.reduce((sum, p) => sum + p.quizScore, 0)} XP
            </Text>
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
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
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
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#333",
    marginBottom: 16,
  },
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
  safeArea: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  quizContainer: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    padding: 20,
  },
  quizHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  questionCounter: {
    fontSize: 16,
    color: "#666",
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
  quizComplete: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 16,
  },
  quizCompleteTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  quizCompleteScore: {
    fontSize: 48,
    fontWeight: "bold",
    color: THEME_COLOR,
    marginBottom: 24,
  },
});
