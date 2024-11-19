import { Tabs } from "expo-router";
import React from "react";
import { View, Platform } from "react-native";
import { Home, Code } from "lucide-react-native";

const THEME_COLOR = "#58CC02";
const INACTIVE_COLOR = "#94A3B8";

export default function TabLayout() {
  const getTabBarIcon = (Icon: any, focused: boolean) => (
    <View
      style={{
        alignItems: "center",
        justifyContent: "center",
        width: 50,
        height: 30,
        ...Platform.select({
          ios: {
            marginBottom: -5,
          },
          android: {
            marginBottom: 0,
          },
        }),
      }}
    >
      <Icon
        size={24}
        color={focused ? THEME_COLOR : INACTIVE_COLOR}
        strokeWidth={focused ? 2.5 : 2}
      />
    </View>
  );

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          height: Platform.OS === "ios" ? 85 : 65,
          backgroundColor: "#FFFFFF",
          borderTopWidth: 1,
          borderTopColor: "#E2E8F0",
          paddingTop: 8,
          paddingBottom: Platform.OS === "ios" ? 28 : 12,
          elevation: 0,
          shadowOpacity: 0,
        },
        tabBarActiveTintColor: THEME_COLOR,
        tabBarInactiveTintColor: INACTIVE_COLOR,
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "500",
          marginTop: -5,
        },
        tabBarIconStyle: {
          marginTop: 5,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ focused }) => getTabBarIcon(Home, focused),
          tabBarLabel: "Home",
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: "Explore",
          tabBarIcon: ({ focused }) => getTabBarIcon(Code, focused),
          tabBarLabel: "Explore",
        }}
      />
    </Tabs>
  );
}
