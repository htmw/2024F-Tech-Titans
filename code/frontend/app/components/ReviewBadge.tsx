import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { Bookmark } from "lucide-react-native";

interface ReviewBadgeProps {
  isMarked: boolean;
  onPress: () => void;
}

export const ReviewBadge = ({ isMarked, onPress }: ReviewBadgeProps) => (
  <TouchableOpacity
    style={[styles.badge, isMarked && styles.badgeMarked]}
    onPress={onPress}
  >
    <Bookmark size={16} color={isMarked ? "#ffffff" : "#58CC02"} />
    <Text style={[styles.badgeText, isMarked && styles.badgeTextMarked]}>
      {isMarked ? "Marked" : "Mark for Review"}
    </Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  badge: {
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
    borderRadius: 16,
    backgroundColor: "#E8F4EA",
    borderWidth: 1,
    borderColor: "#58CC02",
    gap: 4,
  },
  badgeMarked: {
    backgroundColor: "#58CC02",
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#58CC02",
  },
  badgeTextMarked: {
    color: "#ffffff",
  },
});
