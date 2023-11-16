import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import Background from "../Components/Background";
import { useTheme, useIsFocused } from "@react-navigation/native";
import Icon from "react-native-vector-icons/Ionicons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  AlertNotificationRoot,
  ALERT_TYPE,
  Dialog,
} from "react-native-alert-notification";
import { API_BASE_URL, STREAK_DAILY_POINT_ENDPOINT } from "../Constant/ConstantApi";

const Streak = (props) => {
  const colors = useTheme().colors;
  const isFocused = useIsFocused();
  const [streakData, setStreakData] = useState(null);

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
      fetchStreak();
    }
  }, [isFocused]);

  const fetchStreak = async () => {
    try {
      const authToken = await AsyncStorage.getItem("authToken");
      const myHeaders = new Headers({
        Authorization: authToken,
      });

      const requestOptions = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow",
      };

      const response = await fetch(
        `${API_BASE_URL}:${STREAK_DAILY_POINT_ENDPOINT}`,
        requestOptions
      );

      if (response.ok) {
        const data = await response.json();
        setStreakData(data);
        console.log("Streak Data:", data);
      } else {
        console.log("Error fetching streak data");
        showErrorAlert("Error fetching streak data");
      }
    } catch (error) {
      console.log("Error:", error);
      showErrorAlert("Something Went Wrong. Please Try Again.");
    }
  };
  const apiData = streakData?.[0] || {};
  const { monthName, streakPoint, streakDays } = apiData;
  console.log("StreakDays:", streakDays);

  return (
    <AlertNotificationRoot>
      <Background>
        <View style={styles(colors).centerContent}>
          <Image
            source={require("../../assets/fire.png")}
            style={styles(colors).image}
          />
          <Text style={styles(colors).heading}>{streakPoint}</Text>
        </View>
        <View style={styles(colors).container}>
          <Text style={styles(colors).subHead}>Day Streak!</Text>
          <View style={styles(colors).streak}>
            <View style={styles(colors).row}>
              {streakDays?.map((item, index) => (
                <View style={styles(colors).col} key={index}>
                  <Text
                    style={[
                      styles(colors).day,
                      { color: item.streakPoints > 0 ? "white" : "gray" },
                    ]}>
                    {item.dayName}
                  </Text>
                  <View
                    style={[
                      styles(colors).circle,
                      item.streakPoints > 0
                        ? styles(colors).filledCircle
                        : null,
                    ]}>
                    {item.streakPoints > 0 && (
                      <Icon name="checkmark" size={22} color="#141f25" />
                    )}
                  </View>
                </View>
              ))}
            </View>
            <View style={styles(colors).line}></View>
            <Text style={styles(colors).desc}>
              But your streak will break if you don’t practice tomorrow. Watch
              out!
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => {
              props.navigation.navigate("Reward");
            }}>
            <View style={styles(colors).button}>
              <Text style={styles(colors).buttonTxt}>CONTINUE</Text>
            </View>
          </TouchableOpacity>
        </View>
      </Background>
    </AlertNotificationRoot>
  );
};

const styles = (colors) =>
  StyleSheet.create({
    container: {
      marginTop: "26%",
      marginHorizontal: 20,
      alignItems: "center",
    },
    centerContent: {
      top: "6%",
      justifyContent: "center",
      alignItems: "center",
    },
    heading: {
      fontSize: 90,
      color: colors.text,
      fontWeight: "bold",
      textShadowColor: colors,
      textShadowOffset: { width: 8, height: -8 },
      textShadowRadius: 5,
      position: "absolute",
      top: 85,
      width: "50%",
      textAlign: "center",
    },
    subHead: {
      fontSize: 40,
      color: colors.text,
      fontWeight: "bold",
    },
    line: {
      width: "100%",
      height: 2,
      backgroundColor: "white",
      top: 40,
    },
    streak: {
      width: "100%",
      height: 220,
      backgroundColor: "#141f25",
      alignSelf: "center",
      borderRadius: 15,
      marginTop: 20,
      borderWidth: 4,
      borderColor: "#fe9600",
    },
    row: {
      top: 20,
      flexDirection: "row",
      justifyContent: "space-around",
      width: "100%",
      alignSelf: "center",
    },
    col: {
      alignItems: "center",
    },
    day: {
      fontSize: 20,
      fontWeight: "700",
      marginBottom: 5,
    },
    filledCircle: {
      width: 28,
      height: 28,
      borderRadius: 15,
      backgroundColor: "#ffaa33",
      borderColor: "#609FFF",
      borderWidth: 2,
      marginBottom: 5,
      alignSelf: "center",
    },
    circle: {
      width: 28,
      height: 28,
      borderRadius: 14,
      borderColor: "#609FFF",
      borderWidth: 2,
      marginBottom: 5,
      alignSelf: "center",
    },
    desc: {
      marginTop: 55,
      marginLeft: 10,
      marginRight: 10,
      fontSize: 20,
      color: "white",
      fontWeight: "700",
      textAlign: "center",
    },
    button: {
      backgroundColor: "#49c0f8",
      width: 160,
      height: 40,
      borderRadius: 12,
      marginTop: 40,
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
    image: {
      width: 150,
      height: 150,
      resizeMode: "contain",
      left: 15,
    },
  });

export default Streak;
