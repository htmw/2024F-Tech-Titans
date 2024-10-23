// components/ArticleReader.tsx
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import dummyArticles from "./dummyArticles";
import ArticleContentScreen from "./ArticleContentScreen";

interface ArticleReaderProps {
  subjectId: string;
  searchQuery: string;
  onArticleComplete: (xp: number) => void;
}

const ArticleReader: React.FC<ArticleReaderProps> = ({
  subjectId,
  searchQuery,
  onArticleComplete,
}) => {
  const [completedArticles, setCompletedArticles] = useState<string[]>([]);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [filteredArticles, setFilteredArticles] = useState([]);
  const articles = dummyArticles[subjectId] || [];

  // Update filtered articles whenever search query or subject changes
  useEffect(() => {
    const filtered = articles.filter((article) =>
      searchQuery
        ? article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          article.content.toLowerCase().includes(searchQuery.toLowerCase())
        : true,
    );
    setFilteredArticles(filtered);
  }, [searchQuery, subjectId, articles]);

  const handleCompleteArticle = (articleId: string, xp: number) => {
    if (!completedArticles.includes(articleId)) {
      setCompletedArticles([...completedArticles, articleId]);
      onArticleComplete(xp);
    }
    setSelectedArticle(null);
  };

  if (selectedArticle) {
    return (
      <ArticleContentScreen
        article={selectedArticle}
        onComplete={handleCompleteArticle}
        onClose={() => setSelectedArticle(null)}
        currentIndex={articles.findIndex((a) => a.id === selectedArticle.id)}
        totalArticles={articles.length}
        onNext={() => {
          const nextIndex =
            articles.findIndex((a) => a.id === selectedArticle.id) + 1;
          if (nextIndex < articles.length) {
            setSelectedArticle(articles[nextIndex]);
          }
        }}
        onPrevious={() => {
          const prevIndex =
            articles.findIndex((a) => a.id === selectedArticle.id) - 1;
          if (prevIndex >= 0) {
            setSelectedArticle(articles[prevIndex]);
          }
        }}
      />
    );
  }

  if (filteredArticles.length === 0) {
    return (
      <View style={styles.noResults}>
        <Text style={styles.noResultsText}>
          {searchQuery
            ? `No articles found matching "${searchQuery}"`
            : "No articles available for this subject yet."}
        </Text>
      </View>
    );
  }

  return (
    <ScrollView>
      {filteredArticles.map((article) => (
        <TouchableOpacity
          key={article.id}
          style={[
            styles.articleCard,
            completedArticles.includes(article.id) && styles.completedArticle,
          ]}
          onPress={() => setSelectedArticle(article)}
        >
          <View style={styles.articleContent}>
            <Text style={styles.articleTitle}>{article.title}</Text>
            <View style={styles.xpBadge}>
              <Text style={styles.xpText}>{article.xp} XP</Text>
            </View>
          </View>
          {completedArticles.includes(article.id) && (
            <Ionicons
              name="checkmark-circle"
              size={24}
              color="#58CC02"
              style={styles.completedIcon}
            />
          )}
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  articleCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  articleContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  articleTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#4B4B4B",
    flex: 1,
    marginRight: 12,
  },
  xpBadge: {
    backgroundColor: "#F0F0F0",
    borderRadius: 12,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  xpText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#58CC02",
  },
  completedArticle: {
    opacity: 0.7,
  },
  completedIcon: {
    position: "absolute",
    top: 16,
    right: 16,
  },
  noResults: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    marginTop: 40,
  },
  noResultsText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  },
});

export default ArticleReader;
