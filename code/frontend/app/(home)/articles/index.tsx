import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { 
  ArrowLeft,
  Clock,
  BookOpen,
  Atom,
  Code,
  Binary,
  Database,
  Bookmark
} from 'lucide-react-native';

type Article = {
  id: string;
  title: string;
  description: string;
  readTime: string;
  category: string;
  icon: JSX.Element;
  author: string;
  isBookmarked?: boolean;
};

type TopicArticles = {
  [key: string]: {
    icon: JSX.Element;
    title: string;
    articles: Article[];
  };
};

const allArticles: TopicArticles = {
  physics: {
    icon: <Atom size={20} color="#FBBF24" />,
    title: "Physics",
    articles: [
      {
        id: 'physics-1',
        title: 'Understanding Quantum Entanglement',
        description: 'A deep dive into one of the most fascinating phenomena in quantum mechanics...',
        readTime: '10 min',
        category: 'Physics',
        icon: <Atom size={20} color="#FBBF24" />,
        author: 'Dr. Sarah Chen',
        isBookmarked: true
      },
      {
        id: 'physics-2',
        title: 'The Theory of Relativity Explained',
        description: 'Breaking down Einstein\'s famous theory into digestible concepts...',
        readTime: '15 min',
        category: 'Physics',
        icon: <Atom size={20} color="#FBBF24" />,
        author: 'Prof. James Miller'
      }
    ]
  },
  mathematics: {
    icon: <Binary size={20} color="#FBBF24" />,
    title: "Mathematics",
    articles: [
      {
        id: 'math-1',
        title: 'The Beauty of Prime Numbers',
        description: 'Exploring the patterns and mysteries behind prime numbers...',
        readTime: '8 min',
        category: 'Mathematics',
        icon: <Binary size={20} color="#FBBF24" />,
        author: 'Dr. Michael Chang'
      },
      {
        id: 'math-2',
        title: 'Understanding Calculus Intuitively',
        description: 'A visual approach to understanding the fundamentals of calculus...',
        readTime: '12 min',
        category: 'Mathematics',
        icon: <Binary size={20} color="#FBBF24" />,
        author: 'Prof. Emma Watson'
      }
    ]
  },
  programming: {
    icon: <Code size={20} color="#FBBF24" />,
    title: "Programming",
    articles: [
      {
        id: 'prog-1',
        title: 'Modern JavaScript Features',
        description: 'Exploring the latest features in JavaScript and how to use them...',
        readTime: '10 min',
        category: 'Programming',
        icon: <Code size={20} color="#FBBF24" />,
        author: 'Alex Johnson'
      },
      {
        id: 'prog-2',
        title: 'Python for Data Science',
        description: 'Getting started with Python in the field of data science...',
        readTime: '15 min',
        category: 'Programming',
        icon: <Code size={20} color="#FBBF24" />,
        author: 'Lisa Zhang'
      }
    ]
  },
  'data-science': {
    icon: <Database size={20} color="#FBBF24" />,
    title: "Data Science",
    articles: [
      {
        id: 'data-1',
        title: 'Introduction to Machine Learning',
        description: 'Understanding the basics of machine learning algorithms...',
        readTime: '12 min',
        category: 'Data Science',
        icon: <Database size={20} color="#FBBF24" />,
        author: 'Dr. Robert Lee'
      },
      {
        id: 'data-2',
        title: 'Data Visualization Techniques',
        description: 'Best practices for creating effective data visualizations...',
        readTime: '8 min',
        category: 'Data Science',
        icon: <Database size={20} color="#FBBF24" />,
        author: 'Maria Garcia'
      }
    ]
  }
};

export default function Articles() {
  const router = useRouter();

  const handleArticlePress = (articleId: string) => {
    router.push(`/articles/${articleId}`);
  };

  const handleBackPress = () => {
    try {
      router.back();
    } catch {
      router.replace('/');
    }
  };

  const toggleBookmark = (articleId: string) => {
    // Implement bookmark functionality
    console.log('Toggle bookmark for article:', articleId);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
          <ArrowLeft size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Featured Articles</Text>
        <View style={{ width: 32 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {Object.entries(allArticles).map(([key, topicData]) => (
          <View key={key} style={styles.section}>
            <View style={styles.topicHeader}>
              <View style={styles.topicIcon}>
                {topicData.icon}
              </View>
              <Text style={styles.topicTitle}>{topicData.title}</Text>
            </View>

            <View style={styles.articleList}>
              {topicData.articles.map((article) => (
                <TouchableOpacity 
                  key={article.id} 
                  style={styles.articleCard}
                  onPress={() => handleArticlePress(article.id)}
                >
                  <View style={styles.articleHeader}>
                    <View style={styles.categoryContainer}>
                      <View style={styles.categoryIcon}>
                        {article.icon}
                      </View>
                      <Text style={styles.categoryText}>{article.category}</Text>
                    </View>
                    <TouchableOpacity 
                      style={styles.bookmarkButton}
                      onPress={() => toggleBookmark(article.id)}
                    >
                      <Bookmark 
                        size={20} 
                        color={article.isBookmarked ? '#FBBF24' : '#A3A3A3'}
                        fill={article.isBookmarked ? '#FBBF24' : 'transparent'}
                      />
                    </TouchableOpacity>
                  </View>

                  <Text style={styles.articleTitle}>{article.title}</Text>
                  <Text style={styles.articleDescription}>{article.description}</Text>

                  <View style={styles.articleFooter}>
                    <Text style={styles.authorText}>{article.author}</Text>
                    <View style={styles.readTimeContainer}>
                      <Clock size={14} color="#A3A3A3" />
                      <Text style={styles.readTimeText}>{article.readTime}</Text>
                    </View>
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
  articleList: {
    gap: 16,
  },
  articleCard: {
    backgroundColor: '#1A1A1A',
    borderRadius: 16,
    padding: 16,
  },
  articleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  categoryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryIcon: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: 'rgba(251, 191, 36, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  categoryText: {
    fontSize: 14,
    color: '#FBBF24',
    fontWeight: '500',
  },
  bookmarkButton: {
    padding: 4,
  },
  articleTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 8,
    lineHeight: 24,
  },
  articleDescription: {
    fontSize: 14,
    color: '#A3A3A3',
    marginBottom: 16,
    lineHeight: 20,
  },
  articleFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  authorText: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  readTimeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  readTimeText: {
    fontSize: 14,
    color: '#A3A3A3',
  },
  bottomPadding: {
    height: 40,
  },
});