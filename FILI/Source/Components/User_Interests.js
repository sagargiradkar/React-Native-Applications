import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTheme, useIsFocused } from "@react-navigation/native";
import {
  ALERT_TYPE,
  AlertNotificationRoot,
  Toast,
} from "react-native-alert-notification";

const UserInterests = (props) => {
  const colors = useTheme().colors;
  const isFocused = useIsFocused();
  const [selected, setSelected] = useState([]);
  const [dataTags, setTagsData] = useState([]);
  const [userData, setUserData] = useState(null); // User profile data

  const onBack = () => {
    props.navigation.navigate("Profile");
  };

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

  useEffect(() => {
    if (isFocused) {
      setTagsIntrests();
      getUserProfile();
    }
  }, [isFocused]);

  const setTagsIntrests = async () => {
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
        "http://192.168.143.131:8085/api/v1/tagsAndIntrest",
        requestOptions
      );

      if (response.ok) {
        const result = await response.json();
        setTagsData(result);
        setSelected(new Array(result.length).fill(false));
      } else {
        console.log("Error fetching data");
        showToastMessage("Failed to fetch data");
      }
    } catch (error) {
      console.log("Error:", error);
      showToastMessage("Something Went Wrong. Try Again.");
    }
  };

  const onSelect = (index) => {
    setSelected((prevState) => {
      let newSelected = prevState.map((item, i) => {
        if (i === index) {
          item = !item;
        }
        return item;
      });
      return newSelected;
    });
  };

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
        "http://192.168.143.131:9005/api/v1/users/profile", // Update the URL to your endpoint
        requestOptions
      );

      if (response.ok) {
        const userData = await response.json(); // Parse the JSON response
        console.log("User Profile Data:", userData);
        setUserData(userData); // Set the user profile data in state
      } else {
        console.log("Failed to fetch user profile data");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const setTagsProfile = async () => {
    const payload = dataTags
      .filter((item, index) => selected[index])
      .map((item) => ({ id: item.id, value: item.value }));

    console.log("User Selected Interests:", payload);

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
        tags: payload,
        streakCommit: {
          streakCommitName: userData.streakCommit.streakCommitName,
          completed: userData.streakCommit.completed,
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
        "http://192.168.143.131:9005/api/v1/users/profile", // Update the URL to your endpoint
        requestOptions
      );

      if (response.ok) {
        const result = await response.text();
        console.log("Profile Updated:", result);
        // You can handle the success response as needed.
        props.navigation.navigate("Profile");
      } else {
        console.log("Failed to update profile");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <AlertNotificationRoot>
      <View style={styles(colors).container}>
        <View style={styles(colors).innercontainer}>
          <TouchableOpacity onPress={onBack}>
            <Icon name="arrow-back" color={colors.text} size={30} />
          </TouchableOpacity>
          <Text style={styles(colors).heading}>Select your interests :</Text>
          <View style={{ flex: 1, flexWrap: "wrap" }}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
                {dataTags.map((item, index) => (
                  <TouchableOpacity
                    key={item.id}
                    onPress={() => onSelect(index)}>
                    {!selected[index] ? (
                      <View style={styles(colors).optionBox1}>
                        <View style={styles(colors).option1}>
                          <View style={styles(colors).circle}></View>
                          <Text style={styles(colors).topic1}>
                            {item.value}
                          </Text>
                        </View>
                      </View>
                    ) : (
                      <View style={styles(colors).optionBox2}>
                        <View style={styles(colors).option1}>
                          <Icon
                            name="checkmark-circle"
                            size={18}
                            color={
                              colors.themeColor === "#FFFFFF"
                                ? colors.themeColor
                                : "black"
                            }
                          />
                          <Text style={styles(colors).topic2}>
                            {item.value}
                          </Text>
                        </View>
                      </View>
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
            <View style={styles(colors).button}>
              <TouchableOpacity onPress={setTagsProfile}>
                <Text style={styles(colors).buttonTxt}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </AlertNotificationRoot>
  );
};

const styles = (colors) =>
  StyleSheet.create({
    container: {
      backgroundColor:
        colors.themeColor === "#FFFFFF" ? colors.themeColor : "#130B4D",
      width: "100%",
      height: "100%",
    },
    innercontainer: {
      marginHorizontal: 20,
      marginTop: 20,
      flex: 1,
    },
    heading: {
      color: colors.text,
      fontSize: 25,
      fontWeight: "bold",
      marginBottom: 20,
      marginTop: 10,
    },
    optionBox1: {
      backgroundColor: colors.themeColor === "#FFFFFF" ? "white" : "black",
      borderWidth: 2,
      borderColor: colors.text,
      borderRadius: 10,
      padding: 8,
      marginBottom: 10,
      alignSelf: "flex-start",
      marginRight: 10,
    },
    option1: {
      flexDirection: "row",
      alignItems: "center",
    },
    circle: {
      width: 18,
      height: 18,
      borderRadius: 9,
      borderWidth: 2,
      borderColor: colors.text,
    },
    topic1: {
      color: colors.text,
      fontSize: 18,
      fontWeight: "700",
      marginLeft: 4,
    },
    optionBox2: {
      backgroundColor: colors.themeColor === "#FFFFFF" ? colors.text : "white",
      borderWidth: 1,
      borderColor: colors.text,
      borderRadius: 10,
      padding: 8,
      marginBottom: 10,
      alignSelf: "flex-start",
      marginRight: 10,
    },
    topic2: {
      color: colors.themeColor === "#FFFFFF" ? "white" : "black",
      fontSize: 18,
      fontWeight: "700",
      marginLeft: 4,
    },
    button: {
      height: 50,
      alignItems: "center",
      justifyContent: "center",
    },
    buttonTxt: {
      fontSize: 20,
      fontWeight: "bold",
      color: colors.themeColor === "#FFFFFF" ? "white" : "black",
      backgroundColor: colors.text,
      width: 150,
      height: 30,
      borderRadius: 10,
      textAlign: "center",
    },
  });

export default UserInterests;
