import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Dimensions,
} from "react-native";
import Background from "../Components/Background";
import { useTheme } from "@react-navigation/native";
import TopNav from "../Components/TopNav";

const StartQuiz = (props) => {
  const colors = useTheme().colors;
  const profile = () => {
    props.navigation.navigate("Profile");
  };

  return (
    <Background>
      <TopNav onProfile={profile} />
      <View style={styles(colors).topLeftImageContainer}>
        <Image
          source={require("../../assets/Bot.png")}
          resizeMode="contain"
          style={styles(colors).topLeftImage}
        />
      </View>
      <View style={styles(colors).mainImage}>
        <Image
          source={require("../../assets/Quiz.png")}
          resizeMode="contain"
          style={styles(colors).topRightImage}
        />
      </View>
      <View style={styles(colors).button}>
        <TouchableOpacity
          onPress={() => {
            props.navigation.navigate("Quiz");
          }}>
          <Text style={styles(colors).buttonTxt}>START YOUR DAILY QUIZ</Text>
        </TouchableOpacity>
      </View>
    </Background>
  );
};

const styles = (colors) =>
  StyleSheet.create({
    mainImage: {
      alignSelf: "center",
      width: Dimensions.get("window").width,
      height: Dimensions.get("window").height * 0.4,
    },
    topLeftImageContainer: {
      position: "relative",
      top: 10,
    },
    topLeftImage: {
      width: 100,
      height: 100,
    },
    topRightImage: {
      width: "100%",
      height: "100%",
      alignSelf: "center",
    },
    button: {
      backgroundColor: "#4fbdfb",
      width: "60%",
      height: 80,
      borderRadius: 12,
      alignItems: "center",
      justifyContent: "center",
      alignSelf: "center",
    },
    buttonTxt: {
      fontSize: 25,
      fontWeight: "bold",
      color: "#141f25",
      letterSpacing: 2,
    },
  });

export default StartQuiz;
