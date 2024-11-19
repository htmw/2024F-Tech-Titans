import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Platform,
  Animated,
  TouchableOpacity,
} from "react-native";
import { Flame, ChevronLeft, Clock, BookOpen } from "lucide-react-native";
import { SearchBar } from "../components/SearchBar";
import SubjectSelector from "../components/SubjectSelector";
import ArticleReader from "../components/ArticleReader";
import { Article } from "../types/article";
import { ArticleRecommendationEngine } from "../utils/recommendationEngine";
import { performanceStorage } from "../utils/performanceStorage";

const THEME_COLOR = "#58CC02";
const BACKGROUND_COLOR = "#FFFFFF";
const TEXT_COLOR = "#2D3436";
const SECONDARY_COLOR = "#636E72";

export default function ExplorePage() {
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [totalXP, setTotalXP] = useState(0);
  const [readArticles, setReadArticles] = useState<Article[]>([]);
  const [recommendedArticles, setRecommendedArticles] = useState<Article[]>([]);
  const scrollY = new Animated.Value(0);

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 50],
    outputRange: [1, 0.98],
    extrapolate: "clamp",
  });

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    const userId = "user123"; // Replace with actual user ID
    const performance = await performanceStorage.getUserPerformance(userId);
    const completedArticles = performance.map((p) => p.articleId);
    const allArticles = []; // Load your articles from your data source

    // Filter read articles
    const userReadArticles = allArticles.filter((article) =>
      completedArticles.includes(article.id),
    );
    setReadArticles(userReadArticles);

    // Get recommendations
    const recommendations =
      ArticleRecommendationEngine.getArticleRecommendations(
        userReadArticles,
        allArticles,
      );
    setRecommendedArticles(recommendations);
  };

  const handleSearch = (text: string) => {
    setSearchQuery(text);
  };

  const clearSearch = () => {
    setSearchQuery("");
  };

  const handleBack = () => {
    setSelectedSubject(null);
    setSearchQuery("");
  };

  const renderArticleCard = (article: Article) => (
    <TouchableOpacity
      key={article.id}
      style={styles.articleCard}
      onPress={() => setSelectedSubject(article.id)}
    >
      <View style={styles.articleHeader}>
        <BookOpen size={20} color={THEME_COLOR} />
        <View style={styles.articleTags}>
          {article.tags.map((tag, index) => (
            <View key={index} style={styles.tagBadge}>
              <Text style={styles.tagText}>{tag}</Text>
            </View>
          ))}
        </View>
      </View>
      <Text style={styles.articleTitle}>{article.title}</Text>
      <View style={styles.articleFooter}>
        <View style={styles.readTimeContainer}>
          <Clock size={16} color={SECONDARY_COLOR} />
          <Text style={styles.readTime}>{article.readTime} min read</Text>
        </View>
        <View style={styles.difficultyBadge}>
          <Text style={styles.difficultyText}>
            Level {Math.ceil(article.difficulty * 5)}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={BACKGROUND_COLOR} />
      <Animated.View style={[styles.header, { opacity: headerOpacity }]}>
        <View style={styles.headerLeft}>
          {selectedSubject && (
            <TouchableOpacity
              onPress={handleBack}
              style={styles.backButton}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <ChevronLeft size={24} color={TEXT_COLOR} strokeWidth={2.5} />
            </TouchableOpacity>
          )}
          <View style={styles.titleContainer}>
            <Text style={styles.title}>
              {selectedSubject ? "Subject" : "Explore"}
            </Text>
            <Text style={styles.subtitle}>
              {selectedSubject ? "View all topics" : "Discover new topics"}
            </Text>
          </View>
        </View>
        <View style={styles.xpContainer}>
          <Flame size={20} color={THEME_COLOR} strokeWidth={2.5} />
          <Text style={styles.xpText}>{totalXP} XP</Text>
        </View>
      </Animated.View>

      <Animated.ScrollView
        contentContainerStyle={styles.scrollContent}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true },
        )}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.searchContainer}>
          <SearchBar
            value={searchQuery}
            onChangeText={handleSearch}
            onClear={clearSearch}
            placeholder="Search topics..."
          />
        </View>

        {!selectedSubject ? (
          <>
            <View style={styles.subjectContainer}>
              <Text style={styles.sectionTitle}>
                What would you like to learn?
              </Text>
              <SubjectSelector onSelectSubject={setSelectedSubject} />
            </View>

            {recommendedArticles.length > 0 && (
              <View style={styles.recommendedSection}>
                <Text style={styles.sectionTitle}>Recommended For You</Text>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.recommendedList}
                >
                  {recommendedArticles.map((article) =>
                    renderArticleCard(article),
                  )}
                </ScrollView>
              </View>
            )}
          </>
        ) : (
          <ArticleReader
            subjectId={selectedSubject}
            searchQuery={searchQuery}
            onArticleComplete={(xp) => {
              setTotalXP((prev) => prev + xp);
              loadUserData(); // Refresh recommendations
            }}
          />
        )}
      </Animated.ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BACKGROUND_COLOR,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: BACKGROUND_COLOR,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  backButton: {
    marginRight: 12,
    padding: 4,
    borderRadius: 20,
    backgroundColor: "#F8F9FA",
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: TEXT_COLOR,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 15,
    color: SECONDARY_COLOR,
    marginTop: 2,
  },
  xpContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F0FFF4",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 24,
    marginLeft: 16,
    ...Platform.select({
      ios: {
        shadowColor: THEME_COLOR,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  xpIcon: {
    marginRight: 6,
  },
  xpText: {
    fontSize: 16,
    fontWeight: "600",
    color: THEME_COLOR,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  subjectContainer: {
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: TEXT_COLOR,
    marginBottom: 16,
    letterSpacing: -0.3,
  },

  // New styles for recommended articles section
  recommendedSection: {
    marginTop: 24,
    paddingHorizontal: 20,
  },
  recommendedList: {
    paddingRight: 20,
  },
  articleCard: {
    width: 280,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    marginRight: 16,
    marginBottom: 8,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  articleHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  articleTags: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginLeft: 12,
    flex: 1,
    gap: 4,
  },
  tagBadge: {
    backgroundColor: "#F0FFF4",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  tagText: {
    fontSize: 12,
    color: THEME_COLOR,
    fontWeight: "500",
  },
  articleTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: TEXT_COLOR,
    marginBottom: 12,
    lineHeight: 24,
  },
  articleFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  readTimeContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  readTime: {
    fontSize: 14,
    color: SECONDARY_COLOR,
  },
  difficultyBadge: {
    backgroundColor: "#F8F9FA",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },
  difficultyText: {
    fontSize: 12,
    color: SECONDARY_COLOR,
    fontWeight: "500",
  },

  // Animations and transitions
  fadeIn: {
    opacity: 1,
    transform: [{ translateY: 0 }],
  },
  fadeOut: {
    opacity: 0,
    transform: [{ translateY: 20 }],
  },

  // Empty state styles
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    marginTop: 40,
  },
  emptyIcon: {
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: TEXT_COLOR,
    marginBottom: 8,
    textAlign: "center",
  },
  emptyText: {
    fontSize: 14,
    color: SECONDARY_COLOR,
    textAlign: "center",
    lineHeight: 20,
  },

  // Progress indicators
  progressIndicator: {
    height: 4,
    backgroundColor: "#F0F0F0",
    borderRadius: 2,
    marginTop: 8,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: THEME_COLOR,
    borderRadius: 2,
  },

  // Category badges
  categoryBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8F9FA",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  categoryIcon: {
    marginRight: 6,
  },
  categoryText: {
    fontSize: 14,
    color: SECONDARY_COLOR,
    fontWeight: "500",
  },
  categoryActive: {
    backgroundColor: "#F0FFF4",
  },
  categoryTextActive: {
    color: THEME_COLOR,
  },

  // Filter section
  filterContainer: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  filterRow: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  filterTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: TEXT_COLOR,
    marginBottom: 8,
  },

  // List section
  listContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  listHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 16,
  },
  listTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: TEXT_COLOR,
  },
  sortButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  sortText: {
    fontSize: 14,
    color: SECONDARY_COLOR,
  },

  // Grid layout
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginHorizontal: -8,
  },
  gridItem: {
    width: "50%",
    paddingHorizontal: 8,
    marginBottom: 16,
  },

  // Loading states
  loadingContainer: {
    padding: 20,
    alignItems: "center",
  },
  loadingText: {
    fontSize: 14,
    color: SECONDARY_COLOR,
    marginTop: 8,
  },
  shimmer: {
    opacity: 0.7,
    overflow: "hidden",
  },
});
