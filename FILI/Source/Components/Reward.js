import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Dimensions,
} from "react-native";
import Background from "../Components/Background";
import { useTheme } from "@react-navigation/native";

const Reward = (props) => {
  const colors = useTheme().colors;

  return (
    <Background>
      <View style={styles(colors).centerContent}>
        <Image
          source={require("../../assets/gift-export.gif")}
          style={styles(colors).image}
        />
      </View>
      <View style={styles(colors).conatiner}>
        <Text style={styles(colors).subHead}>
          You Unlocked Your First Achievement !
        </Text>
        <Text style={styles(colors).desc}>
          Claim reward and see all your achievements by visiting your profile.
        </Text>
        <TouchableOpacity
          onPress={() => {
            props.navigation.navigate("HomeScreen");
          }}>
          <View style={styles(colors).button}>
            <Text style={styles(colors).buttonTxt}>Claim Reward</Text>
          </View>
        </TouchableOpacity>
      </View>
    </Background>
  );
};

const styles = (colors) =>
  StyleSheet.create({
    conatiner: {
      top: "8%",
      marginHorizontal: 10,
    },
    centerContent: {
      top: "8%",
      justifyContent: "space-between",
      alignItems: "center",
    },
    image: {
      width: 250,
      height: 200,
      resizeMode: "contain",
    },
    subHead: {
      fontSize: 42,
      color: colors.text,
      fontWeight: "bold",
      marginBottom: 20,
      marginTop: 10,
      textAlign: "center",
    },
    desc: {
      marginTop: 20,
      fontSize: 20,
      color: colors.text,
      fontWeight: "400",
      alignSelf: "center",
      textAlign: "center",
      marginBottom: 50,
    },
    button: {
      backgroundColor: "#3ae627",
      width: 180,
      height: 35,
      borderRadius: 10,
      alignItems: "center",
      justifyContent: "center",
      alignSelf: "center",
    },
    buttonTxt: {
      fontSize: 20,
      fontWeight: "bold",
      color: colors.themeColor,
    },
  });
export default Reward;
