// app/components/PerformanceDashboard.tsx
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Platform,
  SafeAreaView,
} from "react-native";
import { Flame, Book, Clock, Trophy } from "lucide-react-native";
import { performanceStorage } from "../utils/performanceStorage";
import { UserPerformance } from "../types/learning";

interface PerformanceDashboardProps {
  userId: string;
}

export const PerformanceDashboard: React.FC<PerformanceDashboardProps> = ({
  userId,
}) => {
  const [performances, setPerformances] = useState<UserPerformance[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPerformance();
  }, [userId]);

  const loadPerformance = async () => {
    try {
      const data = await performanceStorage.getUserPerformance(userId);
      setPerformances(data);
    } catch (error) {
      console.error("Error loading performance:", error);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = () => {
    if (performances.length === 0)
      return { avgScore: 0, totalTime: 0, articles: 0 };

    const avgScore =
      performances.reduce((sum, p) => sum + p.quizScore, 0) /
      performances.length;
    const totalTime = performances.reduce((sum, p) => sum + p.timeSpent, 0);
    const articles = performances.length;

    return { avgScore, totalTime, articles };
  };

  const stats = calculateStats();

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading performance data...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <Text style={styles.title}>Performance Dashboard</Text>
        </View>

        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Trophy size={24} color="#58CC02" />
            <Text style={styles.statValue}>{stats.avgScore.toFixed(1)}%</Text>
            <Text style={styles.statLabel}>Average Score</Text>
          </View>

          <View style={styles.statCard}>
            <Book size={24} color="#FF9500" />
            <Text style={styles.statValue}>{stats.articles}</Text>
            <Text style={styles.statLabel}>Articles Completed</Text>
          </View>

          <View style={styles.statCard}>
            <Clock size={24} color="#CE82FF" />
            <Text style={styles.statValue}>
              {Math.round(stats.totalTime / 60)}m
            </Text>
            <Text style={styles.statLabel}>Total Time</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          <ScrollView style={styles.activityList}>
            {performances
              .slice(-5)
              .reverse()
              .map((performance) => (
                <View
                  key={`${performance.articleId}-${performance.lastReviewed}`}
                  style={styles.activityItem}
                >
                  <View style={styles.activityContent}>
                    <Text style={styles.activityTitle}>Article Review</Text>
                    <Text style={styles.activityDate}>
                      {new Date(performance.lastReviewed).toLocaleDateString()}
                    </Text>
                  </View>
                  <View style={styles.scoreContainer}>
                    <Flame size={16} color="#FF9500" />
                    <Text style={styles.scoreText}>
                      {performance.quizScore}%
                    </Text>
                  </View>
                </View>
              ))}
          </ScrollView>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    padding: 20,
    backgroundColor: "#FFFFFF",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333333",
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    padding: 10,
    justifyContent: "space-between",
  },
  statCard: {
    width: "30%",
    backgroundColor: "#FFFFFF",
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  statValue: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333333",
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: "#666666",
    marginTop: 4,
    textAlign: "center",
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333333",
    marginBottom: 12,
  },
  activityList: {
    maxHeight: 300,
  },
  activityItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 12,
    backgroundColor: "#F8F9FA",
    borderRadius: 8,
    marginBottom: 8,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 14,
    fontWeight: "500",
    color: "#333333",
  },
  activityDate: {
    fontSize: 12,
    color: "#666666",
    marginTop: 2,
  },
  scoreContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF5E6",
    padding: 6,
    borderRadius: 12,
    gap: 4,
  },
  scoreText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FF9500",
  },
});

export default PerformanceDashboard;
