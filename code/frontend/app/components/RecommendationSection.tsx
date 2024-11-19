import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from "react-native";
import { BookOpen } from "lucide-react-native";

interface RecommendationSectionProps {
  recommendations: string[];
  onSelectArticle: (articleId: string) => void;
  articles: any[];
}

export const RecommendationSection: React.FC<RecommendationSectionProps> = ({
  recommendations,
  onSelectArticle,
  articles,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Recommended for You</Text>
      <View style={styles.recommendationList}>
        {recommendations.map((articleId) => {
          const article = articles.find((a) => a.id === articleId);
          if (!article) return null;

          return (
            <TouchableOpacity
              key={articleId}
              style={styles.recommendationCard}
              onPress={() => onSelectArticle(articleId)}
            >
              <BookOpen size={20} color="#58CC02" />
              <View style={styles.recommendationContent}>
                <Text style={styles.recommendationTitle}>{article.title}</Text>
                <Text style={styles.recommendationDescription}>
                  Recommended based on your recent performance
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    color: "#333333",
    marginBottom: 16,
  },
  recommendationList: {
    gap: 12,
  },
  recommendationCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    gap: 12,
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
  recommendationContent: {
    flex: 1,
  },
  recommendationTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333333",
    marginBottom: 4,
  },
  recommendationDescription: {
    fontSize: 12,
    color: "#666666",
  },
});

export default RecommendationSection;
