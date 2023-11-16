import React from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
} from "react-native";
import { useTheme } from "@react-navigation/native";

const SearchBar = (props) => {
  const colors = useTheme().colors;
  return (
    <View>
      <View style={styles(colors).container}>
        <Image
          source={require("../../assets/icons/search.png")}
          style={styles(colors).icon}
        />
        <TextInput
          placeholderTextColor="#695F9B"
          autoCorrect={false}
          style={styles(colors).input}
          {...props}
        />
      </View>
    </View>
  );
};

const styles = (colors) =>
  StyleSheet.create({
    container: {
      alignItems: "center",
      justifyContent: "space-around",
      borderRadius: 15,
      backgroundColor: "#292865",
      borderWidth: 0,
      paddingHorizontal: 10,
      fontWeight: "bold",
      height: 35,
      flexDirection: "row",
      width: "80%",
      margin: 20,
      marginLeft: 40,
      marginRight: 40,
      paddingLeft: -10,
      elevation: 40,
      shadowColor: colors.shadowColor,
    },
    icon: { width: 15, height: 15, marginRight: -10 },
    input: { fontWeight: "400", width: "80%", fontSize: 15 },
  });

export default SearchBar;
