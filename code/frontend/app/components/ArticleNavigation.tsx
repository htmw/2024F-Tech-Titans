import React from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { ChevronLeft, ChevronRight } from "lucide-react-native";

interface ArticleNavigationProps {
  onNext: () => void;
  onPrevious: () => void;
  hasPrevious: boolean;
  hasNext: boolean;
  currentIndex: number;
  totalArticles: number;
}

export const ArticleNavigation = ({
  onNext,
  onPrevious,
  hasPrevious,
  hasNext,
  currentIndex,
  totalArticles,
}: ArticleNavigationProps) => (
  <View style={styles.container}>
    <TouchableOpacity
      style={[styles.navButton, !hasPrevious && styles.navButtonDisabled]}
      onPress={onPrevious}
      disabled={!hasPrevious}
    >
      <ChevronLeft size={24} color={hasPrevious ? "#58CC02" : "#ccc"} />
      <Text style={[styles.navText, !hasPrevious && styles.navTextDisabled]}>
        Previous
      </Text>
    </TouchableOpacity>

    <Text style={styles.progress}>
      {currentIndex + 1} of {totalArticles}
    </Text>

    <TouchableOpacity
      style={[styles.navButton, !hasNext && styles.navButtonDisabled]}
      onPress={onNext}
      disabled={!hasNext}
    >
      <Text style={[styles.navText, !hasNext && styles.navTextDisabled]}>
        Next
      </Text>
      <ChevronRight size={24} color={hasNext ? "#58CC02" : "#ccc"} />
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderTopWidth: 1,
    borderTopColor: "#E0E0E0",
    backgroundColor: "#fff",
  },
  navButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  navButtonDisabled: {
    opacity: 0.5,
  },
  navText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#58CC02",
  },
  navTextDisabled: {
    color: "#ccc",
  },
  progress: {
    fontSize: 14,
    color: "#666",
  },
});
