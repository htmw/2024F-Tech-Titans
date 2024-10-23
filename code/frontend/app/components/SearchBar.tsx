import React from "react";
import { View, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { Search, X } from "lucide-react-native";

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  onClear: () => void;
  placeholder?: string;
}

export const SearchBar = ({
  value,
  onChangeText,
  onClear,
  placeholder,
}: SearchBarProps) => (
  <View style={styles.searchContainer}>
    <Search size={20} color="#4B4B4B" />
    <TextInput
      style={styles.searchInput}
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder || "Search articles..."}
      placeholderTextColor="#999"
    />
    {value.length > 0 && (
      <TouchableOpacity onPress={onClear}>
        <X size={20} color="#4B4B4B" />
      </TouchableOpacity>
    )}
  </View>
);

const styles = StyleSheet.create({
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 16,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#333",
  },
});
