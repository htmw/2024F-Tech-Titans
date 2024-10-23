import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Platform,
  Animated,
  TouchableOpacity,
} from "react-native";
import { Flame, ChevronLeft } from "lucide-react-native";
import { SearchBar } from "../components/SearchBar";
import SubjectSelector from "../components/SubjectSelector";
import ArticleReader from "../components/ArticleReader";

const THEME_COLOR = "#58CC02";
const BACKGROUND_COLOR = "#FFFFFF";
const TEXT_COLOR = "#2D3436";
const SECONDARY_COLOR = "#636E72";

export default function ExplorePage() {
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [totalXP, setTotalXP] = useState(0);
  const scrollY = new Animated.Value(0);

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 50],
    outputRange: [1, 0.98],
    extrapolate: "clamp",
  });

  const handleSearch = (text: string) => {
    setSearchQuery(text);
  };

  const clearSearch = () => {
    setSearchQuery("");
  };

  const handleBack = () => {
    setSelectedSubject(null);
    setSearchQuery("");
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={BACKGROUND_COLOR} />
      <Animated.View style={[styles.header, { opacity: headerOpacity }]}>
        <View style={styles.headerLeft}>
          {selectedSubject && (
            <TouchableOpacity
              onPress={handleBack}
              style={styles.backButton}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <ChevronLeft size={24} color={TEXT_COLOR} strokeWidth={2.5} />
            </TouchableOpacity>
          )}
          <View style={styles.titleContainer}>
            <Text style={styles.title}>
              {selectedSubject ? "Subject" : "Explore"}
            </Text>
            <Text style={styles.subtitle}>
              {selectedSubject ? "View all topics" : "Discover new topics"}
            </Text>
          </View>
        </View>
        <View style={styles.xpContainer}>
          <Flame
            size={20}
            color={THEME_COLOR}
            strokeWidth={2.5}
            style={styles.xpIcon}
          />
          <Text style={styles.xpText}>{totalXP} XP</Text>
        </View>
      </Animated.View>

      <Animated.ScrollView
        contentContainerStyle={styles.scrollContent}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true },
        )}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.searchContainer}>
          <SearchBar
            value={searchQuery}
            onChangeText={handleSearch}
            onClear={clearSearch}
            placeholder="Search topics..."
          />
        </View>

        {!selectedSubject ? (
          <View style={styles.subjectContainer}>
            <Text style={styles.sectionTitle}>
              What would you like to learn?
            </Text>
            <SubjectSelector onSelectSubject={setSelectedSubject} />
          </View>
        ) : (
          <ArticleReader
            subjectId={selectedSubject}
            searchQuery={searchQuery}
            onArticleComplete={(xp) => setTotalXP((prev) => prev + xp)}
          />
        )}
      </Animated.ScrollView>
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
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: BACKGROUND_COLOR,
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
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  backButton: {
    marginRight: 12,
    padding: 4,
    borderRadius: 20,
    backgroundColor: "#F8F9FA",
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: TEXT_COLOR,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 15,
    color: SECONDARY_COLOR,
    marginTop: 2,
  },
  xpContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F0FFF4",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 24,
    marginLeft: 16,
    ...Platform.select({
      ios: {
        shadowColor: THEME_COLOR,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  xpIcon: {
    marginRight: 6,
  },
  xpText: {
    fontSize: 16,
    fontWeight: "600",
    color: THEME_COLOR,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  subjectContainer: {
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: TEXT_COLOR,
    marginBottom: 16,
    letterSpacing: -0.3,
  },
});
