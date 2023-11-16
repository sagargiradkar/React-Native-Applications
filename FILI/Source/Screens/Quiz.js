import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import Background from "../Components/Background";
import { useTheme } from "@react-navigation/native";
import Question from "../Components/Question";
import TopNav from "../Components/TopNav";

const Quiz = ({ navigation }) => {
  const colors = useTheme().colors;

  const profile = () => {
    navigation.navigate("Profile");
  };
  return (
    <Background>
      <TopNav onProfile={profile} />
      <View style={styles(colors).container}>
        <View style={{ height: "95%" }}>
          <Question navigation={navigation} />
        </View>
      </View>
    </Background>
  );
};

const styles = (colors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      marginTop: "5%",
    },
  });

export default Quiz;
