import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const subjects = [
  { id: "1", name: "Mathematics", icon: "calculator", color: "#58CC02" },
  { id: "2", name: "Physics", icon: "planet", color: "#CE82FF" },
  { id: "3", name: "Chemistry", icon: "flask", color: "#FF9600" },
];

const SubjectSelector = ({ onSelectSubject }) => {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.container}
    >
      {subjects.map((subject) => (
        <TouchableOpacity
          key={subject.id}
          style={[styles.card, { backgroundColor: subject.color }]}
          onPress={() => onSelectSubject(subject.id)}
        >
          <Ionicons name={subject.icon} size={40} color="white" />
          <Text style={styles.name}>{subject.name}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 0,
    marginBottom: 24,
  },
  card: {
    width: 140,
    height: 140,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
    marginTop: 8,
  },
});

export default SubjectSelector;
