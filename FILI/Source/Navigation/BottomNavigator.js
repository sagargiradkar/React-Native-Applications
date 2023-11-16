import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {
  QuizScreen,
  ModuleScreen,
  VideosScreen,
  CommunityScreen,
  NewsScreen,
} from "./CoustomNavigation";

const Tab = createBottomTabNavigator();

const BottomNavigator = () => {
  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : -200} // Adjust as needed
    >
      <Tab.Navigator
        initialRouteName="Learning"
        screenOptions={{
          headerShown: false,
          tabBarStyle: styles.tabBar,
          tabBarShowLabel: false,
        }}>
        <Tab.Screen
          name="Learning"
          component={ModuleScreen}
          options={{
            tabBarIcon: ({ focused, tintColor }) => (
              <View style={[styles.iconContainer, {}]}>
                <Image
                  source={require("../../assets/Logos/reading.png")}
                  resizeMode="contain"
                  style={[
                    { width: focused ? 44 : 35 },
                    { height: focused ? 44 : 35 },
                  ]}
                />
                <Text
                  style={[styles.label, { color: focused ? "white" : "gray" }]}>
                  Learning
                </Text>
              </View>
            ),
          }}
        />
        <Tab.Screen
          name="QuizScreen"
          component={QuizScreen}
          options={{
            tabBarIcon: ({ focused, tintColor }) => (
              <View style={[styles.iconContainer, {}]}>
                <Image
                  source={require("../../assets/Logos/quiz.png")}
                  resizeMode="contain"
                  style={[
                    { width: focused ? 42 : 32 },
                    { height: focused ? 42 : 32 },
                  ]}
                />
                <Text
                  style={[styles.label, { color: focused ? "white" : "gray" }]}>
                  Quiz
                </Text>
              </View>
            ),
          }}
        />
        <Tab.Screen
          name="VideoScreen"
          component={VideosScreen}
          options={{
            tabBarIcon: ({ focused, tintColor }) => (
              <View style={[styles.iconContainer, {}]}>
                <Image
                  source={require("../../assets/Logos/video.png")}
                  resizeMode="contain"
                  style={[
                    { width: focused ? 40 : 32 },
                    { height: focused ? 40 : 32 },
                  ]}
                />
                <Text
                  style={[styles.label, { color: focused ? "white" : "gray" }]}>
                  Videos
                </Text>
              </View>
            ),
          }}
        />
        <Tab.Screen
          name="NewsScreen"
          component={NewsScreen}
          options={{
            tabBarIcon: ({ focused, tintColor }) => (
              <View style={[styles.iconContainer, {}]}>
                <Image
                  source={require("../../assets/Logos/world-news.png")}
                  resizeMode="contain"
                  style={[
                    { width: focused ? 42 : 33 },
                    { height: focused ? 42 : 33 },
                  ]}
                />
                <Text
                  style={[styles.label, { color: focused ? "white" : "gray" }]}>
                  News
                </Text>
              </View>
            ),
          }}
        />
        <Tab.Screen
          name="CommunityScreen"
          component={CommunityScreen}
          options={{
            tabBarIcon: ({ focused, tintColor }) => (
              <View style={[styles.iconContainer, {}]}>
                <Image
                  source={require("../../assets/Logos/group-chat_.png")}
                  resizeMode="contain"
                  style={[
                    { width: focused ? 45 : 38 },
                    { height: focused ? 45 : 38 },
                  ]}
                />
                <Text
                  style={[styles.label, { color: focused ? "white" : "gray" }]}>
                  Community
                </Text>
              </View>
            ),
          }}
        />
      </Tab.Navigator>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    position: "absolute",
    backgroundColor: "#292865",
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    height: 70,
    paddingBottom: "auto",
    paddingHorizontal: 12,
  },
  iconContainer: {
    alignItems: "center",
  },
  label: {
    fontSize: 12,
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default BottomNavigator;
