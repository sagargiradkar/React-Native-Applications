import React from "react";
import { View, Text, Keyboard, StyleSheet, Image } from "react-native";
import Background from "../Components/Background";
import Field from "../Components/Field";
import Btn from "../Components/Btn";
import { passwordStrength } from "check-password-strength";
import { useTheme, useRoute } from "@react-navigation/native";
import {
  ALERT_TYPE,
  AlertNotificationRoot,
  Dialog,
} from "react-native-alert-notification";

const ResetPassword = ({ navigation }) => {
  const [inputs, setInputs] = React.useState({
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = React.useState({});
  const [focusedInput, setFocusedInput] = React.useState(null);
  const [feilds, setFields] = React.useState({
    password: 0,
    confirmPassword: 0,
  });
  const colors = useTheme().colors;

  const showErrorAlert = (message) => {
    Dialog.show({
      type: ALERT_TYPE.DANGER,
      title: "ERROR",
      textBody: message,
      button: "Close",
    });
  };

  const validatePassword = () => {
    Keyboard.dismiss();
    if (!inputs.password) {
      handleError("Please Enter Password", "password");
      return false;
    } else if (inputs.password.length < 6) {
      handleError("Min Password Length of 6", "password");
      return false;
    } else if (
      !inputs.password.match(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#\$%\^&\*])(?=.{6,})/
      )
    ) {
      handleError(
        "Password should have at least one uppercase letter, one lowercase letter, one number and one special character",
        "password"
      );
      return false;
    }
    return true;
  };
  const validateCPassword = () => {
    if (!inputs.confirmPassword) {
      handleError("Please Confirm Password", "confirmPassword");
      return false;
    } else if (inputs.confirmPassword != inputs.password) {
      handleError("Password not same as above", "confirmPassword");
      return false;
    }
    return true;
  };
  const validate = () => {
    Keyboard.dismiss();
    let valid = true;
    let validPassword = validatePassword();
    let validCPassword = validateCPassword();
    if (!(validPassword && validCPassword)) {
      valid = false;
    }
    if (valid) register();
  };

  const route = useRoute();
  const { email } = route.params;
  const register = async () => {
    console.log("Password", inputs.password);
    console.log("Email:", email);

    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
      email: email,
      password: inputs.password,
    });

    const requestOptions = {
      method: "PUT",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    try {
      const response = await fetch(
        "http://192.168.143.131:9005/api/v1/users/resetPassword",
        requestOptions
      );
      if (response.status === 200) {
        // Show a success alert
        Dialog.show({
          type: ALERT_TYPE.SUCCESS,
          title: "Success",
          textBody: "Password Reset Successfully!",
          button: "Close",
          onHide: () => {
            // Navigate to the login screen after the alert is closed
            navigation.navigate("Login");
          },
        });
      } else {
        // Handle other response status codes or errors here
        console.log("Error:", response);
        showErrorAlert("Something Went Wrong. Try Again.");
      }
    } catch (error) {
      console.error("Error:", error);
      showErrorAlert("Something Went Wrong. Try Again.");
    }
  };

  const handleOnChange = (text, input) => {
    setInputs((prevState) => ({ ...prevState, [input]: text }));
    setFields((prevState) => ({ ...prevState, [input]: 1 }));
  };
  const handleError = (errorMessage, input) => {
    setErrors((prevState) => ({ ...prevState, [input]: errorMessage }));
  };

  const handleInputFocus = (input) => {
    setFocusedInput(input);
  };

  const passwordIndicatorView = (
    <>
      <View style={styles(colors).indicatorView}>
        <View
          style={[
            styles(colors).indicator,
            {
              backgroundColor:
                inputs.password == ""
                  ? "#D3D3D3"
                  : passwordStrength(inputs.password).value == "Too weak"
                  ? "red"
                  : passwordStrength(inputs.password).value == "Weak"
                  ? "yellow"
                  : passwordStrength(inputs.password).value == "Medium"
                  ? "#00D100"
                  : passwordStrength(inputs.password).value == "Strong"
                  ? "#007500"
                  : colors.themeColor === "#FFFFFF"
                  ? "#D3D3D3"
                  : "white",
            },
          ]}></View>
        <View
          style={[
            styles(colors).indicator,
            {
              backgroundColor:
                passwordStrength(inputs.password).value == "Weak"
                  ? "yellow"
                  : passwordStrength(inputs.password).value == "Medium"
                  ? "#00D100"
                  : passwordStrength(inputs.password).value == "Strong"
                  ? "#007500"
                  : colors.themeColor === "#FFFFFF"
                  ? "#D3D3D3"
                  : "white",
            },
          ]}></View>
        <View
          style={[
            styles(colors).indicator,
            {
              backgroundColor:
                passwordStrength(inputs.password).value == "Medium"
                  ? "#00D100"
                  : passwordStrength(inputs.password).value == "Strong"
                  ? "#007500"
                  : colors.themeColor === "#FFFFFF"
                  ? "#D3D3D3"
                  : "white",
            },
          ]}></View>
        <View
          style={[
            styles(colors).indicator,
            {
              backgroundColor:
                passwordStrength(inputs.password).value == "Strong"
                  ? "#007500"
                  : colors.themeColor === "#FFFFFF"
                  ? "#D3D3D3"
                  : "white",
            },
          ]}></View>
      </View>
      <View style={{ marginTop: 20 }}>
        <Text style={styles(colors).strength}>
          {inputs.password == ""
            ? ""
            : passwordStrength(inputs.password).value == "Too weak"
            ? "TOO WEAK"
            : passwordStrength(inputs.password).value == "Weak"
            ? "WEAK"
            : passwordStrength(inputs.password).value == "Medium"
            ? "GOOD"
            : passwordStrength(inputs.password).value == "Strong"
            ? "STRONG"
            : ""}
        </Text>
      </View>
    </>
  );

  const confirmPasswordIndicatorView = (
    <>
      <View style={styles(colors).indicatorView}>
        <View
          style={[
            styles(colors).indicator,
            {
              backgroundColor:
                inputs.confirmPassword == ""
                  ? "#D3D3D3"
                  : passwordStrength(inputs.confirmPassword).value == "Too weak"
                  ? "red"
                  : passwordStrength(inputs.confirmPassword).value == "Weak"
                  ? "yellow"
                  : passwordStrength(inputs.confirmPassword).value == "Medium"
                  ? "#00D100"
                  : passwordStrength(inputs.confirmPassword).value == "Strong"
                  ? "#007500"
                  : colors.themeColor === "#FFFFFF"
                  ? "#D3D3D3"
                  : "white",
            },
          ]}></View>
        <View
          style={[
            styles(colors).indicator,
            {
              backgroundColor:
                passwordStrength(inputs.confirmPassword).value == "Weak"
                  ? "yellow"
                  : passwordStrength(inputs.confirmPassword).value == "Medium"
                  ? "#00D100"
                  : passwordStrength(inputs.confirmPassword).value == "Strong"
                  ? "#007500"
                  : colors.themeColor === "#FFFFFF"
                  ? "#D3D3D3"
                  : "white",
            },
          ]}></View>
        <View
          style={[
            styles(colors).indicator,
            {
              backgroundColor:
                passwordStrength(inputs.confirmPassword).value == "Medium"
                  ? "#00D100"
                  : passwordStrength(inputs.confirmPassword).value == "Strong"
                  ? "#007500"
                  : colors.themeColor === "#FFFFFF"
                  ? "#D3D3D3"
                  : "white",
            },
          ]}></View>
        <View
          style={[
            styles(colors).indicator,
            {
              backgroundColor:
                passwordStrength(inputs.confirmPassword).value == "Strong"
                  ? "#007500"
                  : colors.themeColor === "#FFFFFF"
                  ? "#D3D3D3"
                  : "white",
            },
          ]}></View>
      </View>
      <View style={{ marginTop: 20 }}>
        <Text style={styles(colors).strength}>
          {inputs.confirmPassword == ""
            ? ""
            : passwordStrength(inputs.confirmPassword).value == "Too weak"
            ? "TOO WEAK"
            : passwordStrength(inputs.confirmPassword).value == "Weak"
            ? "WEAK"
            : passwordStrength(inputs.confirmPassword).value == "Medium"
            ? "GOOD"
            : passwordStrength(inputs.confirmPassword).value == "Strong"
            ? "STRONG"
            : ""}
        </Text>
      </View>
    </>
  );

  return (
    <AlertNotificationRoot>
      <Background>
        <View style={styles(colors).container}>
          <Image
            source={require("../../assets/logo.png")}
            style={styles(colors).logo}
          />
          <Text style={styles(colors).head}>Reset Your Password</Text>
          <View style={styles(colors).fieldView2}>
            <Field
              placeholder="Create Password"
              password={true}
              onChangeText={(text) => handleOnChange(text, "password")}
              error={errors.password}
              field={feilds.password}
              onFocus={() => {
                handleError(null, "password");
                handleInputFocus("password");
              }}
              validateField={validatePassword}
              onSubmitEditing={validatePassword}
            />
          </View>
          <View style={styles(colors).fieldView3}>
            <Field
              placeholder="Confirm Password"
              password={true}
              onChangeText={(text) => handleOnChange(text, "confirmPassword")}
              error={errors.confirmPassword}
              field={feilds.confirmPassword}
              onFocus={() => {
                handleError(null, "confirmPassword");
                handleInputFocus("confirmPassword");
              }}
              onSubmitEditing={validate}
            />
          </View>
          {focusedInput === "password" && passwordIndicatorView}
          {focusedInput === "confirmPassword" && confirmPasswordIndicatorView}
          {/* <View style={styles(colors).indicatorView}>
            <View
              style={[
                styles(colors).indicator,
                {
                  backgroundColor:
                    inputs.password == ""
                      ? "white"
                      : passwordStrength(inputs.password).value == "Too weak"
                      ? "red"
                      : passwordStrength(inputs.password).value == "Weak"
                      ? "yellow"
                      : passwordStrength(inputs.password).value == "Medium"
                      ? "#00D100"
                      : passwordStrength(inputs.password).value == "Strong"
                      ? "#007500"
                      : colors.themeColor === "#FFFFFF"
                      ? "#D3D3D3"
                      : "white",
                },
              ]}></View>
            <View
              style={[
                styles(colors).indicator,
                {
                  backgroundColor:
                    passwordStrength(inputs.password).value == "Weak"
                      ? "yellow"
                      : passwordStrength(inputs.password).value == "Medium"
                      ? "#00D100"
                      : passwordStrength(inputs.password).value == "Strong"
                      ? "#007500"
                      : colors.themeColor === "#FFFFFF"
                      ? "#D3D3D3"
                      : "white",
                },
              ]}></View>
            <View
              style={[
                styles(colors).indicator,
                {
                  backgroundColor:
                    passwordStrength(inputs.password).value == "Medium"
                      ? "#00D100"
                      : passwordStrength(inputs.password).value == "Strong"
                      ? "#007500"
                      : colors.themeColor === "#FFFFFF"
                      ? "#D3D3D3"
                      : "white",
                },
              ]}></View>
            <View
              style={[
                styles(colors).indicator,
                {
                  backgroundColor:
                    passwordStrength(inputs.password).value == "Strong"
                      ? "#007500"
                      : colors.themeColor === "#FFFFFF"
                      ? "#D3D3D3"
                      : "white",
                },
              ]}></View>
          </View>
          <View style={{ marginTop: 20 }}>
            <Text style={styles(colors).strength}>
              {inputs.password == ""
                ? ""
                : passwordStrength(inputs.password).value == "Too weak"
                ? "TOO WEAK"
                : passwordStrength(inputs.password).value == "Weak"
                ? "WEAK"
                : passwordStrength(inputs.password).value == "Medium"
                ? "GOOD"
                : passwordStrength(inputs.password).value == "Strong"
                ? "STRONG"
                : ""}
            </Text>
          </View> */}
          <View style={styles(colors).btn}>
            <Btn
              bgColor={colors.text}
              textColor={colors.themeColor}
              btnLabel="Reset"
              onPress={validate}
            />
          </View>
        </View>
      </Background>
    </AlertNotificationRoot>
  );
};

const styles = (colors) =>
  StyleSheet.create({
    container: {
      marginVertical: "15%",
      width: "100%",
      height: "100%",
      alignItems: "center",
    },
    logo: {
      width: "35%",
      height: "20%",
      resizeMode: "contain",
    },
    head: { fontSize: 25, color: colors.text, marginBottom: 20 },
    fieldView2: { width: "100%", alignItems: "center" },
    fieldView3: { width: "100%", alignItems: "center" },
    indicatorView: {
      flexDirection: "row",
      marginTop: 20,
    },
    indicator: {
      borderRadius: 15,
      width: 40,
      height: 8,
      marginRight: 10,
    },
    strength: {
      color: colors.text,
      fontSize: 15,
      fontWeight: "bold",
      marginLeft: 8,
    },
    btn: { marginTop: 40 },
  });

export default ResetPassword;
