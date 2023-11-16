import React, { useState } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  Image,
  Keyboard,
  ScrollView,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import { API_BASE_URL, LOGIN_ENDPOINT } from "../Constant/ConstantApi";
import Background from "../Components/Background";
import Btn from "../Components/Btn";
import Field from "../Components/Field";
import { useTheme } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  ALERT_TYPE,
  AlertNotificationRoot,
  Dialog,
} from "react-native-alert-notification";

const Login = ({ navigation }) => {
  const [inputs, setInputs] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [fields, setFields] = useState({ email: 0, password: 0 });
  const [isLoading, setIsLoading] = useState(false); // State to manage loading spinner
  const colors = useTheme().colors;

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

  const validate = async () => {
    Keyboard.dismiss();
    let valid = true;
    let validEmail = validateEmail();
    let validPassword = validatePassword();
    if (!(validEmail && validPassword)) {
      valid = false;
    }
    if (valid) {
      setIsLoading(true); // Start loading spinner
      login();
    }
  };

  const login = async () => {
    console.log("Login!");
    console.log(inputs);

    try {
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      const raw = JSON.stringify({
        username: inputs.email,
        password: inputs.password,
      });

      const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow",
      };

      const response = await fetch(
        `${API_BASE_URL}:${LOGIN_ENDPOINT}`,
        requestOptions
      );
      const result = await response.json();
      setIsLoading(false); // Stop loading spinner

      if (response.ok) {
        // Get the JWT token from headers
        const authToken = response.headers.get("Authorization");
        await AsyncStorage.setItem("authToken", authToken);
        // Successful login
        navigation.navigate("GetStarted");
        console.log("Login:", result);
      } else {
        // Error handling for different cases
        if (response.status === 401) {
          showErrorAlert("Email Address or Password is incorrect");
          console.log("Backend Result:", result);
        } else {
          showErrorAlert("Login Failed... Please Try Again.");
          console.log(result);
        }
      }
    } catch (error) {
      console.log("Error during login:", error);
      showErrorAlert("An error occurred during login");
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

  return (
    <AlertNotificationRoot>
      <Background>
        <ScrollView>
          <View style={styles(colors).container}>
            <View style={styles(colors).logoContainer}>
              <Image
                source={require("../../assets/User_Logo.png")}
                style={styles(colors).logo}
              />
            </View>
            <Text style={styles(colors).heading}>FILI</Text>
            <Text style={styles(colors).heading1}>FINANCIAL LITERACY APP</Text>
            <Field
              placeholder="Email-Address"
              keyboardType="email-address"
              onChangeText={(text) => handleOnChange(text, "email")}
              error={errors.email}
              field={fields.email}
              onFocus={() => {
                handleError(null, "email");
              }}
              validateField={validateEmail}
              onSubmitEditing={validateEmail}
            />
            <Field
              placeholder="Password"
              password={true}
              onChangeText={(text) => handleOnChange(text, "password")}
              error={errors.password}
              field={fields.password}
              onFocus={() => {
                handleError(null, "password");
              }}
              validateField={validatePassword}
              onSubmitEditing={validate}
            />
            <TouchableOpacity
              style={styles(colors).view1}
              onPress={() => navigation.navigate("ForgetPassword")}
            >
              <Text style={styles(colors).forget}>Forgot Password?</Text>
            </TouchableOpacity>
            <View style={styles(colors).view2}>
              {isLoading ? (
                <ActivityIndicator size={100} color="darkblue" />
              ) : (
                <>
                  <View style={styles(colors).btn}>
                    <Btn
                      bgColor={colors.text}
                      textColor={colors.themeColor}
                      btnLabel="Login"
                      onPress={validate}
                    />
                  </View>
                  <View style={styles(colors).orContainer}>
                    <Text style={styles(colors).startLine}>──────</Text>
                    <Text style={styles(colors).orTxt}>OR</Text>
                    <Text style={styles(colors).lastLine}>──────</Text>
                  </View>
                  <Btn
                    textColor={colors.text}
                    btnLabel="Register"
                    onPress={() => navigation.navigate("Register")}
                  />
                </>
              )}
            </View>
          </View>
        </ScrollView>
      </Background>
    </AlertNotificationRoot>
  );
};

const styles = (colors) =>
  StyleSheet.create({
    container: {
      height: Dimensions.get("window").height,
      alignItems: "center",
    },
    logoContainer: {
      marginTop: "8%",
      backgroundColor: "#0c1a25", // Background color for the 3D effect
      borderRadius: 20, // Border radius for the 3D effect
      elevation: 10, // Shadow depth for the 3D effect
      height: "25%",
      width: "70%",
    },
    logo: {
      width: "90%",
      height: "90%",
      resizeMode: "contain",
      margin: 10,
      borderRadius: 20,
    },
    heading: {
      fontSize: 40,
      color: colors.text,
      fontWeight: "bold",
      width: "100%",
      textAlign: "center",
    },
    heading1: {
      fontSize: 30,
      color: colors.text,
      marginBottom: 20,
      width: "100%",
      textAlign: "center",
    },
    view1: { alignItems: "flex-end", width: "78%", marginTop: 10 },
    forget: {
      color: colors.text,
      fontSize: 14,
      paddingRight: 10,
      fontWeight: "600",
    },
    view2: { alignItems: "center", marginTop: 40 },
    btn: { width: 100 },
    orContainer: { flexDirection: "row", alignItems: "center", padding: 10 },
    startLine: { color: colors.text, opacity: 0.5 },
    orTxt: {
      width: 30,
      textAlign: "center",
      color: colors.text,
      fontWeight: "600",
    },
    lastLine: { color: colors.text, opacity: 0.5 },
  });

export default Login;
