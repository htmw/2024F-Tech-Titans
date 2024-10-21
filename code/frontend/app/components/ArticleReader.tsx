import React, { useState } from "react";
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

const ArticleReader = ({ subjectId, onArticleComplete }) => {
  const [completedArticles, setCompletedArticles] = useState([]);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const articles = dummyArticles[subjectId] || [];

  const handleCompleteArticle = (articleId, xp) => {
    if (!completedArticles.includes(articleId)) {
      setCompletedArticles([...completedArticles, articleId]);
      onArticleComplete(xp);
    }
    setSelectedArticle(null);
  };

  const handleSelectArticle = (article) => {
    setSelectedArticle(article);
  };

  if (articles.length === 0) {
    return (
      <Text style={styles.noArticles}>
        No lessons available for this subject yet. Check back soon!
      </Text>
    );
  }

  if (selectedArticle) {
    return (
      <ArticleContentScreen
        article={selectedArticle}
        onComplete={handleCompleteArticle}
        onClose={() => setSelectedArticle(null)}
      />
    );
  }

  return (
    <ScrollView style={styles.container}>
      {articles.map((article) => (
        <TouchableOpacity
          key={article.id}
          style={[
            styles.articleCard,
            completedArticles.includes(article.id) && styles.completedArticle,
          ]}
          onPress={() => handleSelectArticle(article)}
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
  container: {
    flex: 1,
  },
  articleCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
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
  noArticles: {
    fontSize: 16,
    textAlign: "center",
    marginTop: 20,
    color: "#777",
  },
});

export default ArticleReader;
