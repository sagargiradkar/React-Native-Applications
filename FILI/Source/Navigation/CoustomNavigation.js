import React, { Profiler } from "react";

import { createNativeStackNavigator } from "@react-navigation/native-stack";

import Videos from "../Screens/Videos";
import StartQuiz from "../Screens/StartQuiz";
import Modules from "../Screens/Modules";
import News from "../Screens/News";
import Community from "../Screens/Community";

const Stack = createNativeStackNavigator();

const VideosScreen = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Videos" component={Videos} />
    </Stack.Navigator>
  );
};

export { VideosScreen };

const QuizScreen = () => {
    return (
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="StartQuiz" component={StartQuiz} />
      </Stack.Navigator>
    );
  };
  
  export { QuizScreen };

  const ModuleScreen = () => {
    return (
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Module" component={Modules} />
      </Stack.Navigator>
    );
  };
  
  export { ModuleScreen };

  const NewsScreen = () => {
    return (
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="News" component={News} />
      </Stack.Navigator>
    );
  };
  
  export { NewsScreen };

  const CommunityScreen = () => {
    return (
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Community" component={Community} />
      </Stack.Navigator>
    );
  };
  
  export { CommunityScreen };
