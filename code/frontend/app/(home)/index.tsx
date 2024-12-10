import { useUser, useAuth } from "@clerk/clerk-expo";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import {
  UserCircle,
  Book,
  Trophy,
  Flame,
  GraduationCap,
  ArrowRight,
  Lightbulb,
  Atom,
  Code,
  Binary,
  Database,
  Zap,
} from "lucide-react-native";

// Storage keys for persisting data
const STORAGE_KEYS = {
  COMPLETED_QUIZZES: "@completed_quizzes",
  READ_ARTICLES: "@read_articles",
  LAST_ACTIVITY: "@last_activity",
  STREAK_DATA: "@streak_data",
  XP_POINTS: "@xp_points",
};

// XP rewards for different activities
const XP_REWARDS = {
  QUIZ_COMPLETION: 100,
  ARTICLE_READ: 50,
  LESSON_COMPLETION: 75,
};

// Types for our data
type Quiz = {
  id: string;
  title: string;
  questions: number;
  duration: string;
  subject: string;
  icon: JSX.Element;
};

type Topic = {
  id: string;
  icon: JSX.Element;
  name: string;
  lessons: string;
};

type Article = {
  id: string;
  title: string;
  description: string;
  duration: string;
  category: string;
};

type UserProgress = {
  xp: number;
  streak: number;
  completedQuizzes: string[];
  readArticles: string[];
  lastActivityDate: string | null;
};

const quizzes: Quiz[] = [
  {
    id: "math-1",
    title: "Advanced Mathematics",
    questions: 15,
    duration: "30 min",
    subject: "Mathematics",
    icon: <GraduationCap size={20} color="#FBBF24" />,
  },
  {
    id: "physics-1",
    title: "Quantum Mechanics",
    questions: 12,
    duration: "25 min",
    subject: "Physics",
    icon: <Atom size={20} color="#FBBF24" />,
  },
];

const topics: Topic[] = [
  {
    id: "physics",
    icon: <Atom size={20} color="#FBBF24" />,
    name: "Physics",
    lessons: "24 lessons",
  },
  {
    id: "programming",
    icon: <Code size={20} color="#FBBF24" />,
    name: "Programming",
    lessons: "32 lessons",
  },
  {
    id: "mathematics",
    icon: <Binary size={20} color="#FBBF24" />,
    name: "Mathematics",
    lessons: "28 lessons",
  },
  {
    id: "data-science",
    icon: <Database size={20} color="#FBBF24" />,
    name: "Data Science",
    lessons: "20 lessons",
  },
];

const featuredArticles: Article[] = [
  {
    id: "physics-quantum",
    title: "Understanding Quantum Entanglement",
    description:
      "A deep dive into one of the most fascinating phenomena in quantum mechanics.",
    duration: "10 min",
    category: "Physics",
  },
  {
    id: "math-calculus",
    title: "The Beauty of Calculus",
    description:
      "Exploring the fundamental concepts that revolutionized mathematics.",
    duration: "12 min",
    category: "Mathematics",
  },
];

