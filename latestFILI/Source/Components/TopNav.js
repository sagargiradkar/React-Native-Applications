import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTheme, useIsFocused } from "@react-navigation/native";
import { API_BASE_URL,USER_PROFILE_ENDPOIN } from "../Constant/ConstantApi";
const TopNav = ({
  onNotification = () => {},
  onProfile = () => {},
  onBack = () => {},
  profile,
  ...props
}) => {
  const colors = useTheme().colors;
  const isFocused = useIsFocused();
  const [profileName, setProfileName] = useState("");
  const [xp, setXP] = useState("");

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

        const xp = userData.experiencePoint;
        setXP(xp);
        console.log("Profile XP:", xp);
      } else {
        console.log("Failed to fetch user profile data");
        Alert.alert("Something Went Wrong", "Please Try Again.");
      }
    } catch (error) {
      console.log("Error:", error);
    }
  };

  return (
    <View
      style={[
        styles(colors).container,
        !profile && {
          elevation: 35,
          backgroundColor: colors.themeColor,
          shadowColor: colors.shadowColor,
          borderRadius: 10,
        },
      ]}>
      {profile && (
        <TouchableOpacity
          onPress={() => {
            onBack();
          }}>
          <Icon name="arrow-back" color={colors.text} size={30} />
        </TouchableOpacity>
      )}

      {!profile && (
        <View style={styles(colors).firstView}>
          <TouchableOpacity
            style={{ flexDirection: "row", alignItems: "center" }}
            onPress={() => {
              onProfile();
            }}>
            <Image
              source={require("../../assets/user/User-icon.png")}
              style={styles(colors).image}
            />
            <Text style={styles(colors).name}>{profileName}</Text>
          </TouchableOpacity>
          <Image
            source={require("../../assets/xp__2.png")}
            style={{ width: 30, height: 30, marginLeft: 10 }}
            resizeMode="contain"
          />
          <Text style={{ color: colors.text, fontSize: 16 }}>{xp}</Text>
        </View>
      )}

      <View style={styles(colors).secondView}>
        {/* <TouchableOpacity
          onPress={() => {
            onNotification();
          }}>
          <Icon name="notifications" size={25} color={colors.text} />
        </TouchableOpacity> */}
      </View>
    </View>
  );
};
const styles = (colors) =>
  StyleSheet.create({
    container: {
      flexDirection: "row",
      marginTop: "6%",
      alignItems: "center",
      justifyContent: "space-between",
      marginLeft: "5%",
      marginRight: "5%",
      borderColor: "#130B4D",
      padding: 10,
    },
    firstView: {
      flexDirection: "row",
      alignItems: "center",
      width: "100%",
    },
    name: {
      color: colors.text,
      fontSize: 16,
      textAlign: "left",
      marginRight: 10,
      marginLeft: 10,
    },
    usericon: { height: 10, width: 8, marginTop: 3 },
    secondView: {
      flexDirection: "row",
      width: "10%",
    },
    image: {
      width: 38,
      height: 35,
      resizeMode: "cover", // Adjust the image size within the container
    },
  });
export default TopNav;
