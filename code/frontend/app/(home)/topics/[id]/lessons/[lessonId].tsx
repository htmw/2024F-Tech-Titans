import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, CheckCircle } from 'lucide-react-native';
import { useState } from 'react';

// Sample lesson content data
const lessonContents = {
  'physics': {
    1: {
      title: 'Introduction to Physics',
      sections: [
        {
          type: 'text',
          content: 'Physics is the natural science that studies matter, its fundamental constituents, its motion and behavior through space and time, and the related entities of energy and force.'
        },
        {
          type: 'heading',
          content: 'What is Physics?'
        },
        {
          type: 'text',
          content: 'Physics is one of the most fundamental scientific disciplines, and its main goal is to understand how the universe behaves. It studies matter, forces, energy and their interactions.'
        },
        {
          type: 'heading',
          content: 'Key Concepts'
        },
        {
          type: 'list',
          items: [
            'Matter and Energy',
            'Forces and Motion',
            'Space and Time',
            'Quantum Mechanics'
          ]
        },
        {
          type: 'text',
          content: 'Physics plays an essential role in many related fields, including chemistry, biology, engineering, and medicine.'
        }
      ]
    },
    // Add more lessons...
  },
  'programming': {
    1: {
      title: 'Getting Started with Python',
      sections: [
        {
          type: 'text',
          content: 'Python is a high-level, interpreted programming language that emphasizes code readability with the use of significant indentation.'
        },
        {
          type: 'heading',
          content: 'Why Python?'
        },
        {
          type: 'list',
          items: [
            'Easy to learn and read',
            'Large standard library',
            'Dynamic typing',
            'Interpreted language'
          ]
        },
        {
          type: 'code',
          content: 'print("Hello, World!")\n\n# This is a comment\nname = "Python"\nprint(f"Welcome to {name} programming!")'
        }
      ]
    }
  },
  // Add more topics...
};

export default function LessonDetail() {
  const router = useRouter();
  const { id, lessonId } = useLocalSearchParams();
  const [isCompleted, setIsCompleted] = useState(false);

  // Get lesson content
  const lesson = lessonContents[id as keyof typeof lessonContents]?.[Number(lessonId)];

  const handleComplete = () => {
    setIsCompleted(true);
    // Here you would typically update the completion status in your backend
    setTimeout(() => {
      router.back();
    }, 1000);
  };

  if (!lesson) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Lesson not found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{lesson.title}</Text>
        <TouchableOpacity 
          style={[styles.completeButton, isCompleted && styles.completedButton]}
          onPress={handleComplete}
          disabled={isCompleted}
        >
          <CheckCircle size={20} color={isCompleted ? "#22C55E" : "#FFFFFF"} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {lesson.sections.map((section, index) => {
          switch (section.type) {
            case 'heading':
              return (
                <Text key={index} style={styles.sectionHeading}>
                  {section.content}
                </Text>
              );
            case 'text':
              return (
                <Text key={index} style={styles.paragraph}>
                  {section.content}
                </Text>
              );
            case 'list':
              return (
                <View key={index} style={styles.list}>
                  {section.items.map((item, itemIndex) => (
                    <View key={itemIndex} style={styles.listItem}>
                      <Text style={styles.listBullet}>•</Text>
                      <Text style={styles.listText}>{item}</Text>
                    </View>
                  ))}
                </View>
              );
            case 'code':
              return (
                <View key={index} style={styles.codeBlock}>
                  <Text style={styles.codeText}>{section.content}</Text>
                </View>
              );
            default:
              return null;
          }
        })}

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
  completeButton: {
    padding: 4,
  },
  completedButton: {
    opacity: 0.7,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  errorText: {
    color: '#FFFFFF',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
  sectionHeading: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 16,
    marginTop: 24,
  },
  paragraph: {
    fontSize: 16,
    color: '#E5E5E5',
    lineHeight: 24,
    marginBottom: 16,
  },
  list: {
    marginBottom: 16,
    paddingLeft: 8,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  listBullet: {
    color: '#FBBF24',
    fontSize: 16,
    marginRight: 8,
    marginTop: 4,
  },
  listText: {
    flex: 1,
    fontSize: 16,
    color: '#E5E5E5',
    lineHeight: 24,
  },
  codeBlock: {
    backgroundColor: '#1A1A1A',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  codeText: {
    fontFamily: 'monospace',
    fontSize: 14,
    color: '#E5E5E5',
    lineHeight: 20,
  },
  bottomPadding: {
    height: 40,
  },
});