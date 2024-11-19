import React from "react";
import { Animated } from "react-native";

export const useQuizAnimations = () => {
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const slideAnim = React.useRef(new Animated.Value(50)).current;

  const animateIn = React.useCallback(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, slideAnim]);

  const animateOut = React.useCallback(
    (callback: () => void) => {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: -50,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start(callback);
    },
    [fadeAnim, slideAnim],
  );

  return {
    fadeAnim,
    slideAnim,
    animateIn,
    animateOut,
  };
};

export const AnimatedQuestion: React.FC<{
  children: React.ReactNode;
  style?: any;
}> = ({ children, style }) => {
  const { fadeAnim, slideAnim, animateIn } = useQuizAnimations();

  React.useEffect(() => {
    animateIn();
  }, [animateIn]);

  return (
    <Animated.View
      style={[
        style,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      {children}
    </Animated.View>
  );
};
