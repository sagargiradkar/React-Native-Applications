import React, { useEffect, useRef, useState } from "react";
import { View, Text, StyleSheet, TextInput } from "react-native";
import Background from "../Components/Background";
import Btn from "../Components/Btn";
import { useTheme, useRoute } from "@react-navigation/native";
import {
  ALERT_TYPE,
  AlertNotificationRoot,
  Dialog,
} from "react-native-alert-notification";

const VerifyRegister = ({ navigation }) => {
  const f1 = useRef();
  const f2 = useRef();
  const f3 = useRef();
  const f4 = useRef();
  const f5 = useRef();
  const f6 = useRef();
  const [fv1, setFv1] = useState("");
  const [fv2, setFv2] = useState("");
  const [fv3, setFv3] = useState("");
  const [fv4, setFv4] = useState("");
  const [fv5, setFv5] = useState("");
  const [fv6, setFv6] = useState("");

  const route = useRoute();
  const { email, password } = route.params;
  console.log("Email:", email);
  console.log("Password:", password);
  const [otpError, setOtpError] = useState("");

  const logOTP = async () => {
    const otpValue = `${fv1}${fv2}${fv3}${fv4}${fv5}${fv6}`;
    console.log("OTP:", otpValue);
    console.log("Email:", email);

    const url = `http://192.168.143.131:8091/api/v1/otp/verify?otpCode=${otpValue}&emailId=${email}`;

    const requestOptions = {
      method: "POST",
      redirect: "follow",
    };

    fetch(url, requestOptions)
      .then((response) => {
        if (response.status === 200) {
          console.log("Result succsess verify otp");
          register();
        } else if (response.status === 400) {
          // Show OTP invalid error message
          setOtpError("OTP is invalid");
        }
        return response.text();
      })
      .then((result) => {
        console.log(result);
      })
      .catch((error) => {
        console.log("error", error);
        showErrorAlert("Something Went Wrong. Try Again.");
      });
  };

  const showSuccessAlert = () => {
    Dialog.show({
      type: ALERT_TYPE.SUCCESS,
      title: "SUCCESS",
      textBody: "User Successfully Created!",
      button: "Close",
      onHide: () => {
        navigation.navigate("Login");
      },
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
  const register = async () => {
    console.log(email, password);

    try {
      var myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      var raw = JSON.stringify({
        email: email,
        password: password,
      });

      var requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow",
      };

      const response = await fetch(
        "http://192.168.143.131:9005/api/v1/users",
        requestOptions
      );
      const result = await response
        .json()
        // .then((response) => response.text())
        .then((result) => console.log(result))
        .catch((error) => console.log("error", error));

      if (response.ok) {
        showSuccessAlert();
      } else {
        if (response.status === 400) {
          showErrorAlert("This Email is already taken");
        } else {
          showErrorAlert("Registration Failed... Please Try Again.");
        }
      }
    } catch (error) {
      console.error("Error during registration:", error);
      showErrorAlert("An error occurred during registration");
    }
  };

  const colors = useTheme().colors;

  return (
    <AlertNotificationRoot>
      <Background>
        <View style={styles(colors).view1}>
          <Text style={styles(colors).head}>
            Verify Your OTP For Registration.
          </Text>
        </View>

        <View style={styles(colors).view2}>
          <Text style={styles(colors).subhead}>Enter OTP</Text>
          <View style={styles(colors).otpView}>
            <TextInput
              ref={f1}
              style={[
                styles(colors).inputView,
                { borderColor: fv1.length == 1 ? "white" : "#292865" },
              ]}
              keyboardType="number-pad"
              maxLength={1}
              value={fv1}
              onChangeText={(txt) => {
                setFv1(txt);
                if (txt.length == 1) f2.current.focus();
                else if (txt.length == 0) f1.current.focus();
              }}
            />
            <TextInput
              ref={f2}
              style={[
                styles(colors).inputView,
                { borderColor: fv2.length == 1 ? "white" : "#292865" },
              ]}
              keyboardType="number-pad"
              maxLength={1}
              value={fv2}
              onChangeText={(txt) => {
                setFv2(txt);
                if (txt.length == 1) f3.current.focus();
                else if (txt.length == 0) f1.current.focus();
              }}
            />
            <TextInput
              ref={f3}
              style={[
                styles(colors).inputView,
                { borderColor: fv3.length == 1 ? "white" : "#292865" },
              ]}
              keyboardType="number-pad"
              maxLength={1}
              value={fv3}
              onChangeText={(txt) => {
                setFv3(txt);
                if (txt.length == 1) f4.current.focus();
                else if (txt.length == 0) f2.current.focus();
              }}
            />
            <TextInput
              ref={f4}
              style={[
                styles(colors).inputView,
                { borderColor: fv4.length === 1 ? "white" : "#292865" },
              ]}
              keyboardType="number-pad"
              maxLength={1}
              value={fv4}
              onChangeText={(txt) => {
                setFv4(txt);
                if (txt.length === 1) f5.current.focus();
                else if (txt.length === 0) f3.current.focus();
              }}
            />
            <TextInput
              ref={f5}
              style={[
                styles(colors).inputView,
                { borderColor: fv5.length === 1 ? "white" : "#292865" },
              ]}
              keyboardType="number-pad"
              maxLength={1}
              value={fv5}
              onChangeText={(txt) => {
                setFv5(txt);
                if (txt.length === 1) f6.current.focus();
                else if (txt.length === 0) f4.current.focus();
              }}
            />
            <TextInput
              ref={f6}
              style={[
                styles(colors).inputView,
                {
                  borderColor: fv6.length === 1 ? "white" : "#292865",
                },
              ]}
              keyboardType="number-pad"
              maxLength={1}
              value={fv6}
              onChangeText={(txt) => {
                setFv6(txt);
                if (txt.length === 0) f5.current.focus();
              }}
            />
          </View>
          {otpError !== "" && (
            <Text style={styles(colors).errorText}>{otpError}</Text>
          )}
          <View>
            <Btn
              disabled={
                fv1 !== "" &&
                fv2 !== "" &&
                fv3 !== "" &&
                fv4 !== "" &&
                fv5 !== "" &&
                fv6 !== ""
                  ? false
                  : true
              }
              bgColor={
                fv1 !== "" &&
                fv2 !== "" &&
                fv3 !== "" &&
                fv4 !== "" &&
                fv5 !== "" &&
                fv6 !== ""
                  ? colors.text
                  : "grey"
              }
              textColor={colors.themeColor}
              btnLabel="Enter"
              onPress={logOTP}
            />
          </View>
        </View>
      </Background>
    </AlertNotificationRoot>
  );
};

const styles = (colors) =>
  StyleSheet.create({
    view1: {
      marginTop: 100,
      marginBottom: 50,
      alignItems: "center",
    },
    head: {
      fontSize: 35,
      color: colors.text,
      fontWeight: "bold",
      textAlign: "center",
    },
    view2: {
      alignItems: "center",
    },
    subhead: {
      fontSize: 20,
      color: colors.text,
      marginBottom: 20,
      fontWeight: "600",
    },
    otpView: {
      flexDirection: "row",
      justifyContent: "space-evenly",
      width: "95%",
      marginBottom: 50,
    },
    inputView: {
      width: 45,
      height: 45,
      borderWidth: 0.5,
      borderRadius: 5,
      backgroundColor: "#292865",
      color: "white",
      textAlign: "center",
      fontSize: 20,
      fontWeight: "600",
    },
    errorText: {
      color: "red",
      fontSize: 16,
      fontWeight: "600",
      marginBottom: 20,
    },
  });

export default VerifyRegister;
