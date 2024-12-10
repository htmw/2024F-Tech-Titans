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
  Database
} from 'lucide-react-native'

export default function Home() {
  const { user } = useUser()
  const { signOut } = useAuth()
  const router = useRouter()

  const topics = [
    { icon: <Atom size={20} color="#FBBF24" />, name: "Physics", lessons: "24 lessons" },
    { icon: <Code size={20} color="#FBBF24" />, name: "Programming", lessons: "32 lessons" },
    { icon: <Binary size={20} color="#FBBF24" />, name: "Mathematics", lessons: "28 lessons" },
    { icon: <Database size={20} color="#FBBF24" />, name: "Data Science", lessons: "20 lessons" },
  ]

  const handleSignOut = async () => {
    try {
      await signOut()
      router.replace('/sign-in')
    } catch (error) {
      console.error('Error signing out:', error)
    }
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
        {/* Streak Section */}
        <View style={styles.streakCard}>
          <View style={styles.streakContent}>
            <Flame size={24} color="#FBBF24" />
            <View style={styles.streakInfo}>
              <Text style={styles.streakDays}>7 Days</Text>
              <Text style={styles.streakText}>Current Streak</Text>
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
            <TouchableOpacity style={styles.seeAllButton}>
              <Text style={styles.seeAllText}>See all</Text>
              <ArrowRight size={16} color="#A3A3A3" />
            </TouchableOpacity>
          </View>
          <View style={styles.quizList}>
            {[1, 2].map((_, index) => (
              <TouchableOpacity key={index} style={styles.quizCard}>
                <View style={styles.quizIcon}>
                  <GraduationCap size={20} color="#FBBF24" />
                </View>
                <View style={styles.quizInfo}>
                  <Text style={styles.quizTitle}>Advanced Mathematics</Text>
                  <Text style={styles.quizSubtitle}>15 questions • 30 min</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Featured Articles */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Featured Articles</Text>
            <TouchableOpacity style={styles.seeAllButton}>
              <Text style={styles.seeAllText}>See all</Text>
              <ArrowRight size={16} color="#A3A3A3" />
            </TouchableOpacity>
          </View>
          <View style={styles.articleList}>
            {[1, 2].map((_, index) => (
              <TouchableOpacity key={index} style={styles.articleCard}>
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
            <TouchableOpacity style={styles.seeAllButton}>
              <Text style={styles.seeAllText}>See all</Text>
              <ArrowRight size={16} color="#A3A3A3" />
            </TouchableOpacity>
          </View>
          <View style={styles.topicsGrid}>
            {topics.map((topic, index) => (
              <TouchableOpacity key={index} style={styles.topicCard}>
                <View style={styles.topicIcon}>
                  {topic.icon}
                </View>
                <Text style={styles.topicTitle}>{topic.name}</Text>
                <Text style={styles.topicMeta}>{topic.lessons}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
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
  streakCard: {
    backgroundColor: '#1A1A1A',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  streakContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  streakInfo: {
    marginLeft: 12,
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
})