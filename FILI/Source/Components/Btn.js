import { Text, TouchableOpacity, StyleSheet } from "react-native";
import React from "react";

export default function Btn({
  bgColor,
  btnLabel,
  textColor,
  onPress = () => {},
  ...props
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={styles(bgColor, textColor).container}
      {...props}>
      <Text style={styles(bgColor, textColor).text}>{btnLabel}</Text>
    </TouchableOpacity>
  );
}

const styles = (bgColor, textColor) =>
  StyleSheet.create({
    container: {
      backgroundColor: bgColor,
      borderRadius: 80,
      width: 100,
      height: 30,
      justifyContent: "center",
    },
    text: {
      color: textColor,
      fontSize: 18,
      textAlign: "center",
      fontWeight: "500",
    },
  });
