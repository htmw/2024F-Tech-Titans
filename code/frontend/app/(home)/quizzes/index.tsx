import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { 
  ArrowLeft,
  GraduationCap,
  Atom,
  Code,
  Binary,
  Database
} from 'lucide-react-native';

type Quiz = {
  id: string;
  title: string;
  questions: number;
  duration: string;
  subject: string;
  icon: JSX.Element;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
};

type TopicQuizzes = {
  [key: string]: {
    icon: JSX.Element;
    title: string;
    quizzes: Quiz[];
  };
};

const allQuizzes: TopicQuizzes = {
  mathematics: {
    icon: <Binary size={20} color="#FBBF24" />,
    title: "Mathematics",
    quizzes: [
      {
        id: 'math-1',
        title: 'Advanced Mathematics',
        questions: 15,
        duration: '30 min',
        subject: 'Mathematics',
        icon: <GraduationCap size={20} color="#FBBF24" />,
        difficulty: 'Advanced'
      },
      {
        id: 'math-2',
        title: 'Calculus Fundamentals',
        questions: 12,
        duration: '25 min',
        subject: 'Mathematics',
        icon: <GraduationCap size={20} color="#FBBF24" />,
        difficulty: 'Intermediate'
      },
      {
        id: 'math-3',
        title: 'Linear Algebra Basics',
        questions: 10,
        duration: '20 min',
        subject: 'Mathematics',
        icon: <GraduationCap size={20} color="#FBBF24" />,
        difficulty: 'Beginner'
      }
    ]
  },
  physics: {
    icon: <Atom size={20} color="#FBBF24" />,
    title: "Physics",
    quizzes: [
      {
        id: 'physics-1',
        title: 'Quantum Mechanics',
        questions: 12,
        duration: '25 min',
        subject: 'Physics',
        icon: <Atom size={20} color="#FBBF24" />,
        difficulty: 'Advanced'
      },
      {
        id: 'physics-2',
        title: 'Classical Mechanics',
        questions: 15,
        duration: '30 min',
        subject: 'Physics',
        icon: <Atom size={20} color="#FBBF24" />,
        difficulty: 'Intermediate'
      },
      {
        id: 'physics-3',
        title: 'Basic Electromagnetism',
        questions: 10,
        duration: '20 min',
        subject: 'Physics',
        icon: <Atom size={20} color="#FBBF24" />,
        difficulty: 'Beginner'
      }
    ]
  },
  programming: {
    icon: <Code size={20} color="#FBBF24" />,
    title: "Programming",
    quizzes: [
      {
        id: 'prog-1',
        title: 'Python Advanced Concepts',
        questions: 15,
        duration: '30 min',
        subject: 'Programming',
        icon: <Code size={20} color="#FBBF24" />,
        difficulty: 'Advanced'
      },
      {
        id: 'prog-2',
        title: 'JavaScript Basics',
        questions: 12,
        duration: '25 min',
        subject: 'Programming',
        icon: <Code size={20} color="#FBBF24" />,
        difficulty: 'Beginner'
      }
    ]
  },
  'data-science': {
    icon: <Database size={20} color="#FBBF24" />,
    title: "Data Science",
    quizzes: [
      {
        id: 'data-1',
        title: 'Machine Learning Basics',
        questions: 15,
        duration: '30 min',
        subject: 'Data Science',
        icon: <Database size={20} color="#FBBF24" />,
        difficulty: 'Intermediate'
      },
      {
        id: 'data-2',
        title: 'Statistical Analysis',
        questions: 12,
        duration: '25 min',
        subject: 'Data Science',
        icon: <Database size={20} color="#FBBF24" />,
        difficulty: 'Beginner'
      }
    ]
  }
};

export default function Quizzes() {
  const router = useRouter();

  const handleQuizPress = (quizId: string) => {
    router.push(`/quiz/${quizId}/questions`);
  };

  const handleBackPress = () => {
    try {
      router.back();
    } catch {
      // Fallback to home screen if back navigation fails
      router.replace('/');
    }
  };

  const getDifficultyColor = (difficulty: Quiz['difficulty']) => {
    switch (difficulty) {
      case 'Beginner':
        return '#22C55E';
      case 'Intermediate':
        return '#FBBF24';
      case 'Advanced':
        return '#EF4444';
      default:
        return '#A3A3A3';
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
          <ArrowLeft size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>All Quizzes</Text>
        <View style={{ width: 32 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {Object.entries(allQuizzes).map(([key, topicData]) => (
          <View key={key} style={styles.section}>
            <View style={styles.topicHeader}>
              <View style={styles.topicIcon}>
                {topicData.icon}
              </View>
              <Text style={styles.topicTitle}>{topicData.title}</Text>
            </View>

            <View style={styles.quizList}>
              {topicData.quizzes.map((quiz) => (
                <TouchableOpacity 
                  key={quiz.id} 
                  style={styles.quizCard}
                  onPress={() => handleQuizPress(quiz.id)}
                >
                  <View style={styles.quizIcon}>
                    {quiz.icon}
                  </View>
                  <View style={styles.quizInfo}>
                    <Text style={styles.quizTitle}>{quiz.title}</Text>
                    <Text style={styles.quizSubtitle}>
                      {quiz.questions} questions • {quiz.duration}
                    </Text>
                  </View>
                  <View style={[
                    styles.difficultyBadge,
                    { backgroundColor: `${getDifficultyColor(quiz.difficulty)}20` }
                  ]}>
                    <Text style={[
                      styles.difficultyText,
                      { color: getDifficultyColor(quiz.difficulty) }
                    ]}>
                      {quiz.difficulty}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}
        <View style={styles.bottomPadding} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0A0A',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: '#1A1A1A',
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    flex: 1,
    textAlign: 'center',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  section: {
    marginBottom: 32,
  },
  topicHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  topicIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: 'rgba(251, 191, 36, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  topicTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  quizList: {
    gap: 12,
  },
  quizCard: {
    backgroundColor: '#1A1A1A',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  quizIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(251, 191, 36, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  quizInfo: {
    flex: 1,
  },
  quizTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  quizSubtitle: {
    fontSize: 14,
    color: '#A3A3A3',
  },
  difficultyBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    marginLeft: 12,
  },
  difficultyText: {
    fontSize: 12,
    fontWeight: '600',
  },
  bottomPadding: {
    height: 40,
  },
});