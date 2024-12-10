import { useUser, useAuth } from '@clerk/clerk-expo'
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native'
import { useRouter } from 'expo-router'
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
  Zap
} from 'lucide-react-native'

// Types for our data
type Quiz = {
  id: string
  title: string
  questions: number
  duration: string
  subject: string
  icon: JSX.Element
}

type Topic = {
  id: string
  icon: JSX.Element
  name: string
  lessons: string
}

const quizzes: Quiz[] = [
  {
    id: 'math-1',
    title: 'Advanced Mathematics',
    questions: 15,
    duration: '30 min',
    subject: 'Mathematics',
    icon: <GraduationCap size={20} color="#FBBF24" />
  },
  {
    id: 'physics-1',
    title: 'Quantum Mechanics',
    questions: 12,
    duration: '25 min',
    subject: 'Physics',
    icon: <Atom size={20} color="#FBBF24" />
  }
]

const topics: Topic[] = [
  { 
    id: 'physics',
    icon: <Atom size={20} color="#FBBF24" />, 
    name: "Physics", 
    lessons: "24 lessons" 
  },
  { 
    id: 'programming',
    icon: <Code size={20} color="#FBBF24" />, 
    name: "Programming", 
    lessons: "32 lessons" 
  },
  { 
    id: 'mathematics',
    icon: <Binary size={20} color="#FBBF24" />, 
    name: "Mathematics", 
    lessons: "28 lessons" 
  },
  { 
    id: 'data-science',
    icon: <Database size={20} color="#FBBF24" />, 
    name: "Data Science", 
    lessons: "20 lessons" 
  }
]

export default function Home() {
  const { user } = useUser()
  const { signOut } = useAuth()
  const router = useRouter()

  const handleSignOut = async () => {
    try {
      await signOut()
      router.replace('/sign-in')
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  const handleQuizPress = (quizId: string) => {
    router.push(`/quiz/${quizId}/questions`)
  }

  const handleTopicPress = (topicId: string) => {
    router.push(`/topics/${topicId}`)
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Welcome back,</Text>
          <Text style={styles.userName}>
            {user?.firstName || user?.emailAddresses[0].emailAddress.split('@')[0]}
          </Text>
        </View>
        <TouchableOpacity onPress={handleSignOut}>
          <UserCircle size={32} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Progress Card */}
        <View style={styles.progressCard}>
          <View style={styles.progressTopRow}>
            {/* XP Section */}
            <View style={styles.xpContainer}>
              <View style={styles.xpIconContainer}>
                <Zap size={24} color="#FBBF24" />
              </View>
              <View>
                <Text style={styles.xpAmount}>2,450 XP</Text>
                <View style={styles.xpProgressContainer}>
                  <View style={styles.xpProgressBar}>
                    <View style={[styles.xpProgressFill, { width: '75%' }]} />
                  </View>
                  <Text style={styles.xpToNext}>550 XP to next level</Text>
                </View>
              </View>
            </View>

            {/* Divider */}
            <View style={styles.verticalDivider} />

            {/* Streak Section */}
            <View style={styles.streakContainer}>
              <View style={styles.streakIconContainer}>
                <Flame size={24} color="#FBBF24" />
              </View>
              <View>
                <Text style={styles.streakDays}>7 Days</Text>
                <Text style={styles.streakText}>Current Streak</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Trophy size={20} color="#FBBF24" />
            <Text style={styles.statNumber}>12</Text>
            <Text style={styles.statLabel}>Quizzes Completed</Text>
          </View>
          <View style={styles.statCard}>
            <Book size={20} color="#FBBF24" />
            <Text style={styles.statNumber}>8</Text>
            <Text style={styles.statLabel}>Articles Read</Text>
          </View>
        </View>

        {/* Recent Quizzes */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Quizzes</Text>
            <TouchableOpacity 
              style={styles.seeAllButton}
              onPress={() => router.push('/quizzes')}
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
                <View style={styles.quizIcon}>
                  {quiz.icon}
                </View>
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

        {/* Featured Articles */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Featured Articles</Text>
            <TouchableOpacity 
              style={styles.seeAllButton}
              onPress={() => router.push('/articles')}
            >
              <Text style={styles.seeAllText}>See all</Text>
              <ArrowRight size={16} color="#A3A3A3" />
            </TouchableOpacity>
          </View>
          <View style={styles.articleList}>
            {[1, 2].map((_, index) => (
              <TouchableOpacity 
                key={index} 
                style={styles.articleCard}
                onPress={() => router.push(`/articles`)}
              >
                <Text style={styles.articleTitle}>Understanding Quantum Physics</Text>
                <Text style={styles.articleMeta}>10 min read</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Topics */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Topics to Explore</Text>
            <TouchableOpacity 
              style={styles.seeAllButton}
              onPress={() => router.push('/topics')}
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
                <View style={styles.topicIcon}>
                  {topic.icon}
                </View>
                <Text style={styles.topicTitle}>{topic.name}</Text>
                <Text style={styles.topicMeta}>{topic.lessons}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.bottomPadding} />
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0A0A',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  greeting: {
    fontSize: 16,
    color: '#A3A3A3',
  },
  userName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  progressCard: {
    backgroundColor: '#1A1A1A',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  progressTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  xpContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  xpIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: 'rgba(251, 191, 36, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  xpAmount: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  xpProgressContainer: {
    width: '100%',
  },
  xpProgressBar: {
    height: 4,
    backgroundColor: 'rgba(251, 191, 36, 0.1)',
    borderRadius: 2,
    marginBottom: 4,
    width: 100,
  },
  xpProgressFill: {
    height: '100%',
    backgroundColor: '#FBBF24',
    borderRadius: 2,
  },
  xpToNext: {
    fontSize: 12,
    color: '#A3A3A3',
  },
  verticalDivider: {
    width: 1,
    height: 40,
    backgroundColor: '#2A2A2A',
    marginHorizontal: 16,
  },
  streakContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  streakIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: 'rgba(251, 191, 36, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  streakDays: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  streakText: {
    fontSize: 14,
    color: '#A3A3A3',
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#1A1A1A',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: '#A3A3A3',
    marginTop: 4,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  seeAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  seeAllText: {
    fontSize: 14,
    color: '#A3A3A3',
    marginRight: 4,
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
  articleList: {
    gap: 12,
  },
  articleCard: {
    backgroundColor: '#1A1A1A',
    borderRadius: 16,
    padding: 20,
  },
  articleTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  articleMeta: {
    fontSize: 14,
    color: '#A3A3A3',
  },
  topicsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  topicCard: {
    width: '48%',
    backgroundColor: '#1A1A1A',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
  },
  topicIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: 'rgba(251, 191, 36, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  topicTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
    textAlign: 'center',
  },
  topicMeta: {
    fontSize: 14,
    color: '#A3A3A3',
    textAlign: 'center',
  },
  bottomPadding: {
    height: 40,
  }
})