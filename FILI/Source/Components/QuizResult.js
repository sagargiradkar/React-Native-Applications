import React, { useEffect, useState } from "react";
import { View, StyleSheet, Text, TouchableOpacity, Image } from "react-native";
import { useTheme } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Background from "../Components/Background";
import {
  AlertNotificationRoot,
  ALERT_TYPE,
  Dialog,
} from "react-native-alert-notification";
import Checkbox from "./Check_box";

const API_URL = "http://192.168.143.131:8085/api/v1/quizzes/submit/";
const USER_API_URL = "http://192.168.143.131:9005/api/v1/users/updateAutoQuizPost";
const TOPIC_API_URL = "http://192.168.143.131:8086/api/v1/topics";

const QuizResult = ({ route, navigation }) => {
  const colors = useTheme().colors;
  const { quizId, selectedAnswers } = route.params;
  const [XP, setExperiencePoints] = useState("");
  const [Score, setPercentage] = useState("");
  const [Time, setTimeTaken] = useState("");
  const [autoQuizPost, setAutoQuizPost] = useState("");
  const [quizResultPost, setQuizResultPost] = useState("");
  const [isChecked, setChecked] = useState(false);

  const showErrorAlert = (message) => {
    Dialog.show({
      type: ALERT_TYPE.DANGER,
      title: "ERROR",
      textBody: message,
      button: "Close",
    });
  };

  const submitQuizAnswers = async () => {
    try {
      const authToken = await AsyncStorage.getItem("authToken");
      const answers = selectedAnswers;
      const requestOptions = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: authToken,
        },
        body: JSON.stringify({ answers }),
        redirect: "follow",
      };

      const response = await fetch(API_URL + quizId, requestOptions);

      if (response.ok) {
        const result = await response.json();
        setExperiencePoints(result.experiencePoints);
        setPercentage(result.percentage);
        setTimeTaken(result.timeTaken);
        setAutoQuizPost(result.autoQuizPost);
        setQuizResultPost(result.quizResultPost);
      } else {
        console.log("Failed to submit quiz answers.");
        showErrorAlert("Failed to submit quiz answers.");
      }
    } catch (error) {
      console.log("Error:", error);
      showErrorAlert("Something Went Wrong. Please Try Again.");
    }
  };

  const handleCheckboxToggle = async () => {
    setChecked(!isChecked);
    try {
      const authToken = await AsyncStorage.getItem("authToken");
      const requestOptions = {
        method: "PUT",
        headers: {
          Authorization: authToken,
        },
        redirect: "follow",
      };

      const response = await fetch(USER_API_URL, requestOptions);

      if (!response.ok) {
        console.log("Failed to update autoQuizPost.");
        showErrorAlert("Failed to update autoQuizPost. Please Try Again.");
      }
    } catch (error) {
      console.log("Error:", error);
      showErrorAlert("Something Went Wrong. Please Try Again.");
    }
  };

  const autoPosts = async () => {
    try {
      const authToken = await AsyncStorage.getItem("authToken");
      const requestOptions = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: authToken,
        },
        body: JSON.stringify({ description: quizResultPost }),
        redirect: "follow",
      };

      const response = await fetch(TOPIC_API_URL, requestOptions);

      if (response.ok) {
        console.log("Post successful");
        navigation.navigate("CommunityScreen");
      } else {
        console.log("Failed to post.");
        showErrorAlert("Post Failure... Please Try Again.");
      }
    } catch (error) {
      console.log("Error:", error);
      showErrorAlert("Something Went Wrong. Please Try Again.");
    }
  };

  useEffect(() => {
    submitQuizAnswers();
  }, []);

  useEffect(() => {
    setChecked(autoQuizPost);
  }, [autoQuizPost]);

  return (
    <AlertNotificationRoot>
      <Background>
        <View style={styles(colors).container}>
          <View style={styles(colors).topLeftImageContainer}>
            <Image
              source={require("../../assets/attention.png")}
              resizeMode="contain"
              style={styles(colors).topLeftImage}
            />
          </View>
          <View style={styles(colors).mainImage}>
            <View style={{ width: "1000%" }}>
              <Image
                source={require("../../assets/Play-Quizze.png")}
                resizeMode="contain"
                style={{ width: "100%", height: 180 }}
              />
            </View>
          </View>
          <Text style={styles(colors).heading}>Quiz Complete!</Text>
          <View style={styles(colors).top}>
            <View
              style={[styles(colors).outer, { backgroundColor: "#DAA520" }]}>
              <Text style={styles(colors).subhead}>Total XP</Text>
              <View style={styles(colors).inner}>
                <Image
                  source={require("../../assets/thunder_728139.png")}
                  style={styles(colors).image}
                />
                <Text style={[styles(colors).content, { color: "#DAA520" }]}>
                  {XP}
                </Text>
              </View>
            </View>
            <View
              style={[styles(colors).outer, { backgroundColor: "#4fbdfb" }]}>
              <Text style={styles(colors).subhead}>Time Taken</Text>
              <View style={styles(colors).inner}>
                <Image
                  source={require("../../assets/clock_2838590.png")}
                  style={styles(colors).image}
                />
                <Text style={[styles(colors).content, { color: "#4fbdfb" }]}>
                  {Time} sec
                </Text>
              </View>
            </View>
          </View>
          <View
            style={[
              styles(colors).outer,
              {
                backgroundColor: "#93d334",
                alignSelf: "center",
                marginBottom: "12%",
              },
            ]}>
            <Text style={styles(colors).subhead}>Score</Text>
            <View style={styles(colors).inner}>
              <Image
                source={require("../../assets/speedometer.png")}
                style={styles(colors).image}
              />
              <Text style={[styles(colors).content, { color: "#93d334" }]}>
                {Score}%
              </Text>
            </View>
          </View>
          <View
            style={{ flexDirection: "row", justifyContent: "space-around" }}>
            {!autoQuizPost && ( // Check if autoQuizPost is false
              <TouchableOpacity onPress={autoPosts}>
                <View
                  style={[
                    styles(colors).button,
                    { backgroundColor: "#4fbdfb" },
                  ]}>
                  <Text style={styles(colors).buttonTxt}>Share One Time</Text>
                </View>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              onPress={() => {
                navigation.navigate("Streak");
              }}>
              <View
                style={[styles(colors).button, { backgroundColor: "#4fbdfb" }]}>
                <Text style={styles(colors).buttonTxt}>CONTINUE</Text>
              </View>
            </TouchableOpacity>
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              marginTop: 10,
            }}>
            <Checkbox
              checked={isChecked}
              onPress={() => {
                setChecked(!isChecked);
                handleCheckboxToggle();
              }}
            />
            <Text style={{ color: colors.text }}>
              Remember My Choice For Future
            </Text>
          </View>
        </View>
      </Background>
    </AlertNotificationRoot>
  );
};

