import React, { useState } from "react";
import { View, Text, Keyboard, StyleSheet, Image } from "react-native";
import Background from "../Components/Background";
import Field from "../Components/Field";
import Btn from "../Components/Btn";
import { passwordStrength } from "check-password-strength";
import { useTheme } from "@react-navigation/native";
import Loader from "../Components/Loader";
import {
  ALERT_TYPE,
  AlertNotificationRoot,
  Dialog,
} from "react-native-alert-notification";
import { API_BASE_URL, EMAIL_REGISTER_ENDPOINT } from "../Constant/ConstantApi";

const Register = ({ navigation }) => {
  const [inputs, setInputs] = React.useState({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = React.useState({});
  const [focusedInput, setFocusedInput] = useState(null);
  const [feilds, setFields] = React.useState({
    email: 0,
    password: 0,
    confirmPassword: 0,
  });
  const [isLoading, setIsLoading] = useState(false);
  const colors = useTheme().colors;

  const showSuccessAlert = () => {
    navigation.navigate("VerifyRegister", {
      email: inputs.email,
      password: inputs.password,
    });
  };

  const showErrorAlert = (message) => {
    Dialog.show({
      type: ALERT_TYPE.DANGER,
      title: "ERROR",
      textBody: message,
      button: "Close",
    });
  };

  const validateEmail = () => {
    Keyboard.dismiss();
    if (!inputs.email) {
      handleError("Please input an Email Address", "email");
      return false;
    } else if (!isValidEmail(inputs.email)) {
      handleError("Please input a valid Email Address", "email");
      return false;
    }
    return true;
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
    let validEmail = validateEmail();
    let validPassword = validatePassword();
    let validCPassword = validateCPassword();
    if (!(validEmail && validPassword && validCPassword)) {
      valid = false;
    }
    if (valid) {
      setIsLoading(true);
      register();
    }
    // {
    //   navigation.navigate("GetStarted");
    // }
  };

  const register = async () => {
    console.log("register!");
    console.log(inputs);

    try {
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      const raw = JSON.stringify({
        email: inputs.email,
      });

      const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow",
      };

      const response = await fetch(
        `${API_BASE_URL}:${EMAIL_REGISTER_ENDPOINT}`,
        requestOptions
      );
      const result = await response
        .json()
        .then((result) => console.log(result))
        .catch((error) => console.log("error", error));

      if (response.ok) {
        setIsLoading(true);
        showSuccessAlert();
      } else {
        if (response.status === 400) {
          showErrorAlert("Email Address is already taken");
        } else {
          showErrorAlert("Registration Failed");
        }
      }
    } catch (error) {
      console.log("Error during registration:", error);
      showErrorAlert("An error occurred during registration");
    } finally {
      setIsLoading(false); // Stop loading when navigation is complete or there's an error
    }
  };

  const handleOnChange = (text, input) => {
    setInputs((prevState) => ({ ...prevState, [input]: text }));
    setFields((prevState) => ({ ...prevState, [input]: 1 }));
  };
  const handleError = (errorMessage, input) => {
    setErrors((prevState) => ({ ...prevState, [input]: errorMessage }));
  };
  // Function to validate email format
  const isValidEmail = (email) => {
    // Regular expression for a valid email format
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return emailPattern.test(email);
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
          ]}
        ></View>
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
          ]}
        ></View>
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
          ]}
        ></View>
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
          ]}
        ></View>
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
          ]}
        ></View>
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
          ]}
        ></View>
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
          ]}
        ></View>
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
          ]}
        ></View>
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
          <View style={styles(colors).logoContainer}>
            <Image
              source={require("../../assets/User_Logo.png")}
              style={styles(colors).logo}
            />
          </View>
          <Text style={styles(colors).head}>Register Your Account</Text>
          <View style={styles(colors).fieldView1}>
            <Field
              placeholder="Enter Email-Address"
              keyboardType="email-address"
              onChangeText={(text) => handleOnChange(text, "email")}
              error={errors.email}
              field={feilds.email}
              onFocus={() => {
                handleError(null, "email");
              }}
              validateField={validateEmail}
              onSubmitEditing={validateEmail}
            />
          </View>
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
              btnLabel="Sign Up"
              onPress={validate}
            />
          </View>
        </View>
        <View style={{ flex: 1, top: -100 }}>
          {isLoading && <Loader visible={isLoading} />}
        </View>
      </Background>
    </AlertNotificationRoot>
  );
};

const styles = (colors) =>
  StyleSheet.create({
    container: {
      width: "100%",
      height: "100%",
      alignItems: "center",
      flex: 1,
    },
    logoContainer: {
      marginTop: "8%",
      backgroundColor: "#0c1a25", // Background color for the 3D effect
      borderRadius: 20, // Border radius for the 3D effect
      elevation: 10, // Shadow depth for the 3D effect
      height: "50%",
      width: "75%",
    },
    logo: {
      width: "90%",
      height: "90%",
      resizeMode: "contain",
      margin: 10,
      borderRadius: 20,
    },
    head: { fontSize: 25, color: colors.text, marginBottom: 10, marginTop: 10 },
    fieldView1: { width: "100%", alignItems: "center" },
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

export default Register;
