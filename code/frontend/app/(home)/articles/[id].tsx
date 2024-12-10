import {
  View,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { ArrowLeft } from "lucide-react-native";
import { WebView } from "react-native-webview";
import { useState } from "react";

// Mapping of article IDs to their URLs
const articleUrls: Record<string, string> = {
  "physics-1": "https://www.nature.com/articles/s41586-024-07824-z",
  "physics-2":
    "https://www.space.com/17661-theory-general-relativity.html#:~:text=General%20relativity%20is%20a%20physical,the%20matter%20curves%20the%20spacetime.",
  "math-1": "https://kids.frontiersin.org/articles/10.3389/frym.2018.00040/",
  "math-2":
    "https://betterexplained.com/articles/a-gentle-introduction-to-learning-calculus/",
  "prog-1": "https://javascript.info/",
  "prog-2": "https://www.pythonforbeginners.com/python-tutorial",
  "data-1": "https://builtin.com/machine-learning/machine-learning-basics",
  "data-2": "https://www.tableau.com/learn/articles/data-visualization-tips",
};

export default function ArticleDetail() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [isLoading, setIsLoading] = useState(true);

  const articleId = id as string;
  const articleUrl = articleUrls[articleId];

  if (!articleUrl) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <ArrowLeft size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Article not found</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <ArrowLeft size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <View style={styles.webviewContainer}>
        {isLoading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#FBBF24" />
          </View>
        )}

        <WebView
          source={{ uri: articleUrl }}
          style={styles.webview}
          onLoadStart={() => setIsLoading(true)}
          onLoadEnd={() => setIsLoading(false)}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0A0A0A",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: "#1A1A1A",
  },
  backButton: {
    padding: 4,
  },
  webviewContainer: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  webview: {
    flex: 1,
  },
  loadingContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#0A0A0A",
    zIndex: 1,
  },
  errorContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: "#FFFFFF",
    textAlign: "center",
  },
});
