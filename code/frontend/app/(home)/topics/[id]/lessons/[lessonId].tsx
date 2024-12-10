import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';

// Sample lesson data with same structure as your topic page
const lessonData = {
  'physics': [
    { 
      id: 1, 
      title: 'Introduction to Physics',
      content: "Welcome to Physics! In this lesson, we'll explore the fundamental concepts that form the foundation of physics.",
      duration: '15 min',
      videoUrl: 'https://example.com/video1',
      isCompleted: true
    },
    { 
      id: 2, 
      title: "Newton's Laws of Motion",
      content: "In this lesson, we'll study Newton's three laws of motion and how they describe the behavior of objects.",
      duration: '20 min',
      videoUrl: 'https://example.com/video2',
      isCompleted: true
    },
    { 
      id: 3, 
      title: 'Energy and Work',
      content: "Understanding energy and work is crucial to physics. Let's explore these fundamental concepts.",
      duration: '25 min',
      videoUrl: 'https://example.com/video3',
      isCompleted: false
    },
    { 
      id: 4, 
      title: 'Waves and Oscillations',
      content: "Learn about waves, their properties, and oscillatory motion in physical systems.",
      duration: '18 min',
      videoUrl: 'https://example.com/video4',
      isCompleted: false
    },
  ],
  'programming': [
    { 
      id: 1, 
      title: 'Getting Started with Python',
      content: "Let's begin our Python journey! We'll set up our development environment and write our first program.",
      duration: '20 min',
      videoUrl: 'https://example.com/video1',
      isCompleted: true
    },
    // ... other programming lessons
  ],
  // ... other topics
};

export default function LessonDetail() {
  const router = useRouter();
  const { id, lessonId } = useLocalSearchParams();
  
  // Get lessons for the topic and find the specific lesson
  const topicLessons = lessonData[id as keyof typeof lessonData] || [];
  const lesson = topicLessons.find(l => l.id === Number(lessonId));

  if (!lesson) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
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
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{lesson.title}</Text>
        <View style={{ width: 32 }} />
      </View>

      <View style={styles.content}>
        <View style={styles.infoCard}>
          <Text style={styles.duration}>Duration: {lesson.duration}</Text>
          <Text style={[styles.statusText, lesson.isCompleted ? styles.completed : styles.inProgress]}>
            {lesson.isCompleted ? 'Completed' : 'In Progress'}
          </Text>
        </View>
        
        <View style={styles.lessonContent}>
          <Text style={styles.contentText}>{lesson.content}</Text>
        </View>

        <TouchableOpacity 
          style={[styles.startButton, lesson.isCompleted && styles.completedButton]}
          onPress={() => {/* Handle start/review lesson */}}
        >
          <Text style={styles.startButtonText}>
            {lesson.isCompleted ? 'Review Lesson' : 'Start Lesson'}
          </Text>
        </TouchableOpacity>
      </View>
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
  infoCard: {
    backgroundColor: '#1A1A1A',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  duration: {
    fontSize: 16,
    color: '#FBBF24',
    fontWeight: '500',
  },
  statusText: {
    fontSize: 14,
    fontWeight: '500',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  completed: {
    backgroundColor: 'rgba(34, 197, 94, 0.1)',
    color: '#22C55E',
  },
  inProgress: {
    backgroundColor: 'rgba(251, 191, 36, 0.1)',
    color: '#FBBF24',
  },
  lessonContent: {
    backgroundColor: '#1A1A1A',
    borderRadius: 12,
    padding: 16,
    flex: 1,
  },
  contentText: {
    fontSize: 16,
    color: '#FFFFFF',
    lineHeight: 24,
  },
  startButton: {
    backgroundColor: '#FBBF24',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 20,
  },
  completedButton: {
    backgroundColor: '#22C55E',
  },
  startButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#FFFFFF',
    marginBottom: 20,
    textAlign: 'center',
  },
  returnButton: {
    backgroundColor: '#FBBF24',
    borderRadius: 12,
    padding: 16,
    minWidth: 200,
    alignItems: 'center',
  },
  returnButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
  },
});