import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Animated,
  Platform,
} from "react-native";
import { X, Flame, ArrowLeft, ArrowRight } from "lucide-react-native";
import { ReviewBadge } from "./ReviewBadge";
import { useReviewMarks } from "../hooks/useReviewMarks";

interface ArticleContentScreenProps {
  article: {
    id: string;
    title: string;
    content: string;
    xp: number;
  };
  onComplete: (articleId: string, xp: number) => void;
  onClose: () => void;
  currentIndex: number;
  totalArticles: number;
  onNext: () => void;
  onPrevious: () => void;
}

const ArticleContentScreen: React.FC<ArticleContentScreenProps> = ({
  article,
  onComplete,
  onClose,
  currentIndex,
  totalArticles,
  onNext,
  onPrevious,
}) => {
  const { isMarkedForReview, toggleReviewMark } = useReviewMarks();
  const scrollY = new Animated.Value(0);

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [1, 0.98],
    extrapolate: "clamp",
  });

  const headerTranslateY = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [0, -20],
    extrapolate: "clamp",
  });

  return (
    <SafeAreaView style={styles.container}>
      <Animated.View
        style={[
          styles.header,
          {
            opacity: headerOpacity,
            transform: [{ translateY: headerTranslateY }],
          },
        ]}
      >
        <View style={styles.headerTop}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <X size={24} color="#4B4B4B" strokeWidth={2.5} />
          </TouchableOpacity>
          <ReviewBadge
            isMarked={isMarkedForReview(article.id)}
            onPress={() => toggleReviewMark(article.id)}
          />
          <View style={styles.xpContainer}>
            <Flame size={20} color="#FF9500" strokeWidth={2.5} />
            <Text style={styles.xpText}>{article.xp} XP</Text>
          </View>
        </View>

        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                { width: `${((currentIndex + 1) / totalArticles) * 100}%` },
              ]}
            />
          </View>
          <Text style={styles.progressText}>
            {currentIndex + 1} of {totalArticles}
          </Text>
        </View>
      </Animated.View>

      <Animated.ScrollView
        style={styles.content}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true },
        )}
        scrollEventThrottle={16}
      >
        <Text style={styles.title}>{article.title}</Text>
        <Text style={styles.contentText}>{article.content}</Text>
      </Animated.ScrollView>

      <View style={styles.footer}>
        <View style={styles.navigationButtons}>
          <TouchableOpacity
            style={[
              styles.navButton,
              currentIndex === 0 && styles.navButtonDisabled,
            ]}
            onPress={onPrevious}
            disabled={currentIndex === 0}
          >
            <ArrowLeft
              size={20}
              color={currentIndex === 0 ? "#CCC" : "#58CC02"}
            />
            <Text
              style={[
                styles.navButtonText,
                currentIndex === 0 && styles.navButtonTextDisabled,
              ]}
            >
              Previous
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.navButton,
              currentIndex === totalArticles - 1 && styles.navButtonDisabled,
            ]}
            onPress={onNext}
            disabled={currentIndex === totalArticles - 1}
          >
            <Text
              style={[
                styles.navButtonText,
                currentIndex === totalArticles - 1 &&
                  styles.navButtonTextDisabled,
              ]}
            >
              Next
            </Text>
            <ArrowRight
              size={20}
              color={currentIndex === totalArticles - 1 ? "#CCC" : "#58CC02"}
            />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.completeButton}
          onPress={() => onComplete(article.id, article.xp)}
        >
          <Text style={styles.completeButtonText}>Complete Lesson</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  header: {
    backgroundColor: "#FFFFFF",
    paddingTop: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
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
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 12,
  },
  closeButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: "#F8F9FA",
  },
  progressContainer: {
    paddingHorizontal: 20,
    paddingBottom: 12,
  },
  progressBar: {
    height: 4,
    backgroundColor: "#F0F0F0",
    borderRadius: 2,
    marginBottom: 8,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#58CC02",
    borderRadius: 2,
  },
  progressText: {
    fontSize: 12,
    color: "#666",
    textAlign: "right",
  },
  xpContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF5E6",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 24,
    ...Platform.select({
      ios: {
        shadowColor: "#FF9500",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  xpText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FF9500",
    marginLeft: 6,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#333333",
    marginBottom: 20,
    padding: 20,
    paddingBottom: 0,
  },
  contentText: {
    fontSize: 18,
    lineHeight: 28,
    color: "#4B4B4B",
    padding: 20,
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: "#E0E0E0",
    backgroundColor: "#FFFFFF",
  },
  navigationButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  navButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
    gap: 4,
  },
  navButtonDisabled: {
    opacity: 0.5,
  },
  navButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#58CC02",
  },
  navButtonTextDisabled: {
    color: "#CCC",
  },
  completeButton: {
    backgroundColor: "#58CC02",
    padding: 16,
    borderRadius: 30,
    alignItems: "center",
    ...Platform.select({
      ios: {
        shadowColor: "#58CC02",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  completeButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "700",
  },
});

export default ArticleContentScreen;
