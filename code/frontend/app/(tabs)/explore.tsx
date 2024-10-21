import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, SafeAreaView } from "react-native";
import { StatusBar } from "expo-status-bar";
import SubjectSelector from "../components/SubjectSelector";

export default function ExplorePage() {
  const [selectedSubject, setSelectedSubject] = useState(null);

  const handleSubjectSelect = (subjectId) => {
    setSelectedSubject(subjectId);
    console.log(`Selected subject: ${subjectId}`);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="auto" />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Explore Subjects</Text>
        </View>
        <Text style={styles.subtitle}>
          Select a subject to start exploring articles.
        </Text>
        <SubjectSelector onSelectSubject={handleSubjectSelect} />
        {selectedSubject && (
          <Text style={styles.selectionText}>
            You selected subject ID: {selectedSubject}
          </Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollContent: {
    padding: 16,
  },
  titleContainer: {
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 16,
  },
  selectionText: {
    marginTop: 16,
    fontSize: 16,
  },
});
