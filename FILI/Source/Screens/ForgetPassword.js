import React, { useState } from "react";
import { View, Text, Keyboard, StyleSheet, Dimensions } from "react-native";
import Background from "../Components/Background";
import Field from "../Components/Field";
import Btn from "../Components/Btn";
import { useTheme } from "@react-navigation/native";
import Loader from "../Components/Loader";
import {
  ALERT_TYPE,
  AlertNotificationRoot,
  Dialog,
} from "react-native-alert-notification";

const { height } = Dimensions.get("window");

const ForgetPassword = ({ navigation }) => {
  const [inputs, setInputs] = useState({ email: "" });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
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
  const validate = () => {
    Keyboard.dismiss();
    let valid = true;
    let validEmail = validateEmail();
    if (!validEmail) {
      valid = false;
    }
    if (valid) {
      setIsLoading(true); // Start loading
      forgotPassword();
    }
  };

  const forgotPassword = async () => {
    console.log(inputs.email);

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

    try {
      const response = await fetch(
        "http://192.168.143.131:9005/api/v1/users/forgotPassword",
        requestOptions
      );
      if (response.status === 200) {
        setIsLoading(true); // Indicate loading when navigation is in progress
        navigation.navigate("Otp", { email: inputs.email });
      } else if (response.status === 400) {
        showErrorAlert("This Email-Address is not Registered.");
      } else {
        showErrorAlert("OTP Generation Failed... Please try again.");
        // Show an error message to the user
        console.log(
          "Server returned an error with status code:",
          response.status
        );
      }
    } catch (error) {
      console.log("Error:", error);
      showErrorAlert("Something Went Wrong. Try Again.");
    } finally {
      setIsLoading(false); // Stop loading when navigation is complete or there's an error
    }
  };

  const handleOnChange = (text, input) => {
    setInputs((prevState) => ({ ...prevState, [input]: text }));
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
        <View style={{ flex: 1 }}>
          <View style={styles(colors).firstcontainer}>
            <Text style={styles(colors).heading}>Forgot Password?</Text>
          </View>
          <View style={styles(colors).secondcontainer}>
            <Text style={styles(colors).subHead}>
              Enter Your Registered Email-Address.
            </Text>
            <Field
              placeholder="Your Registered Email-Address"
              keyboardType="email-address"
              onChangeText={(text) => handleOnChange(text, "email")}
              error={errors.email}
              onFocus={() => {
                handleError(null, "email");
              }}
              validateField={validateEmail}
              onSubmitEditing={validate}
            />
            <View style={styles(colors).button}>
              <Btn
                bgColor={colors.text}
                textColor={colors.themeColor}
                btnLabel="Submit"
                onPress={validate}
              />
            </View>
          </View>
        </View>
        <View style={{ flex: 1, top: -250 }}>
          {isLoading && <Loader visible={isLoading} />}
        </View>
      </Background>
    </AlertNotificationRoot>
  );
};

const styles = (colors) =>
  StyleSheet.create({
    firstcontainer: {
      marginTop: 100,
      marginBottom: 50,
      alignItems: "center",
    },
    heading: { fontSize: 35, color: colors.text, fontWeight: "bold" },
    secondcontainer: {
      width: "100%",
      alignItems: "center",
      marginBottom: 100,
    },
    subHead: {
      fontSize: 15,
      color: colors.text,
      fontWeight: "600",
      marginBottom: 20,
    },
    button: { width: 100, marginTop: 20 },
  });

export default ForgetPassword;
