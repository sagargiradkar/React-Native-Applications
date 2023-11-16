import React from "react";
import { TextInput, View, Text, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useTheme } from "@react-navigation/native";

const Field = ({
  password,
  error,
  onFocus = () => {},
  validateField = () => {},
  field,
  onSubmitEditing,
  ...props
}) => {
  const [isFocused, setisFocused] = React.useState(false);
  const [hidePassword, setHidePassword] = React.useState(password);
  const colors = useTheme().colors;
  return (
    <View style={{ height: 75 }}>
      <View style={styles(error, isFocused, colors).field}>
        <TextInput
          secureTextEntry={hidePassword}
          style={styles(error, isFocused, colors).input}
          placeholderTextColor="skyblue"
          autoCorrect={false}
          onFocus={() => {
            onFocus();
            setisFocused(true);
          }}
          onBlur={() => {
            if (field == 1) validateField();
            setisFocused(false);
          }}
          onSubmitEditing={() => {
            validateField();
            onSubmitEditing();
          }}
          {...props}
        />
        {password && (
          <Icon
            onPress={() => setHidePassword(!hidePassword)}
            name={hidePassword ? "eye-off-outline" : "eye-outline"}
            style={styles(error, isFocused, colors).icon}
            color={colors.themeColor}
          />
        )}
      </View>
      {error && (
        <Text style={styles(error, isFocused, colors).error}>* {error}</Text>
      )}
    </View>
  );
};

const styles = (error, isFocused, colors) =>
  StyleSheet.create({
    field: {
      alignItems: "center",
      flexDirection: "row",
      borderRadius: 15,
      borderColor: error ? "red" : isFocused ? colors.secondary : colors.text,
      backgroundColor: colors.text,
      borderWidth: 2,
      borderTopWidth: 4,
      width: "75%",
      paddingHorizontal: 10,
      fontWeight: "bold",
      height: 35,
      marginVertical: 10,
      fontSize: 13,
    },
    input: { flex: 1, color: colors.themeColor },
    icon: { fontSize: 22 },
    error: {
      color: colors.text,
      fontSize: 14,
      marginLeft: 4,
      maxWidth: "75%",
      fontWeight: "bold",
    },
  });

export default Field;