export default function Home() {
  const { user } = useUser();
  const { signOut } = useAuth();
  const router = useRouter();

  // State for tracking user progress
  const [progress, setProgress] = useState<UserProgress>({
    xp: 0,
    streak: 0,
    completedQuizzes: [],
    readArticles: [],
    lastActivityDate: null,
  });

  useEffect(() => {
    loadUserProgress();
    updateDailyStreak();
  }, []);

  const loadUserProgress = async () => {
    try {
      const [xpStr, completedQuizzesStr, readArticlesStr, lastActivityStr] =
        await Promise.all([
          AsyncStorage.getItem(STORAGE_KEYS.XP_POINTS),
          AsyncStorage.getItem(STORAGE_KEYS.COMPLETED_QUIZZES),
          AsyncStorage.getItem(STORAGE_KEYS.READ_ARTICLES),
          AsyncStorage.getItem(STORAGE_KEYS.LAST_ACTIVITY),
        ]);

      setProgress((prev) => ({
        ...prev,
        xp: xpStr ? parseInt(xpStr) : 0,
        completedQuizzes: completedQuizzesStr
          ? JSON.parse(completedQuizzesStr)
          : [],
        readArticles: readArticlesStr ? JSON.parse(readArticlesStr) : [],
        lastActivityDate: lastActivityStr || null,
      }));
    } catch (error) {
      console.error("Error loading progress:", error);
    }
  };

  const updateDailyStreak = async () => {
    try {
      const today = new Date().toISOString().split("T")[0];
      const streakData = await AsyncStorage.getItem(STORAGE_KEYS.STREAK_DATA);

      if (!streakData) {
        // First time user
        const newStreakData = { streak: 1, lastDate: today };
        await AsyncStorage.setItem(
          STORAGE_KEYS.STREAK_DATA,
          JSON.stringify(newStreakData),
        );
        setProgress((prev) => ({ ...prev, streak: 1 }));
        return;
      }

      const { streak, lastDate } = JSON.parse(streakData);
      const lastLogin = new Date(lastDate);
      const currentDate = new Date(today);
      const diffDays = Math.floor(
        (currentDate.getTime() - lastLogin.getTime()) / (1000 * 60 * 60 * 24),
      );

      let newStreak = streak;
      if (diffDays === 1) {
        // Consecutive day
        newStreak += 1;
      } else if (diffDays > 1) {
        // Streak broken
        newStreak = 1;
      }

      await AsyncStorage.setItem(
        STORAGE_KEYS.STREAK_DATA,
        JSON.stringify({ streak: newStreak, lastDate: today }),
      );
      setProgress((prev) => ({ ...prev, streak: newStreak }));
    } catch (error) {
      console.error("Error updating streak:", error);
    }
  };

  const getXPToNextLevel = () => {
    const nextLevel = Math.floor(progress.xp / 1000) + 1;
    return nextLevel * 1000 - progress.xp;
  };

  const getXPProgress = () => {
    const currentLevel = Math.floor(progress.xp / 1000);
    const levelProgress = progress.xp - currentLevel * 1000;
    return (levelProgress / 1000) * 100;
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      router.replace("/sign-in");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const handleQuizPress = (quizId: string) => {
    router.push(`/quiz/${quizId}/questions`);
  };

  const handleTopicPress = (topicId: string) => {
    router.push(`/topics/${topicId}`);
  };

  // Helper functions to update progress
  const updateXP = async (amount: number) => {
    try {
      const newXP = progress.xp + amount;
      await AsyncStorage.setItem(STORAGE_KEYS.XP_POINTS, newXP.toString());
      setProgress((prev) => ({ ...prev, xp: newXP }));
    } catch (error) {
      console.error("Error updating XP:", error);
    }
  };

  const addCompletedQuiz = async (quizId: string) => {
    try {
      const updatedQuizzes = [...progress.completedQuizzes, quizId];
      await AsyncStorage.setItem(
        STORAGE_KEYS.COMPLETED_QUIZZES,
        JSON.stringify(updatedQuizzes),
      );
      setProgress((prev) => ({ ...prev, completedQuizzes: updatedQuizzes }));
      await updateXP(XP_REWARDS.QUIZ_COMPLETION);
    } catch (error) {
      console.error("Error updating completed quizzes:", error);
    }
  };

  const addReadArticle = async (articleId: string) => {
    try {
      const updatedArticles = [...progress.readArticles, articleId];
      await AsyncStorage.setItem(
        STORAGE_KEYS.READ_ARTICLES,
        JSON.stringify(updatedArticles),
      );
      setProgress((prev) => ({ ...prev, readArticles: updatedArticles }));
      await updateXP(XP_REWARDS.ARTICLE_READ);
    } catch (error) {
      console.error("Error updating read articles:", error);
    }
  };

  const updateLastActivity = async () => {
    try {
      const today = new Date().toISOString().split("T")[0];
      await AsyncStorage.setItem(STORAGE_KEYS.LAST_ACTIVITY, today);
      setProgress((prev) => ({ ...prev, lastActivityDate: today }));
    } catch (error) {
      console.error("Error updating last activity:", error);
    }
  };
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Welcome back,</Text>
          <Text style={styles.userName}>
            {user?.firstName ||
              user?.emailAddresses[0].emailAddress.split("@")[0]}
          </Text>
        </View>
        <TouchableOpacity onPress={handleSignOut}>
          <UserCircle size={32} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.progressCard}>
          <View style={styles.progressTopRow}>
            <View style={styles.xpContainer}>
              <View style={styles.xpIconContainer}>
                <Zap size={24} color="#FBBF24" />
              </View>
              <View>
                <Text style={styles.xpAmount}>{progress.xp} XP</Text>
                <View style={styles.xpProgressContainer}>
                  <View style={styles.xpProgressBar}>
                    <View
                      style={[
                        styles.xpProgressFill,
                        { width: `${getXPProgress()}%` },
                      ]}
                    />
                  </View>
                  <Text style={styles.xpToNext}>
                    {getXPToNextLevel()} XP to next level
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.verticalDivider} />

            <View style={styles.streakContainer}>
              <View style={styles.streakIconContainer}>
                <Flame size={24} color="#FBBF24" />
              </View>
              <View>
                <Text style={styles.streakDays}>{progress.streak} Days</Text>
                <Text style={styles.streakText}>Current Streak</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Trophy size={20} color="#FBBF24" />
            <Text style={styles.statNumber}>
              {progress.completedQuizzes.length}
            </Text>
            <Text style={styles.statLabel}>Quizzes Completed</Text>
          </View>
          <View style={styles.statCard}>
            <Book size={20} color="#FBBF24" />
            <Text style={styles.statNumber}>
              {progress.readArticles.length}
            </Text>
            <Text style={styles.statLabel}>Articles Read</Text>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Quizzes</Text>
            <TouchableOpacity
              style={styles.seeAllButton}
              onPress={() => router.push("/quizzes")}
            >
              <Text style={styles.seeAllText}>See all</Text>
              <ArrowRight size={16} color="#A3A3A3" />
            </TouchableOpacity>
          </View>
          <View style={styles.quizList}>
            {quizzes.map((quiz) => (
              <TouchableOpacity
                key={quiz.id}
                style={styles.quizCard}
                onPress={() => handleQuizPress(quiz.id)}
              >
                <View style={styles.quizIcon}>{quiz.icon}</View>
                <View style={styles.quizInfo}>
                  <Text style={styles.quizTitle}>{quiz.title}</Text>
                  <Text style={styles.quizSubtitle}>
                    {quiz.questions} questions • {quiz.duration}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Featured Articles</Text>
            <TouchableOpacity
              style={styles.seeAllButton}
              onPress={() => router.push("/articles")}
            >
              <Text style={styles.seeAllText}>See all</Text>
              <ArrowRight size={16} color="#A3A3A3" />
            </TouchableOpacity>
          </View>
          <View style={styles.articleList}>
            {featuredArticles.map((article) => (
              <TouchableOpacity
                key={article.id}
                style={styles.articleCard}
                onPress={() => router.push(`/articles/${article.id}`)}
              >
                <Text style={styles.articleTitle}>{article.title}</Text>
                <Text style={styles.articleDescription}>
                  {article.description}
                </Text>
                <View style={styles.articleMeta}>
                  <Text style={styles.articleCategory}>{article.category}</Text>
                  <Text style={styles.articleDuration}>
                    {article.duration} read
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Topics to Explore</Text>
            <TouchableOpacity
              style={styles.seeAllButton}
              onPress={() => router.push("/topics")}
            >
              <Text style={styles.seeAllText}>See all</Text>
              <ArrowRight size={16} color="#A3A3A3" />
            </TouchableOpacity>
          </View>
          <View style={styles.topicsGrid}>
            {topics.map((topic) => (
              <TouchableOpacity
                key={topic.id}
                style={styles.topicCard}
                onPress={() => handleTopicPress(topic.id)}
              >
                <View style={styles.topicIcon}>{topic.icon}</View>
                <Text style={styles.topicTitle}>{topic.name}</Text>
                <Text style={styles.topicMeta}>{topic.lessons}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.bottomPadding} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0A0A0A",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  greeting: {
    fontSize: 16,
    color: "#A3A3A3",
  },
  userName: {
    fontSize: 20,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  content: {
    flex: 1,
    padding: 20,
  },
  progressCard: {
    backgroundColor: "#1A1A1A",
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  progressTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  xpContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  xpIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: "rgba(251, 191, 36, 0.1)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  xpAmount: {
    fontSize: 18,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 4,
  },
  xpProgressContainer: {
    width: "100%",
  },
  xpProgressBar: {
    height: 4,
    backgroundColor: "rgba(251, 191, 36, 0.1)",
    borderRadius: 2,
    marginBottom: 4,
    width: 100,
  },
  xpProgressFill: {
    height: "100%",
    backgroundColor: "#FBBF24",
    borderRadius: 2,
  },
  xpToNext: {
    fontSize: 12,
    color: "#A3A3A3",
  },
  verticalDivider: {
    width: 1,
    height: 40,
    backgroundColor: "#2A2A2A",
    marginHorizontal: 16,
  },
  streakContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  streakIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: "rgba(251, 191, 36, 0.1)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  streakDays: {
    fontSize: 18,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  streakText: {
    fontSize: 14,
    color: "#A3A3A3",
  },
  statsGrid: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    backgroundColor: "#1A1A1A",
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
  },
  statNumber: {
    fontSize: 24,
    fontWeight: "700",
    color: "#FFFFFF",
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: "#A3A3A3",
    marginTop: 4,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  seeAllButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  seeAllText: {
    fontSize: 14,
    color: "#A3A3A3",
    marginRight: 4,
  },
  quizList: {
    gap: 12,
  },
  quizCard: {
    backgroundColor: "#1A1A1A",
    borderRadius: 16,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
  },
  quizIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "rgba(251, 191, 36, 0.1)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  quizInfo: {
    flex: 1,
  },
  quizTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
    marginBottom: 4,
  },
  quizSubtitle: {
    fontSize: 14,
    color: "#A3A3A3",
  },
  articleList: {
    gap: 12,
  },
  articleCard: {
    backgroundColor: "#1A1A1A",
    borderRadius: 16,
    padding: 20,
  },
  articleTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
    marginBottom: 8,
  },
  articleDescription: {
    fontSize: 14,
    color: "#A3A3A3",
    marginBottom: 12,
    lineHeight: 20,
  },
  articleMeta: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  articleCategory: {
    fontSize: 14,
    color: "#FBBF24",
    fontWeight: "500",
  },
  articleDuration: {
    fontSize: 14,
    color: "#A3A3A3",
  },
  topicsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  topicCard: {
    width: "48%",
    backgroundColor: "#1A1A1A",
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
  },
  topicIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: "rgba(251, 191, 36, 0.1)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  topicTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
    marginBottom: 4,
    textAlign: "center",
  },
  topicMeta: {
    fontSize: 14,
    color: "#A3A3A3",
    textAlign: "center",
  },
  bottomPadding: {
    height: 40,
  },
});
