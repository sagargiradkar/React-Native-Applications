import React from "react";
import { TextInput, View, Text, StyleSheet } from "react-native";
import { useTheme } from "@react-navigation/native";

const ProfileField = ({
  label,
  error,
  onFocus = () => {},
  validateField = () => {},
  field,
  compulsory,
  value, // Pass the value directly as a prop
  ...props
}) => {
  const [isFocused, setisFocused] = React.useState(false);

  const colors = useTheme().colors;
  return (
    <View style={{ marginBottom: 30 }}>
      <View style={styles(error, colors).label}>
        <Text style={styles(error, colors).labelTxt}>{label}</Text>
        {compulsory && <Text style={styles(error, colors).labelTxt2}>*</Text>}
      </View>

      <View style={styles(error, colors).field}>
        <TextInput
          style={styles(error, colors).input}
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
          }}
          value={value} // Use the value prop here
          {...props}
        />
      </View>
      {error && <Text style={styles(error, colors).err}>* {error}</Text>}
    </View>
  );
};

const styles = (error, colors) =>
  StyleSheet.create({
    container: {
      marginBottom: 10,
      width: "100%",
      height: "100%",
    },
    field: {
      alignItems: "center",
      flexDirection: "row",
      borderColor: colors.text,
      borderBottomWidth: 2,
      width: "100%",
      fontWeight: "bold",
      marginTop: 5,
    },
    label: { flexDirection: "row" },
    labelTxt: { color: colors.text, fontSize: 15, fontWeight: "500" },
    labelTxt2: {
      color: "red",
      fontSize: 15,
      fontWeight: "500",
      marginLeft: 5,
    },
    input: { flex: 1, color: colors.text, fontSize: 18, marginBottom: 4 },

    icon: { fontSize: 22 },
    err: {
      color: colors.text,
      fontSize: 14,
      marginTop: 4,
      maxWidth: "75%",
      fontWeight: "bold",
    },
  });

export default ProfileField;
