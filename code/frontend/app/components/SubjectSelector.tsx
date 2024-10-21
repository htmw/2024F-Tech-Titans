import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

const subjects = [
  { id: "1", name: "Mathematics", icon: "🧮" },
  { id: "2", name: "Science", icon: "🔬" },
  { id: "3", name: "Literature", icon: "📚" },
  { id: "4", name: "History", icon: "🏛️" },
  { id: "5", name: "Art", icon: "🎨" },
];

const SubjectSelector = ({ onSelectSubject }) => {
  return (
    <View style={styles.container}>
      {subjects.map((subject) => (
        <TouchableOpacity
          key={subject.id}
          style={styles.card}
          onPress={() => onSelectSubject(subject.id)}
        >
          <View style={styles.cardContent}>
            <Text style={styles.icon}>{subject.icon}</Text>
            <Text style={styles.name}>{subject.name}</Text>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    padding: 8,
  },
  card: {
    width: "48%",
    marginBottom: 16,
  },
  cardContent: {
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
    borderRadius: 8,
    backgroundColor: "#f0f0f0",
  },
  icon: {
    fontSize: 36,
    marginBottom: 8,
  },
  name: {
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default SubjectSelector;
