import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, PlayCircle } from 'lucide-react-native';
import { useState } from 'react';

// Sample lessons data
const topicLessons = {
  'physics': [
    { id: 1, title: 'Introduction to Physics', duration: '15 min', isCompleted: true },
    { id: 2, title: 'Newton\'s Laws of Motion', duration: '20 min', isCompleted: true },
    { id: 3, title: 'Energy and Work', duration: '25 min', isCompleted: false },
    { id: 4, title: 'Waves and Oscillations', duration: '18 min', isCompleted: false },
  ],
  'programming': [
    { id: 1, title: 'Getting Started with Python', duration: '20 min', isCompleted: true },
    { id: 2, title: 'Variables and Data Types', duration: '25 min', isCompleted: false },
    { id: 3, title: 'Control Flow', duration: '30 min', isCompleted: false },
    { id: 4, title: 'Functions', duration: '22 min', isCompleted: false },
  ],
  'mathematics': [
    { id: 1, title: 'Introduction to Calculus', duration: '20 min', isCompleted: true },
    { id: 2, title: 'Derivatives', duration: '25 min', isCompleted: false },
    { id: 3, title: 'Integration', duration: '30 min', isCompleted: false },
    { id: 4, title: 'Applications', duration: '22 min', isCompleted: false },
  ],
  'data-science': [
    { id: 1, title: 'Introduction to Data Science', duration: '15 min', isCompleted: true },
    { id: 2, title: 'Data Analysis', duration: '25 min', isCompleted: false },
    { id: 3, title: 'Statistical Methods', duration: '30 min', isCompleted: false },
    { id: 4, title: 'Machine Learning Basics', duration: '28 min', isCompleted: false },
  ],
};

// Topic titles mapping
const topicTitles = {
  'physics': 'Physics',
  'programming': 'Programming',
  'mathematics': 'Mathematics',
  'data-science': 'Data Science',
};

export default function TopicDetail() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [selectedLesson, setSelectedLesson] = useState<number | null>(null);

  // Get lessons for the current topic
  const lessons = topicLessons[id as keyof typeof topicLessons] || [];
  const topicTitle = topicTitles[id as keyof typeof topicTitles] || 'Topic';

  const handleLessonPress = (lessonId: number) => {
    setSelectedLesson(lessonId);
    // Navigate to lesson detail page (to be implemented)
    router.push(`/topics/${id}/lessons/${lessonId}`);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{topicTitle}</Text>
        <View style={{ width: 32 }} /> {/* Spacer for alignment */}
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Progress Overview */}
        <View style={styles.progressSection}>
          <Text style={styles.progressTitle}>Your Progress</Text>
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill, 
                { width: `${(lessons.filter(l => l.isCompleted).length / lessons.length) * 100}%` }
              ]} 
            />
          </View>
          <Text style={styles.progressText}>
            {lessons.filter(l => l.isCompleted).length} of {lessons.length} completed
          </Text>
        </View>

        {/* Lessons List */}
        <View style={styles.lessonsList}>
          {lessons.map((lesson) => (
            <TouchableOpacity
              key={lesson.id}
              style={styles.lessonCard}
              onPress={() => handleLessonPress(lesson.id)}
            >
              <View style={styles.lessonContent}>
                <View style={styles.lessonInfo}>
                  <Text style={styles.lessonTitle}>{lesson.title}</Text>
                  <Text style={styles.lessonDuration}>{lesson.duration}</Text>
                </View>
                <View style={[
                  styles.lessonStatus,
                  lesson.isCompleted && styles.lessonCompleted
                ]}>
                  {lesson.isCompleted ? (
                    <Text style={styles.statusText}>Completed</Text>
                  ) : (
                    <PlayCircle size={20} color="#FBBF24" />
                  )}
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Bottom Padding */}
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
  progressSection: {
    marginBottom: 32,
  },
  progressTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  progressBar: {
    height: 4,
    backgroundColor: '#1A1A1A',
    borderRadius: 2,
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#FBBF24',
    borderRadius: 2,
  },
  progressText: {
    fontSize: 14,
    color: '#A3A3A3',
  },
  lessonsList: {
    gap: 12,
  },
  lessonCard: {
    backgroundColor: '#1A1A1A',
    borderRadius: 16,
    padding: 16,
  },
  lessonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  lessonInfo: {
    flex: 1,
    marginRight: 16,
  },
  lessonTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  lessonDuration: {
    fontSize: 14,
    color: '#A3A3A3',
  },
  lessonStatus: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: 'rgba(251, 191, 36, 0.1)',
  },
  lessonCompleted: {
    backgroundColor: 'rgba(34, 197, 94, 0.1)',
  },
  statusText: {
    fontSize: 14,
    color: '#22C55E',
    fontWeight: '500',
  },
  bottomPadding: {
    height: 40,
  },
});