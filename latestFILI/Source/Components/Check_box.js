import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { useTheme } from "@react-navigation/native";

const Checkbox = ({ checked, name, phone, ...props }) => {
  const colors = useTheme().colors;
  return (
    <View style={styles(colors).container}>
      <View style={styles(colors).view1}>
        <TouchableOpacity {...props}>
          <View style={styles(colors).box}>
            {checked && (
              <Icon name="md-checkmark-sharp" size={15} color={colors.text} />
            )}
          </View>
        </TouchableOpacity>
        <Text style={styles(colors).name}>{name}</Text>
      </View>
      <Text style={styles(colors).phone}>{phone}</Text>
    </View>
  );
};

const styles = (colors) =>
  StyleSheet.create({
    container: { marginBottom: 10 },
    box: {
      width: 20,
      height: 20,
      borderWidth: 2,
      borderColor: colors.text,
      marginRight: 10,
      alignItems: "center",
      justifyContent: "center",
    },
    view1: {
      marginLeft: 10,
      flexDirection: "row",
      alignItems: "center",
    },
    name: {
      color: colors.text,
      fontSize: 20,
      fontWeight: "500",
    },
    phone: {
      color: colors.text,
      fontSize: 20,
      fontWeight: "300",
      marginLeft: 40,
    },
  });
export default Checkbox;
