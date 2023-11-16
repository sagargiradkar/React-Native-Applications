import React, { useState, useEffect } from "react";
import Background from "../Components/Background";
import TopNav from "../Components/TopNav";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  useWindowDimensions,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTheme, useIsFocused } from "@react-navigation/native";
import HTML from "react-native-render-html";
import {
  ALERT_TYPE,
  AlertNotificationRoot,
  Toast,
} from "react-native-alert-notification";

export default function News(props) {
  const colors = useTheme().colors;
  const isFocused = useIsFocused();
  const [htmlContent, setHtmlContent] = useState("");
  const windowDimensions = useWindowDimensions();
  const renderersProps = {
    img: {
      enableExperimentalPercentWidth: true,
    },
  };

  const showErrorMessage = (message) => {
    Dialog.show({
      type: ALERT_TYPE.DANGER,
      title: "!! Warning !!",
      textBody: message,
      titleStyle: { color: "orange" },
      textBodyStyle: { fontWeight: "bold" },
      button: "Close",
    });
  };

  useEffect(() => {
    if (isFocused) {
      getNewsContent();
      // getImages();
    }
  }, [isFocused]);

  const getNewsContent = async () => {
    try {
      const authToken = await AsyncStorage.getItem("authToken");
      const myHeaders = new Headers();
      myHeaders.append("Authorization", authToken);

      const requestOptions = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow",
      };

      fetch(
        "http://192.168.143.131:8085/api/v1/contents/getContentTemplate/stringHtml",
        requestOptions
      )
        .then((response) => response.text())
        .then((result) => {
          setHtmlContent(result);
        })
        .catch((error) => {
          console.log("error", error),
            showErrorMessage("News Data Failure... Please Try Again.");
        });
    } catch (error) {
      console.log("Error:", error);
      showErrorMessage("Something Went Wrong. Please Try Again.");
    }
  };

  const profile = () => {
    props.navigation.navigate("Profile");
  };

  return (
    <Background>
      <TopNav onProfile={profile} />
      <ScrollView style={{ marginBottom: "17%" }}>
        <View style={styles(colors).MainImage}>
          <Image
            source={require("../../assets/news3.png")}
            style={{ resizeMode: "contain", height: 100, width: "55%" }}
          />
          <Image
            source={require("../../assets/Animated/4.gif")}
            style={{ resizeMode: "contain", height: 100, width: "50%" }}
          />
        </View>
        <View style={{ marginHorizontal: 20 }}>
          <HTML
            source={{ html: htmlContent }}
            contentWidth={windowDimensions.width}
            enableExperimentalMarginCollapsing={true}
            renderersProps={renderersProps}
            tagsStyles={{
              p: { color: colors.text, fontSize: 16, marginBottom: 10 },
              h1: { color: colors.text, fontSize: 26, fontWeight: "bold" },
              img: { width: "89%", height: "auto", marginBottom: 5 },
              table: {
                width: "100%",
                borderWidth: 2,
                borderRadius: 5,
                borderColor: "white",
                backgroundColor: "white",
                marginBottom: 20,
              },
              th: {
                padding: 8,
                textAlign: "left",
                border: "3px solid #ccc",
                backgroundColor: "#f2f2f2", // Add background color to table header cells
                fontWeight: "bold", // Add bold style to table header cells
              },
              td: {
                padding: 8,
                textAlign: "left",
                border: "3px solid #ccc",
              },
            }}
          />
        </View>
      </ScrollView>
    </Background>
  );
}
const styles = (colors) =>
  StyleSheet.create({
    MainImage: {
      flexDirection: "row",
      alignItems: "center",
      marginLeft: 10,
    },
  });
