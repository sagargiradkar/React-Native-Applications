import React, { useState, useEffect } from "react";
import {
  View,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  Linking,
} from "react-native";
import TopNav from "../Components/TopNav";
import ProfileElement from "../Components/ProfileElement";
import Icon from "react-native-vector-icons/Fontisto";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { EventRegister } from "react-native-event-listeners";
import { useTheme, useIsFocused } from "@react-navigation/native";
import { API_BASE_URL, USER_LOGOUT_ENDPOINT, USER_PROFILE_ENDPOIN } from "../Constant/ConstantApi";

const Profile = (props) => {
  const colors = useTheme().colors;
  const isFocused = useIsFocused();
  const [profileName, setProfileName] = useState("");
  const theme = useTheme().colors.themeColor;
  const [darkMode, setDarkMode] = React.useState(
    theme === "#FFFFFF" ? false : true
  );

  useEffect(() => {
    if (isFocused) {
      getUserProfile();
    }
  }, [isFocused]);

  const getUserProfile = async () => {
    try {
      const authToken = await AsyncStorage.getItem("authToken");
      const myHeaders = new Headers();
      myHeaders.append("Authorization", authToken);

      const requestOptions = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow",
      };

      const response = await fetch(
        `${API_BASE_URL}:${USER_PROFILE_ENDPOIN}`, // Update the URL to your endpoint
        requestOptions
      );

      if (response.ok) {
        const userData = await response.json(); // Parse the JSON response
        console.log("User Profile Data:", userData);

        // Set profileName based on userData.name
        const newProfileName = userData.name || "User";
        setProfileName(newProfileName);
        console.log("Profile Name:", newProfileName); // Log the profile name
      } else {
        console.log("Failed to fetch user profile data");
      }
    } catch (error) {
      console.log("Error:", error);
    }
  };

  const onBack = () => {
    props.navigation.navigate("HomeScreen");
  };
  const onToggle = () => {
    setDarkMode((prev) => (prev === true ? false : true));
    EventRegister.emit("changeThemeEvent", !darkMode);
  };
  const onProfile = () => {
    props.navigation.navigate("UserEditProfile");
  };
  const onInterest = () => {
    props.navigation.navigate("UserInterests");
  };
  const onStreak = () => {
    props.navigation.navigate("UserStreak");
  };
  const onLogOut = async () => {
    try {
      const authToken = await AsyncStorage.getItem("authToken");
      const myHeaders = new Headers();
      myHeaders.append("Authorization", authToken);

      const requestOptions = {
        method: "PUT",
        headers: myHeaders,
        redirect: "follow",
      };

      fetch(`${API_BASE_URL}:${USER_LOGOUT_ENDPOINT}`, requestOptions)
        .then(async (response) => {
          if (response.status === 200) {
            // Logout successful, navigate to the login page
            const responseData = await response.text();
            console.log("Logout successful. Response:", responseData);
            props.navigation.navigate("Login");
          } else {
            // Logout failed, log an error
            console.log("Logout failed. Status code: ", response.status);
          }
        })
        .catch((error) => console.log("Fetch error:", error));
    } catch (error) {
      console.log("Error:", error);
    }
  };

  return (
    <View style={styles(colors).container}>
      <TopNav profile={true} onBack={onBack}></TopNav>
      <View style={styles(colors).innercontainer}>
        <View style={styles(colors).firstView}>
          <View style={styles(colors).firstView1}>
            <Image
              source={require("../../assets/User_Logo.png")}
              style={styles(colors).logo}
            />
            <View style={{ width: "70%" }}>
              <Text style={styles(colors).firstView1Txt}>{profileName}</Text>
            </View>
          </View>
        </View>
        <View style={styles(colors).line}></View>
        <View>
          <ProfileElement
            icon="user-tie"
            text="Profile"
            onPress={onProfile}
          ></ProfileElement>
          <ProfileElement
            icon="gift"
            text="F.A.Q."
            onPress={() => {
              Linking.openURL("https://www.budgetalizer.com/");
            }}
          ></ProfileElement>
          <ProfileElement
            icon="bookmark"
            text="Interests"
            onPress={onInterest}
          ></ProfileElement>
          <ProfileElement
            icon="fire-alt"
            text="Thundering"
            onPress={onStreak}
          ></ProfileElement>
          <ProfileElement
            icon="sign-out-alt"
            text="Logout"
            logout={true}
            onPress={onLogOut}
          ></ProfileElement>
        </View>
        <View style={{ flexDirection: "row", justifyContent: "space-evenly" }}>
          <View style={styles(colors).social}>
            <Icon.Button
              name="facebook"
              backgroundColor="#3b5990"
              size={13}
              onPress={() => {
                Linking.openURL(
                  "https://www.instagram.com/budgetalizer/?igshid=NDk5N2NlZjQ%3D"
                );
              }}
            >
              <Text style={styles(colors).socialText}>Facebook</Text>
            </Icon.Button>
          </View>
          <View style={styles(colors).social}>
            <Icon.Button
              name="instagram"
              backgroundColor="#d62985"
              size={13}
              onPress={() => {
                Linking.openURL(
                  "https://www.instagram.com/budgetalizer/?igshid=NDk5N2NlZjQ%3D"
                );
              }}
            >
              <Text style={styles(colors).socialText}>Instagram</Text>
            </Icon.Button>
          </View>
          <View style={styles(colors).social}>
            <Icon.Button
              name="twitter"
              backgroundColor="#00acee"
              size={13}
              onPress={() => {
                Linking.openURL(
                  "https://x.com/budgetalizer?t=vOlOeKYNv7d3XH-Zwmc2hw&s=09"
                );
              }}
            >
              <Text style={styles(colors).socialText}>Twitter</Text>
            </Icon.Button>
          </View>
          <View style={styles(colors).social}>
            <Icon.Button
              name="linkedin"
              backgroundColor="#0072b1"
              size={13}
              onPress={() => {
                Linking.openURL(
                  "https://www.linkedin.com/company/budgetalizer/"
                );
              }}
            >
              <Text style={styles(colors).socialText}>LinkedIn</Text>
            </Icon.Button>
          </View>
        </View>
        <View style={styles(colors).lastView}>
          <View style={styles(colors).lastView1}>
            <Text style={styles(colors).lastTxt1}>Budgetalizer</Text>
            <Text style={styles(colors).lastTxt2}>DarkMode</Text>
          </View>
          <TouchableOpacity onPress={onToggle}>
            {darkMode === false ? (
              <Icon name="toggle-off" color={colors.text} size={40}></Icon>
            ) : (
              <Icon name="toggle-on" color="#29E55E" size={40}></Icon>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = (colors) =>
  StyleSheet.create({
    container: {
      position: "absolute",
      backgroundColor:
        colors.themeColor === "#FFFFFF" ? colors.themeColor : "#130B4D",
      width: "100%",
      height: "100%",
    },
    innercontainer: {
      marginLeft: 20,
      marginRight: 20,
      marginTop: 20,
    },
    firstView: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 20,
    },
    firstView1: {
      flexDirection: "row",
      alignItems: "center",
    },
    logo: {
      width: 60,
      height: 60,
      resizeMode: "contain",
      borderRadius: 15,
      marginRight: 15,
    },
    firstView1Txt: {
      color: colors.text,
      fontSize: 25,
      fontWeight: "bold",
    },
    line: {
      width: "100%",
      height: 2,
      backgroundColor: colors.text,
      marginBottom: 20,
    },
    lastView: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    lastView1: {
      flexDirection: "row",
    },
    lastTxt1: {
      color: "#F8D20A",
      fontSize: 20,
      fontWeight: "700",
      marginRight: 10,
    },
    lastTxt2: { color: colors.text, fontSize: 20 },
    social: { width: 75, marginBottom: 10 },
    socialText: { fontSize: 10, left: -7, color: "white", fontWeight: "bold" },
  });

export default Profile;
