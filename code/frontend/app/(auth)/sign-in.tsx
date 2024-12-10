import { useOAuth } from '@clerk/clerk-expo';
import { useRouter } from 'expo-router';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import { useCallback } from 'react';
import { useWarmUpBrowser } from '../hooks/useWarmUpBrowser';
import { Sparkles } from 'lucide-react-native';

const { width } = Dimensions.get('window');
WebBrowser.maybeCompleteAuthSession();

export default function SignIn() {
  useWarmUpBrowser();
  const router = useRouter();
  const { startOAuthFlow } = useOAuth({ strategy: "oauth_google" });

  const onSignInWithGoogle = useCallback(async () => {
    try {
      const { createdSessionId, signIn, signUp, setActive } = await startOAuthFlow();
      if (createdSessionId) {
        setActive({ session: createdSessionId });
        router.push('/');
      }
    } catch (err) {
      console.error("OAuth error:", err);
    }
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {/* Gradient Accent */}
        <View style={styles.gradientAccent} />
        
        {/* Logo and Branding */}
        <View style={styles.brandSection}>
          <View style={styles.logoWrapper}>
            <Sparkles size={28} color="#FBBF24" style={styles.sparkleIcon} />
          </View>
          <Text style={styles.appName}>Illumination</Text>
        </View>

        {/* Main Content */}
        <View style={styles.mainContent}>
          <Text style={styles.headline}>
            Unlock your learning potential
          </Text>
          <Text style={styles.subheadline}>
            Join the world's most ambitious learners
          </Text>

          <TouchableOpacity 
            style={styles.signInButton}
            onPress={onSignInWithGoogle}
            activeOpacity={0.8}
          >
            <Text style={styles.buttonText}>Continue with Google</Text>
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <Text style={styles.footer}>
          By continuing, you agree to our Terms and Privacy Policy
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0A0A',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 24,
    paddingTop: 120,
    paddingBottom: 40,
  },
  gradientAccent: {
    position: 'absolute',
    top: -200,
    width: width * 2,
    height: width * 2,
    borderRadius: width,
    backgroundColor: '#1E1E1E',
    opacity: 0.3,
    transform: [{ translateX: -width / 2 }],
  },
  brandSection: {
    alignItems: 'center',
    marginBottom: 60,
  },
  logoWrapper: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: 'rgba(251, 191, 36, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  appName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: -0.5,
  },
  mainContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    maxWidth: 360,
  },
  headline: {
    fontSize: 32,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 12,
    letterSpacing: -0.5,
  },
  subheadline: {
    fontSize: 16,
    color: '#A3A3A3',
    textAlign: 'center',
    marginBottom: 40,
    lineHeight: 24,
  },
  signInButton: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0A0A0A',
  },
  footer: {
    fontSize: 13,
    color: '#737373',
    textAlign: 'center',
    marginTop: 40,
  },
});