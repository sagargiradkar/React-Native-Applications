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
import { API_BASE_URL,OTP_EMAIL_ID_ENDPOINT } from "../Constant/ConstantApi";

const Otp = ({ navigation }) => {
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
  const { email } = route.params;
  const [otpError, setOtpError] = useState("");

  const showErrorAlert = (message) => {
    Dialog.show({
      type: ALERT_TYPE.DANGER,
      title: "ERROR",
      textBody: message,
      button: "Close",
    });
  };

  const logOTP = async () => {
    const otpValue = `${fv1}${fv2}${fv3}${fv4}${fv5}${fv6}`;
    console.log("OTP:", otpValue);
    console.log("Email:", email);
    // OTP ENDPOINT CALL 
    const url = `${API_BASE_URL}:8091/api/v1/otp/verify?otpCode=${otpValue}&emailId=${email}`;

    const requestOptions = {
      method: "POST",
      redirect: "follow",
    };

    fetch(url, requestOptions)
      .then((response) => {
        if (response.status === 200) {
          navigation.navigate("ResetPassword", { email: email }); // Navigate to the login page on success
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

  const colors = useTheme().colors;
  return (
    <AlertNotificationRoot>
      <Background>
        <View style={styles(colors).view1}>
          <Text style={styles(colors).head}>Forgot Password?</Text>
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
              // onKeyPress={({ nativeEvent }) => {
              //   if (nativeEvent.key === "Backspace" && fv1 === "") {
              //     f1.current.blur();
              //   }
              // }}
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
    head: { fontSize: 35, color: colors.text, fontWeight: "bold" },
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

export default Otp;
