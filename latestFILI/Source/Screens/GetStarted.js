import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Dimensions,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Background from "../Components/Background";
import { useTheme, useIsFocused } from "@react-navigation/native";
import {
  ALERT_TYPE,
  AlertNotificationRoot,
  Dialog,
} from "react-native-alert-notification";
import { API_BASE_URL, USER_PROFILE_ENDPOIN } from "../Constant/ConstantApi";

const GetStarted = (props) => {
  const colors = useTheme().colors;
  const isFocused = useIsFocused();
  const [userData, setUserData] = useState(null); // User profile data

  const showErrorAlert = (message) => {
    Dialog.show({
      type: ALERT_TYPE.DANGER,
      title: "ERROR",
      textBody: message,
      button: "Close",
    });
  };

  useEffect(() => {
    if (isFocused) {
      getUserProfile();
    }
  }, [isFocused]);

  const getUserProfile = async () => {
    try {
      const authToken = await AsyncStorage.getItem("authToken");
      const myHeaders = new Headers();
      myHeaders.append("Authorization", authToken);

      const requestOptions = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow",
      };

      const response = await fetch(
        `${API_BASE_URL}:${USER_PROFILE_ENDPOIN}`, // Update the URL to your endpoint
        requestOptions
      );

      if (response.ok) {
        const userData = await response.json(); // Parse the JSON response
        console.log("User Profile Data:", userData);
        setUserData(userData); // Set the user profile data in state
      } else {
        console.log("Failed to fetch user profile data");
        showErrorAlert("Failed to fetch user profile data");
      }
    } catch (error) {
      console.log("Error:", error);
      showErrorAlert("Something Went Wrong. Please Try Again.");
    }
  };

  return (
    <AlertNotificationRoot>
      <Background>
        <View style={styles(colors).conatiner}>
          <Text style={styles(colors).head1}>Financial Literacy is Power.</Text>
          <Text style={styles(colors).head2}>
            Let's start learning the basics of budgeting, so you can make smart
            financial decisions.
          </Text>
          <Image
            source={require("../../assets/coins.png")}
            style={styles(colors).img}
          />
          <TouchableOpacity
            onPress={() => {
              if (
                userData &&
                (userData.streakCommit === null ||
                  userData.streakCommit === undefined)
              ) {
                props.navigation.navigate("StreakCommit");
              } else {
                props.navigation.navigate("HomeScreen");
              }
            }}
            style={styles(colors).button}>
            <Text style={styles(colors).btntxt}>Get Started</Text>
          </TouchableOpacity>
        </View>
      </Background>
    </AlertNotificationRoot>
  );
};

const styles = (colors) =>
  StyleSheet.create({
    conatiner: {
      marginTop: "15%",
      alignItems: "center",
    },
    head1: {
      fontSize: 35,
      color: colors.text,
      fontWeight: "bold",
      textAlign: "center",
      marginBottom: 30,
    },
    head2: {
      fontSize: 18,
      color: colors.text,
      fontWeight: "bold",
      textAlign: "center",
      marginHorizontal: "7%",
    },
    img: { width: "70%", resizeMode: "contain", height: "46%", marginTop: 20 },
    button: {
      backgroundColor: colors.primary,
      borderRadius: 15,
      alignItems: "center",
      justifyContent: "center",
      width: "50%",
      height: 40,
      marginTop: Dimensions.get("window").height * 0.1,
    },
    btntxt: {
      color: "white",
      fontSize: 23,
      textAlign: "center",
      fontWeight: "bold",
    },
  });
export default GetStarted;
