import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Animated } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, Clock, CheckCircle2, XCircle } from 'lucide-react-native';
import { useState, useEffect, useRef } from 'react';

type Question = {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
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
        correctAnswer: 0,
        explanation: "The derivative of e^x is e^x, making it one of the few functions that is its own derivative."
      },
      {
        id: 2,
        question: "What is the integral of 1/x?",
        options: ["x", "ln|x| + C", "1/x² + C", "x·ln(x)"],
        correctAnswer: 1,
        explanation: "The integral of 1/x is ln|x| + C. This is one of the fundamental integration rules."
      }
    ]
  },
  'physics-1': {
    title: 'Quantum Mechanics',
    duration: 1500,
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
        correctAnswer: 0,
        explanation: "The Schrödinger equation describes how the quantum state of a physical system changes over time."
      }
    ]
  }
};

export default function QuizQuestions() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState(1800);
  const [score, setScore] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const quizId = id as string;
  const quiz = quizData[quizId];

  useEffect(() => {
    if (quiz) {
      setTimeLeft(quiz.duration);
    }
  }, [quiz]);

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
    if (selectedAnswer !== null || !quiz) return;
    
    setSelectedAnswer(index);
    setShowFeedback(true);
    
    // Update score if correct
    if (index === quiz.questions[currentQuestion].correctAnswer) {
      setScore(prev => prev + 1);
    }

    // Animate feedback
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      })
    ]).start();

    // Move to next question after delay
    setTimeout(() => {
      if (currentQuestion < quiz.questions.length - 1) {
        setCurrentQuestion(prev => prev + 1);
        setSelectedAnswer(null);
        setShowFeedback(false);
        fadeAnim.setValue(0);
      } else {
        handleQuizComplete();
      }
    }, 2000);
  };

  const handleQuizComplete = () => {
    // Here you could navigate to a results page instead of going back
    router.back();
  };

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
  const isCorrect = selectedAnswer === currentQuestionData.correctAnswer;

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

        <View style={styles.scoreContainer}>
          <Text style={styles.scoreText}>Score: {score}/{quiz.questions.length}</Text>
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
                selectedAnswer === index && styles.optionSelected,
                showFeedback && selectedAnswer === index && (isCorrect ? styles.optionCorrect : styles.optionIncorrect),
                showFeedback && index === currentQuestionData.correctAnswer && styles.optionCorrect
              ]}
              onPress={() => handleAnswerSelect(index)}
              disabled={selectedAnswer !== null}
            >
              <Text style={[
                styles.optionText,
                selectedAnswer === index && styles.optionTextSelected,
                showFeedback && selectedAnswer === index && (isCorrect ? styles.optionTextCorrect : styles.optionTextIncorrect)
              ]}>
                {option}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {showFeedback && (
          <Animated.View 
            style={[
              styles.feedbackContainer,
              { opacity: fadeAnim }
            ]}
          >
            <View style={[
              styles.feedbackContent,
              isCorrect ? styles.feedbackCorrect : styles.feedbackIncorrect
            ]}>
              {isCorrect ? (
                <CheckCircle2 size={24} color="#22C55E" />
              ) : (
                <XCircle size={24} color="#EF4444" />
              )}
              <Text style={[
                styles.feedbackText,
                isCorrect ? styles.feedbackTextCorrect : styles.feedbackTextIncorrect
              ]}>
                {isCorrect ? 'Correct!' : 'Incorrect'}
              </Text>
              {currentQuestionData.explanation && (
                <Text style={styles.explanationText}>
                  {currentQuestionData.explanation}
                </Text>
              )}
            </View>
          </Animated.View>
        )}
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
  scoreContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  scoreText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '600',
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
  optionCorrect: {
    backgroundColor: 'rgba(34, 197, 94, 0.1)',
    borderColor: '#22C55E',
  },
  optionIncorrect: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderColor: '#EF4444',
  },
  optionText: {
    fontSize: 16,
    color: '#FFFFFF',
  },
  optionTextSelected: {
    color: '#FBBF24',
  },
  optionTextCorrect: {
    color: '#22C55E',
  },
  optionTextIncorrect: {
    color: '#EF4444',
  },
  feedbackContainer: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    alignItems: 'center',
  },
  feedbackContent: {
    flexDirection: 'column',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    width: '100%',
  },
  feedbackCorrect: {
    backgroundColor: 'rgba(34, 197, 94, 0.1)',
  },
  feedbackIncorrect: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
  },
  feedbackText: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 8,
    marginBottom: 4,
  },
  feedbackTextCorrect: {
    color: '#22C55E',
  },
  feedbackTextIncorrect: {
    color: '#EF4444',
  },
  explanationText: {
    fontSize: 14,
    color: '#A3A3A3',
    textAlign: 'center',
    marginTop: 8,
  },
});