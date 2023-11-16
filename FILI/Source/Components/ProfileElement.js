import React from "react";
import {
  View,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
} from "react-native";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import { useTheme } from "@react-navigation/native";

const ProfileElement = ({
  icon,
  text,
  logout,
  onPress = () => {},
  ...props
}) => {
  const colors = useTheme().colors;
  return (
    <View style={styles(colors).element}>
      <View style={styles(colors).start}>
        <FontAwesome5
          name={icon}
          size={30}
          color={
            colors.themeColor === "#FFFFFF"
              ? colors.text
              : "rgba(255, 255, 255, 0.7)"
          }
          style={styles(colors).elementIcon}
        />
        <TouchableOpacity onPress={onPress}>
          <Text style={styles(colors).elementTxt}>{text}</Text>
        </TouchableOpacity>
      </View>
      {!logout && (
        <TouchableOpacity onPress={onPress}>
          <FontAwesome5
            name="chevron-right"
            size={15}
            color={
              colors.themeColor === "#FFFFFF"
                ? colors.text
                : "rgba(255, 255, 255, 0.7)"
            }
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = (colors) =>
  StyleSheet.create({
    start: {
      flexDirection: "row",
      alignItems: "center",
    },
    element: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 15,
    },
    elementTxt: {
      color: colors.text,
      fontSize: 18,
      fontWeight: "700",
      marginLeft: 20,
    },
  });

export default ProfileElement;
