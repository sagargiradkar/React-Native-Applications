import React from "react";
import { View, StyleSheet } from "react-native";
import { useTheme } from "@react-navigation/native";

const Background = ({ children }) => {
  const colors = useTheme().colors;
  return <View style={styles(colors).container}>{children}</View>;
};

const styles = (colors) =>
  StyleSheet.create({
    container: {
      position: "absolute",
      backgroundColor: colors.themeColor,
      width: "100%",
      height: "100%",
    },
  });

export default Background;
