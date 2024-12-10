import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { ArrowLeft, CheckCircle } from "lucide-react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useState, useEffect } from "react";

// Storage keys
const COMPLETED_LESSONS_KEY = "@completed_lessons";
const XP_POINTS_KEY = "@xp_points";
const LESSON_XP_REWARD = 75;

type Lesson = {
  id: number;
  title: string;
  content: string;
  duration: string;
  isCompleted: boolean;
  sections: {
    title: string;
    content: string;
  }[];
};

const lessonData: Record<string, Lesson[]> = {
  physics: [
    {
      id: 1,
      title: "Introduction to Physics",
      content:
        "Physics is the natural science that studies matter, its fundamental constituents, its motion and behavior through space and time, and the related entities of energy and force.",
      duration: "15 min",
      isCompleted: false,
      sections: [
        {
          title: "What is Physics?",
          content:
            "Physics is one of the most fundamental scientific disciplines, and its main goal is to understand how the universe behaves. It studies matter, motion, energy, and force - basically everything around us, from the smallest subatomic particles to the vast expanses of space and time.",
        },
        {
          title: "Why Study Physics?",
          content:
            "Physics helps us understand the world around us. It explains everything from why apples fall from trees to how smartphones work. Physics principles are behind many modern technologies and continue to drive innovation in fields like medicine, engineering, and computing.",
        },
        {
          title: "Main Branches of Physics",
          content:
            "• Classical Mechanics: Studies motion and forces\n• Thermodynamics: Deals with heat and energy\n• Electromagnetism: Covers electricity and magnetism\n• Quantum Mechanics: Explores atomic and subatomic particles\n• Relativity: Examines space, time, and gravity",
        },
      ],
    },
    {
      id: 2,
      title: "Newton's Laws of Motion",
      content:
        "Newton's three laws of motion form the foundation of classical mechanics and explain how most objects in our daily lives move and interact.",
      duration: "20 min",
      isCompleted: false,
      sections: [
        {
          title: "First Law: Inertia",
          content:
            "An object at rest stays at rest, and an object in motion stays in motion, unless acted upon by an external force. This principle is known as inertia - objects resist changes to their state of motion.",
        },
        {
          title: "Second Law: Force and Acceleration",
          content:
            "Force equals mass times acceleration (F = ma). This fundamental equation tells us that the greater the mass of an object, the more force needed to accelerate it.",
        },
        {
          title: "Third Law: Action and Reaction",
          content:
            "For every action, there is an equal and opposite reaction. When you push against a wall, the wall pushes back against you with the same force.",
        },
      ],
    },
  ],
  programming: [
    {
      id: 1,
      title: "Getting Started with Python",
      content:
        "Python is a high-level, interpreted programming language known for its simplicity and readability.",
      duration: "20 min",
      isCompleted: false,
      sections: [
        {
          title: "What is Python?",
          content:
            "Python is a versatile programming language that emphasizes code readability. It's widely used in web development, data science, artificial intelligence, and automation.",
        },
        {
          title: "Basic Syntax",
          content:
            "Python uses indentation for code blocks, making it visually clean and easy to read. Variables don't need type declarations, and semicolons are optional.",
        },
        {
          title: "Your First Program",
          content:
            'print("Hello, World!")\n\nThis simple line demonstrates Python\'s straightforward syntax. The print function outputs text to the console.',
        },
      ],
    },
  ],
};

