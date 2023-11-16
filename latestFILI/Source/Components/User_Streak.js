import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import Background from "../Components/Background";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTheme, useIsFocused } from "@react-navigation/native";
import {
  ALERT_TYPE,
  AlertNotificationRoot,
  Toast,
} from "react-native-alert-notification";
import { API_BASE_URL, STREAK_COMMITS_ENDPOINT } from "../Constant/ConstantApi";

const UserStreak = (props) => {
  const colors = useTheme().colors;
  const isFocused = useIsFocused();

  const [selectedView, setSelectedView] = useState(""); // State for selected view
  const [streakData, setStreakData] = useState([]);
  const [isStreakSelected, setIsStreakSelected] = useState(false);
  const [selectedDayColor, setSelectedDayColor] = useState("gray"); // Default color
  const [selectedLevelColor, setSelectedLevelColor] = useState("gray"); // Default color
  const [selectedStreak, setSelectedStreak] = useState(null);
  const [userData, setUserData] = useState(null); // User profile data
  const [isDataLoaded, setIsDataLoaded] = useState(false); // State to track initial data loading

  const showToastMessage = (message) => {
    Toast.show({
      type: ALERT_TYPE.WARNING,
      title: "!! Warning !!",
      textBody: message,
      autoClose: 2000,
      titleStyle: { color: "orange" },
      textBodyStyle: { fontWeight: "bold" },
    });
  };

  const handleStreakSelect = (streakId) => {
    const selectedStreakIndex = streakData.findIndex(
      (streak) => streak.id === streakId
    );
    setSelectedView(streakId);
    setIsStreakSelected(true);

    // Define color pairs based on the index
    const colorPairs = [
      { dayColor: "orange", levelColor: "skyblue" },
      { dayColor: "yellow", levelColor: "green" },
      { dayColor: "green", levelColor: "yellow" },
      { dayColor: "skyblue", levelColor: "orange" },
    ];

    // Apply colors based on the index
    if (selectedStreakIndex >= 0 && selectedStreakIndex < colorPairs.length) {
      const selectedColors = colorPairs[selectedStreakIndex];
      setSelectedDayColor(selectedColors.dayColor);
      setSelectedLevelColor(selectedColors.levelColor);
    }
    // Set the selected streak data
    setSelectedStreak(streakData[selectedStreakIndex]);
  };

  const fetchData = async () => {
    try {
      const authToken = await AsyncStorage.getItem("authToken");
      const myHeaders = new Headers();
      myHeaders.append("Authorization", authToken);

      const requestOptions = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow",
      };

      const [streakResponse, userResponse] = await Promise.all([
        fetch(`${API_BASE_URL}:${STREAK_COMMITS_ENDPOINT}`, requestOptions),
        fetch(`${API_BASE_URL}:${USER_PROFILE_ENDPOIN}`, requestOptions),
      ]);

      if (streakResponse.ok && userResponse.ok) {
        const streakData = await streakResponse.json();
        const userData = await userResponse.json();

        console.log("Streak Data:", streakData);
        console.log("User Profile Data:", userData);

        setStreakData(streakData);
        setUserData(userData);

        if (streakData.length > 0 && userData) {
          const initialSelectedStreak = streakData.find(
            (streak) =>
              streak.streaksName === userData?.streakCommit?.streakCommitName
          );
          if (initialSelectedStreak) {
            handleStreakSelect(initialSelectedStreak.id);
          }
        }
      } else {
        console.log("Failed to fetch data");
        showToastMessage("Failed to fetch data");
      }
    } catch (error) {
      console.log("Error:", error);
      showToastMessage("Something Went Wrong. Try Again.");
    } finally {
      setIsDataLoaded(true);
    }
  };

  useEffect(() => {
    if (isFocused && !isDataLoaded) {
      fetchData();
    }
  }, [isFocused, isDataLoaded]);

  useEffect(() => {
    if (streakData.length > 0 && userData && !selectedStreak) {
      const initialSelectedStreak = streakData.find(
        (streak) =>
          streak.streaksName === userData?.streakCommit?.streakCommitName
      );
      if (initialSelectedStreak) {
        setSelectedStreak(initialSelectedStreak); // Set the selected streak
        handleStreakSelect(initialSelectedStreak.id); // Call handleStreakSelect to set colors
      }
    }
  }, [streakData, userData, selectedStreak]);

  const setProfile = async () => {
    try {
      const authToken = await AsyncStorage.getItem("authToken");
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      myHeaders.append("Authorization", authToken);

      const raw = JSON.stringify({
        name: userData.name,
        email: userData.email,
        mobileNumber: userData.mobileNumber,
        address: userData.address,
        pincode: userData.pincode,
        totalMember: userData.totalMember,
        familyType: userData.familyType,
        language: userData.language,
        currency: userData.currency,
        tags: userData.tags,
        streakCommit: {
          streakCommitName: selectedStreak.streaksName,
          completed: false,
        },
        occupation: userData.occupation,
      });

      const requestOptions = {
        method: "PUT",
        headers: myHeaders,
        body: raw,
        redirect: "follow",
      };

      const response = await fetch(
        `${API_BASE_URL}:${USER_PROFILE_ENDPOIN}`,
        requestOptions
      );

      if (response.ok) {
        const result = await response.text();
        console.log("Profile Updated:", result);
        props.navigation.navigate("Profile");
      } else {
        console.log("Failed to update profile");
        showToastMessage("Failed to update profile");
      }
    } catch (error) {
      console.log("Error:", error);
      showToastMessage("Something Went Wrong. Try Again.");
    }
  };

  return (
    <AlertNotificationRoot>
      <Background>
        <View style={styles(colors).container}>
          <Text style={styles(colors).subHead}>Commit To Daily Learning!</Text>
          <View style={styles(colors).box}>
            {streakData.map((streak) => (
              <TouchableOpacity
                key={streak.id}
                style={[
                  styles(colors).streakOption,
                  selectedView === streak.id && styles(colors).selectedView,
                ]}
                onPress={() => handleStreakSelect(streak.id)}>
                <Text
                  style={[
                    styles(colors).day,
                    {
                      color:
                        selectedView === streak.id
                          ? selectedDayColor // Apply selected day color
                          : isStreakSelected
                          ? "white"
                          : "gray",
                    },
                  ]}>
                  {streak.streaksName}
                </Text>
                <Text
                  style={[
                    styles(colors).level,
                    {
                      color:
                        selectedView === streak.id
                          ? selectedLevelColor // Apply selected level color
                          : isStreakSelected
                          ? "white"
                          : "gray",
                    },
                  ]}>
                  {streak.value}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          <View style={styles(colors).MainImage}>
            <Image
              source={require("../../assets/Streak.png")}
              style={{ resizeMode: "contain", height: 120, width: "30%" }}
            />
            <Image
              source={require("../../assets/commentBox.png")}
              style={{ resizeMode: "contain", height: 120, width: "50%" }}
            />
          </View>

          <TouchableOpacity
            onPress={() => {
              if (selectedStreak) {
                console.log("Selected Streak Data:", selectedStreak);
                setProfile();
              } else {
                console.log("Please select a streak first.");
                showToastMessage("Please Select a Streak First.");
              }
            }}
            style={[
              styles(colors).button,
              selectedView
                ? { backgroundColor: "#4fbdfb" }
                : { backgroundColor: "gray" },
            ]}>
            <Text style={styles(colors).buttonTxt}>SELECT STREAK GOAL</Text>
          </TouchableOpacity>
        </View>
      </Background>
    </AlertNotificationRoot>
  );
};

const styles = (colors) =>
  StyleSheet.create({
    container: {
      marginTop: "10%",
      marginHorizontal: 10,
    },
    subHead: {
      fontSize: 38,
      color: colors.text,
      fontWeight: "bold",
      textAlign: "center",
      letterSpacing: 1,
    },
    box: {
      width: "97%",
      borderWidth: 8,
      borderColor: "gray",
      borderRadius: 15,
      marginTop: 20,
      alignSelf: "center",
      backgroundColor: "#141f25",
    },
    day: {
      fontSize: 16,
      color: "white",
      fontWeight: "700",
      alignSelf: "center",
      marginLeft: 15,
    },
    level: {
      fontSize: 18,
      color: "white",
      fontWeight: "bold",
      alignSelf: "center",
      marginRight: 15,
    },
    button: {
      backgroundColor: colors.text,
      width: "80%",
      height: 50,
      borderRadius: 16,
      alignItems: "center",
      justifyContent: "center",
      alignSelf: "center",
    },
    buttonTxt: {
      fontSize: 20,
      fontWeight: "bold",
      color: colors.themeColor,
      letterSpacing: 1,
    },
    MainImage: {
      flexDirection: "row",
      alignItems: "center",
      alignSelf: "center",
      height: "25%",
    },
    streakOption: {
      width: "100%",
      height: 70,
      borderBottomWidth: 3,
      borderColor: "gray",
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingHorizontal: 10,
      backgroundColor: "#141f25",
      borderRadius: 15, // Add border radius to each option
    },
    selectedView: {
      borderWidth: 5,
      borderBottomWidth: 1,
      borderTopWidth: 1,
      borderRadius: 15, // Add border radius to the selected option
      borderColor: "skyblue",
    },
  });

export default UserStreak;
