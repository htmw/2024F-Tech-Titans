import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, Clock } from 'lucide-react-native';
import { useState, useEffect } from 'react';

type Question = {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
};

// Quiz data mapping
const quizData: Record<string, {
  title: string;
  questions: Question[];
  duration: number; // in seconds
}> = {
  'math-1': {
    title: 'Advanced Mathematics',
    duration: 1800, // 30 minutes
    questions: [
      {
        id: 1,
        question: "What is the derivative of e^x?",
        options: ["e^x", "x·e^x", "e^(x-1)", "1/e^x"],
        correctAnswer: 0
      },
      {
        id: 2,
        question: "What is the integral of 1/x?",
        options: ["x", "ln|x| + C", "1/x² + C", "x·ln(x)"],
        correctAnswer: 1
      },
      // Add more questions as needed
    ]
  },
  'physics-1': {
    title: 'Quantum Mechanics',
    duration: 1500, // 25 minutes
    questions: [
      {
        id: 1,
        question: "What is the Schrödinger equation used for?",
        options: [
          "Describing quantum state evolution",
          "Calculating classical momentum",
          "Measuring temperature",
          "Computing electrical resistance"
        ],
        correctAnswer: 0
      },
      // Add more questions as needed
    ]
  }
};

export default function QuizQuestions() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState(1800); // Default to 30 minutes

  const quizId = id as string;
  const quiz = quizData[quizId];

  // Initialize timer with quiz duration
  useEffect(() => {
    if (quiz) {
      setTimeLeft(quiz.duration);
    }
  }, [quiz]);

  // Timer effect
  useEffect(() => {
    if (!quiz) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleQuizComplete();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [quiz]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleAnswerSelect = (index: number) => {
    setSelectedAnswer(index);
    // Add slight delay before moving to next question
    setTimeout(() => {
      if (currentQuestion < (quiz?.questions.length ?? 0) - 1) {
        setCurrentQuestion(prev => prev + 1);
        setSelectedAnswer(null);
      } else {
        handleQuizComplete();
      }
    }, 500);
  };

  const handleQuizComplete = () => {
    // Handle quiz completion logic
    router.back();
  };

  // Handle case where quiz doesn't exist
  if (!quiz) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <ArrowLeft size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Quiz Not Found</Text>
          <View style={{ width: 32 }} />
        </View>
        <View style={styles.content}>
          <Text style={styles.noContentText}>This quiz could not be found.</Text>
        </View>
      </View>
    );
  }

  const currentQuestionData = quiz.questions[currentQuestion];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{quiz.title}</Text>
        <View style={styles.timerContainer}>
          <Clock size={16} color="#FBBF24" />
          <Text style={styles.timerText}>{formatTime(timeLeft)}</Text>
        </View>
      </View>

      <View style={styles.content}>
        <View style={styles.progressBar}>
          <View 
            style={[
              styles.progressFill, 
              { width: `${((currentQuestion + 1) / quiz.questions.length) * 100}%` }
            ]} 
          />
        </View>

        <View style={styles.questionContainer}>
          <Text style={styles.questionNumber}>
            Question {currentQuestion + 1} of {quiz.questions.length}
          </Text>
          <Text style={styles.questionText}>
            {currentQuestionData.question}
          </Text>
        </View>

        <View style={styles.optionsContainer}>
          {currentQuestionData.options.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.optionButton,
                selectedAnswer === index && styles.optionSelected
              ]}
              onPress={() => handleAnswerSelect(index)}
              disabled={selectedAnswer !== null}
            >
              <Text style={[
                styles.optionText,
                selectedAnswer === index && styles.optionTextSelected
              ]}>
                {option}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
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
  timerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  timerText: {
    color: '#FBBF24',
    fontSize: 16,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  noContentText: {
    color: '#FFFFFF',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 40,
  },
  progressBar: {
    height: 4,
    backgroundColor: '#1A1A1A',
    borderRadius: 2,
    marginBottom: 32,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#FBBF24',
    borderRadius: 2,
  },
  questionContainer: {
    marginBottom: 32,
  },
  questionNumber: {
    fontSize: 14,
    color: '#A3A3A3',
    marginBottom: 8,
  },
  questionText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    lineHeight: 32,
  },
  optionsContainer: {
    gap: 12,
  },
  optionButton: {
    backgroundColor: '#1A1A1A',
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#2A2A2A',
  },
  optionSelected: {
    backgroundColor: 'rgba(251, 191, 36, 0.1)',
    borderColor: '#FBBF24',
  },
  optionText: {
    fontSize: 16,
    color: '#FFFFFF',
  },
  optionTextSelected: {
    color: '#FBBF24',
  },
});