export default function LessonDetail() {
  const router = useRouter();
  const { id, lessonId } = useLocalSearchParams();
  const [isCompleted, setIsCompleted] = useState(false);

  const topicLessons = lessonData[id as keyof typeof lessonData] || [];
  const lesson = topicLessons.find((l) => l.id === Number(lessonId));

  useEffect(() => {
    loadCompletionStatus();
  }, []);

  const loadCompletionStatus = async () => {
    try {
      const completedLessons = await AsyncStorage.getItem(
        COMPLETED_LESSONS_KEY,
      );
      const completed = completedLessons ? JSON.parse(completedLessons) : [];
      setIsCompleted(completed.includes(`${id}_${lessonId}`));
    } catch (error) {
      console.error("Error loading completion status:", error);
    }
  };

  const handleCompletion = async () => {
    try {
      // Toggle completion status
      const newStatus = !isCompleted;
      setIsCompleted(newStatus);

      // Update completed lessons in storage
      const completedLessons = await AsyncStorage.getItem(
        COMPLETED_LESSONS_KEY,
      );
      const completed = completedLessons ? JSON.parse(completedLessons) : [];
      const lessonKey = `${id}_${lessonId}`;

      let updatedLessons;
      if (newStatus) {
        updatedLessons = [...completed, lessonKey];
        // Award XP for completion
        const currentXP = await AsyncStorage.getItem(XP_POINTS_KEY);
        const newXP = (
          parseInt(currentXP || "0") + LESSON_XP_REWARD
        ).toString();
        await AsyncStorage.setItem(XP_POINTS_KEY, newXP);
      } else {
        updatedLessons = completed.filter((key: string) => key !== lessonKey);
        // Remove XP if uncompleting
        const currentXP = await AsyncStorage.getItem(XP_POINTS_KEY);
        const newXP = Math.max(
          0,
          parseInt(currentXP || "0") - LESSON_XP_REWARD,
        ).toString();
        await AsyncStorage.setItem(XP_POINTS_KEY, newXP);
      }

      await AsyncStorage.setItem(
        COMPLETED_LESSONS_KEY,
        JSON.stringify(updatedLessons),
      );
    } catch (error) {
      console.error("Error updating completion status:", error);
    }
  };

  if (!lesson) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <ArrowLeft size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Lesson Not Found</Text>
          <View style={{ width: 32 }} />
        </View>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>This lesson could not be found.</Text>
          <TouchableOpacity
            style={styles.returnButton}
            onPress={() => router.back()}
          >
            <Text style={styles.returnButtonText}>Return to Topics</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <ArrowLeft size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{lesson.title}</Text>
        <TouchableOpacity
          onPress={handleCompletion}
          style={styles.completeButton}
        >
          <CheckCircle
            size={24}
            color={isCompleted ? "#22C55E" : "#A3A3A3"}
            fill={isCompleted ? "#22C55E" : "transparent"}
          />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.infoCard}>
          <Text style={styles.duration}>Duration: {lesson.duration}</Text>
          <Text
            style={[
              styles.statusText,
              isCompleted ? styles.completed : styles.inProgress,
            ]}
          >
            {isCompleted ? "Completed" : "In Progress"}
          </Text>
        </View>

        <View style={styles.lessonContent}>
          <Text style={styles.introText}>{lesson.content}</Text>

          {lesson.sections.map((section, index) => (
            <View key={index} style={styles.section}>
              <Text style={styles.sectionTitle}>{section.title}</Text>
              <Text style={styles.sectionContent}>{section.content}</Text>
            </View>
          ))}
        </View>

        <TouchableOpacity
          style={[styles.startButton, isCompleted && styles.completedButton]}
          onPress={handleCompletion}
        >
          <Text style={styles.startButtonText}>
            {isCompleted ? "Mark as Incomplete" : "Mark as Complete"}
          </Text>
        </TouchableOpacity>

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
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: "#1A1A1A",
  },
  backButton: {
    padding: 4,
  },
  completeButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FFFFFF",
    flex: 1,
    textAlign: "center",
  },
  content: {
    flex: 1,
    padding: 20,
  },
  infoCard: {
    backgroundColor: "#1A1A1A",
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  duration: {
    fontSize: 16,
    color: "#FBBF24",
    fontWeight: "500",
  },
  statusText: {
    fontSize: 14,
    fontWeight: "500",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  completed: {
    backgroundColor: "rgba(34, 197, 94, 0.1)",
    color: "#22C55E",
  },
  inProgress: {
    backgroundColor: "rgba(251, 191, 36, 0.1)",
    color: "#FBBF24",
  },
  lessonContent: {
    backgroundColor: "#1A1A1A",
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  introText: {
    fontSize: 16,
    color: "#FFFFFF",
    lineHeight: 24,
    marginBottom: 24,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FFFFFF",
    marginBottom: 12,
  },
  sectionContent: {
    fontSize: 16,
    color: "#FFFFFF",
    lineHeight: 24,
  },
  startButton: {
    backgroundColor: "#FBBF24",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    marginTop: 20,
  },
  completedButton: {
    backgroundColor: "#22C55E",
  },
  startButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000000",
  },
  errorContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: "#FFFFFF",
    marginBottom: 20,
    textAlign: "center",
  },
  returnButton: {
    backgroundColor: "#FBBF24",
    borderRadius: 12,
    padding: 16,
    minWidth: 200,
    alignItems: "center",
  },
  returnButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000000",
  },
  bottomPadding: {
    height: 20,
  },
});
