import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const ArticleContentScreen = ({ article, onComplete, onClose }) => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <Ionicons name="close" size={24} color="#4B4B4B" />
        </TouchableOpacity>
        <View style={styles.xpContainer}>
          <Ionicons name="flame" size={20} color="#FF9500" />
          <Text style={styles.xpText}>{article.xp} XP</Text>
        </View>
      </View>
      <ScrollView style={styles.content}>
        <Text style={styles.title}>{article.title}</Text>
        <Text style={styles.contentText}>{article.content}</Text>
      </ScrollView>
      <TouchableOpacity
        style={styles.completeButton}
        onPress={() => onComplete(article.id, article.xp)}
      >
        <Text style={styles.completeButtonText}>Complete Lesson</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  closeButton: {
    padding: 5,
  },
  xpContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF5E6",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  xpText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FF9500",
    marginLeft: 6,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333333",
    marginBottom: 20,
  },
  contentText: {
    fontSize: 18,
    lineHeight: 28,
    color: "#4B4B4B",
  },
  completeButton: {
    backgroundColor: "#58CC02",
    margin: 20,
    padding: 15,
    borderRadius: 30,
    alignItems: "center",
  },
  completeButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default ArticleContentScreen;
