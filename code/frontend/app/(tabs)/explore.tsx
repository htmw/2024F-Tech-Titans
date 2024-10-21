import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";

import SubjectSelector from "../components/SubjectSelector";
import ArticleReader from "../components/ArticleReader";

const THEME_COLOR = "#58CC02";
const BACKGROUND_COLOR = "#F5F5F5";
const TEXT_COLOR = "#4B4B4B";

export default function ExplorePage() {
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [totalXP, setTotalXP] = useState(0);

  const handleSubjectSelect = (subjectId) => {
    setSelectedSubject(subjectId);
  };

  const handleBackToSubjects = () => {
    setSelectedSubject(null);
  };

  const handleArticleComplete = (xp) => {
    setTotalXP((prevXP) => prevXP + xp);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <View style={styles.header}>
        <Text style={styles.title}>Explore</Text>
        <View style={styles.xpContainer}>
          <Ionicons name="flame" size={24} color={THEME_COLOR} />
          <Text style={styles.xpText}>{totalXP} XP</Text>
        </View>
      </View>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {!selectedSubject ? (
          <>
            <Text style={styles.subtitle}>
              Choose a subject to start learning!
            </Text>
            <SubjectSelector onSelectSubject={handleSubjectSelect} />
          </>
        ) : (
          <>
            <TouchableOpacity
              onPress={handleBackToSubjects}
              style={styles.backButton}
            >
              <Ionicons name="arrow-back" size={24} color={THEME_COLOR} />
              <Text style={styles.backButtonText}>Back to Subjects</Text>
            </TouchableOpacity>
            <ArticleReader
              subjectId={selectedSubject}
              onArticleComplete={handleArticleComplete}
            />
          </>
        )}
      </ScrollView>
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
    padding: 16,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: TEXT_COLOR,
  },
  xpContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F0F0F0",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  xpText: {
    fontSize: 16,
    fontWeight: "bold",
    color: TEXT_COLOR,
    marginLeft: 6,
  },
  scrollContent: {
    padding: 16,
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 16,
    color: TEXT_COLOR,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  backButtonText: {
    fontSize: 18,
    color: THEME_COLOR,
    fontWeight: "bold",
    marginLeft: 8,
  },
});