const styles = (colors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      top: "3%",
      marginHorizontal: 20,
    },
    topLeftImageContainer: {
      position: "absolute", // Position it absolutely within the container
      top: 0,
      left: 0,
    },
    topLeftImage: {
      width: 100, // Adjust the width of the image
      height: 100, // Adjust the height of the image
    },
    mainImage: {
      top: 65,
      height: 240,
      alignItems: "center",
      marginBottom: 10,
    },
    heading: {
      fontSize: 35,
      color: colors.text,
      textAlign: "center",
      fontWeight: "bold",
    },
    top: {
      flexDirection: "row",
      justifyContent: "space-around",
      marginTop: 30,
      marginBottom: 30,
    },
    outer: {
      padding: 4,
      borderRadius: 15,
      width: 120,
      justifyContent: "center",
      alignItems: "center",
    },
    inner: {
      backgroundColor: "#141f25",
      padding: 10,
      marginTop: 5,
      borderRadius: 15, // Rounded corners for the inner box
      justifyContent: "center", // Center vertically
      alignItems: "center", // Center horizontally
      width: 118,
      height: 70,
    },
    subhead: {
      fontSize: 20,
      fontWeight: "bold",
      color: "#141f25",
    },
    content: {
      fontSize: 20,
      fontWeight: "bold",
    },
    image: {
      width: 20,
      height: 20,
      resizeMode: "contain", // Adjust the image size within the container
      marginBottom: 5, // Add some spacing between the image and text
    },
    button: {
      width: 150,
      height: 50,
      borderRadius: 12,
      alignItems: "center",
      justifyContent: "center",
      alignSelf: "center",
    },
    buttonTxt: {
      fontSize: 20,
      fontWeight: "bold",
      color: "#141f25",
      letterSpacing: 2,
    },
  });

export default QuizResult;
