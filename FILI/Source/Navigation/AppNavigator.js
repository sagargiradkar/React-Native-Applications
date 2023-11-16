import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StatusBar } from "react-native";
import { EventRegister } from "react-native-event-listeners";
import Colors from "../Components/Colors";

import Register from "../Screens/Register";
import VerifyRegister from "../Screens/VerifyRegister";
import Login from "../Screens/Login";
import ForgetPassword from "../Screens/ForgetPassword";
import Otp from "../Components/Otp";
import ResetPassword from "../Components/ResetPassword";
import GetStarted from "../Screens/GetStarted";
import BottomNavigator from "./BottomNavigator";
import Profile from "../Screens/Profile";
import UserEditProfile from "../Components/UserEditProfile";
import UserInterests from "../Components/User_Interests";
import ChaptersPage from "../Components/Chapters";
import Quiz from "../Screens/Quiz";
import QuizResult from "../Components/QuizResult";
import Streak from "../Components/Streak";
import Reward from "../Components/Reward";
import StreakCommit from "../Components/StreakCommit";
import Language from "../Screens/Language";
import UserStreak from "../Components/User_Streak";

const Stack = createNativeStackNavigator();

function App() {
  const [isDarkTheme, setIsDarkTheme] = React.useState(false);
  const appTheme = isDarkTheme ? Colors.dark : Colors.light;
  React.useEffect(() => {
    let eventListener = EventRegister.addEventListener(
      "changeThemeEvent",
      (data) => {
        setIsDarkTheme(data);
      }
    );
    return () => {
      EventRegister.removeEventListener(eventListener);
    };
  });
  return (
    <>
      <StatusBar hidden />
      {
        <NavigationContainer theme={appTheme}>
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="Register" component={Register} />
            <Stack.Screen name="VerifyRegister" component={VerifyRegister} />
            <Stack.Screen name="ForgetPassword" component={ForgetPassword} />
            <Stack.Screen name="Otp" component={Otp} />
            <Stack.Screen name="ResetPassword" component={ResetPassword} />
            <Stack.Screen name="GetStarted" component={GetStarted} />
            <Stack.Screen name="HomeScreen" component={BottomNavigator} />
            <Stack.Screen name="Profile" component={Profile} />
            <Stack.Screen name="UserEditProfile" component={UserEditProfile} />
            <Stack.Screen name="UserInterests" component={UserInterests} />
            <Stack.Screen name="ChaptersPage" component={ChaptersPage} />
            <Stack.Screen name="Quiz" component={Quiz} />
            <Stack.Screen name="QuizResult" component={QuizResult} />
            <Stack.Screen name="Streak" component={Streak} />
            <Stack.Screen name="Reward" component={Reward} />
            <Stack.Screen name="StreakCommit" component={StreakCommit} />
            <Stack.Screen name="UserStreak" component={UserStreak} />
            <Stack.Screen name="Language" component={Language} />
          </Stack.Navigator>
        </NavigationContainer>
      }
    </>
  );
}

export default App;
