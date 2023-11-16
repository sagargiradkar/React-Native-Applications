import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Keyboard,
  ScrollView,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { useTheme, useIsFocused } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ProfileField from "../Components/Profile_Field";
import { API_BASE_URL,USER_PROFILE_ENDPOIN } from "../Constant/ConstantApi";
const UserEditProfile = (props) => {
  const isFocused = useIsFocused();
  const [userData, setUserData] = useState(null); // User profile data
  const [inputs, setInputs] = useState({
    name: "",
    email: "",
    phone: "",
    familyType: "",
    pincode: "",
    totalMember: "",
  });
  const [errors, setErrors] = React.useState({});
  const [fields, setFields] = React.useState({
    name: 0,
    email: 0,
    phone: 0,
    familyType: 0,
    pincode: 0,
    totalMember: 0,
  });

  const [selectedRadio, setSelectedRadio] = React.useState(
    userData && userData.familyType ? userData.familyType : ""
  );

  const FamiltyTypes = [
    { id: 1, name: "Joint" },
    { id: 2, name: "Nuclear" },
    { id: 3, name: "Alone" },
  ];

  const colors = useTheme().colors;
  const theme = useTheme().colors.themeColor;
  const onBack = () => {
    props.navigation.navigate("Profile");
  };

  const validateName = () => {
    Keyboard.dismiss();
    if (!inputs.name) {
      handleError("Please enter name.", "name");
      return false;
    } else if (!inputs.name.match(/^[\s\S]{2,40}$/)) {
      handleError("Enter valid name.", "name");
      return false;
    }
    return true;
  };

  const validateEmail = () => {
    Keyboard.dismiss();
    if (!inputs.name) {
      handleError("Please enter email.", "email");
      return false;
    } else if (
      !inputs.email.match(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z0-9]*$/)
    ) {
      handleError("Enter valid email address.", "email");
      return false;
    }
    return true;
  };

  const validatePhone = () => {
    Keyboard.dismiss();
    if (!inputs.phone) {
      handleError("Please input phone number", "phone");
      return false;
    } else if (!inputs.phone.match(/^[6-9]\d{9}$/)) {
      handleError("Please input valid phone number", "phone");
      return false;
    }
    return true;
  };

  const validatePincode = () => {
    if (!inputs.pincode) {
      return true;
    } else if (!inputs.pincode.match(/^[1-9][0-9]{5}$/)) {
      handleError("Please input valid pincode", "pincode");
      return false;
    }
    return true;
  };

  const validateTotal = () => {
    if (!inputs.totalMember) {
      return true;
    } else if (!inputs.totalMember.match(/^[1-9][0-9]*$/)) {
      handleError("Enter valid number", "totalMember");
      return false;
    }
    return true;
  };

  const handleOnChange = (text, input) => {
    setInputs((prevState) => ({ ...prevState, [input]: text }));
    setFields((prevState) => ({ ...prevState, [input]: 1 }));
  };

  const handleError = (errorMessage, input) => {
    setErrors((prevState) => ({ ...prevState, [input]: errorMessage }));
  };
  const validate = async () => {
    Keyboard.dismiss();
    let valid = true;
    let validName = validateName();
    let validEmail = validateEmail();
    let validPhone = validatePhone();
    let validPincode = validatePincode();
    let validTotal = validateTotal();

    if (
      !(validName && validEmail && validPhone && validPincode && validTotal)
    ) {
      valid = false;
    }
    if (valid) {
      console.log(inputs);
      try {
        const authToken = await AsyncStorage.getItem("authToken");
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Authorization", authToken);

        const raw = JSON.stringify({
          name: inputs.name,
          email: userData.email,
          mobileNumber: inputs.phone,
          address: userData.address,
          pincode: inputs.pincode,
          totalMember: inputs.totalMember,
          familyType: inputs.familyType,
          language: userData.language,
          currency: userData.currency,
          tags: userData.tags,
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
          `${API_BASE_URL}:${USER_PROFILE_ENDPOIN}`, // Update the URL to your endpoint
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
        console.log("Error:", error);
      }
    }
  };

  const count = () => {
    let count = 0;
    // Define an array of field names that should be checked for "clicked" state
    const clickableFields = [
      "name",
      "email",
      "phone",
      "familyType",
      "pincode",
      "totalMember",
    ];
    for (let field of clickableFields) {
      // Check if the field has been clicked (state is 1) or has existing data
      if (fields[field] === 1 || inputs[field]) {
        count++;
      }
    }

    return count;
  };

  useEffect(() => {
    if (isFocused) {
      getUserProfile();
    }
  }, [isFocused]);

  useEffect(() => {
    if (userData) {
      // Update the inputs state with user data
      setInputs((prevInputs) => ({
        ...prevInputs,
        name: userData.name || "",
        email: userData.email || "",
        phone: userData.mobileNumber || "",
        familyType: userData.familyType || "",
        pincode: userData.pincode || "",
        totalMember: userData.totalMember || "",
      }));
    }
  }, [userData]);

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
        setUserData(userData); // Set the user profile data in state
      } else {
        console.log("Failed to fetch user profile data");
      }
    } catch (error) {
      console.log("Error:", error);
    }
  };

  return (
    <View style={styles(colors).container}>
      <View style={styles(colors).innercontainer}>
        <TouchableOpacity onPress={onBack}>
          <Icon name="arrow-back" color={colors.text} size={30} />
        </TouchableOpacity>
        <Text style={styles(colors).heading}>Edit Profile</Text>
        <View style={{ flex: 1 }}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <ProfileField
              label="Name"
              onChangeText={(text) => handleOnChange(text, "name")}
              error={errors.name}
              field={fields.name}
              onFocus={() => {
                handleError(null, "name");
              }}
              validateField={validateName}
              compulsory={true}
              value={inputs.name} // Pass the value from inputs
            />
            <ProfileField
              label="Email Address"
              onChangeText={(text) => handleOnChange(text, "email")}
              error={errors.email}
              field={fields.email}
              onFocus={() => {
                handleError(null, "email");
              }}
              validateField={validateEmail}
              compulsory={true}
              keyboardType="email-address"
              value={inputs.email} // Pass the value from inputs
              editable={!userData || !userData.email} // Disable editing if email is pre-filled
            />
            <ProfileField
              label="Phone Number"
              onChangeText={(text) => handleOnChange(text, "phone")}
              error={errors.phone}
              field={fields.phone}
              onFocus={() => {
                handleError(null, "phone");
              }}
              validateField={validatePhone}
              compulsory={true}
              keyboardType="numeric"
              value={inputs.phone} // Pass the value from inputs
            />

            <Text style={styles(colors).labelTxt}>Family Type</Text>
            <View style={styles(colors).options}>
              {FamiltyTypes.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => {
                    setSelectedRadio(item.name);
                    setInputs((prevState) => ({
                      ...prevState,
                      ["familyType"]: item.name,
                    }));
                    setFields((prevState) => ({
                      ...prevState,
                      ["familyType"]: 1,
                    }));
                  }}>
                  <View style={styles(colors).radio}>
                    <View style={styles(colors).radioIcon}>
                      {selectedRadio === item.name ||
                      inputs.familyType === item.name ? (
                        <View style={styles(colors).radioBg}></View>
                      ) : null}
                    </View>
                    <Text style={styles(colors).radioText}>{item.name}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
            <ProfileField
              label="Pincode"
              onChangeText={(text) => handleOnChange(text, "pincode")}
              error={errors.pincode}
              field={fields.pincode}
              onFocus={() => {
                handleError(null, "pincode");
              }}
              validateField={validatePincode}
              keyboardType="numeric"
              value={inputs.pincode} // Pass the value from inputs
            />
            <ProfileField
              label="Total members in family"
              onChangeText={(text) => handleOnChange(text, "totalMember")}
              error={errors.totalMember}
              field={fields.totalMember}
              onFocus={() => {
                handleError(null, "totalMember");
              }}
              validateField={validateTotal}
              keyboardType="numeric"
              value={inputs.totalMember} // Pass the value from inputs
            />

            <View style={styles(colors).complete}>
              <Text style={styles(colors).completeTxt}>Profile Complete</Text>
              <Text style={styles(colors).completeTxt1}>
                {Math.round((count() * 100) / 6)}%
              </Text>
            </View>
            <View
              style={[
                styles(colors).progressBar,
                {
                  width: `${(count() * 100) / 6}%`,
                  borderRadius: count() === 6 ? 20 : 0,
                },
              ]}></View>
            <TouchableOpacity onPress={validate}>
              <View style={styles(colors).button}>
                <Text style={styles(colors).buttonTxt}>Save</Text>
              </View>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </View>
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
      marginLeft: 20,
      marginRight: 20,
      marginTop: 20,
      flex: 1,
      marginBottom: 5,
    },
    heading: {
      color: colors.text,
      fontSize: 25,
      fontWeight: "700",
      marginBottom: 20,
      marginTop: 20,
    },

    labelTxt: { color: colors.text, fontSize: 15, fontWeight: "500" },
    options: {
      flexDirection: "row",
      marginTop: 10,
      justifyContent: "space-between",
      marginBottom: 20,
    },
    radio: {
      flexDirection: "row",
    },
    radioIcon: {
      height: 20,
      width: 20,
      borderColor: colors.text,
      borderWidth: 2,
      borderRadius: 10,
      marginRight: 8,
      justifyContent: "center",
      alignItems: "center",
    },
    radioBg: {
      backgroundColor: colors.text,
      height: 20,
      width: 20,
      borderRadius: 10,
    },
    radioText: {
      color: colors.text,
      fontSize: 15,
      fontWeight: "700",
    },

    complete: { flexDirection: "row", marginBottom: 5 },
    completeTxt: {
      color: colors.text,
      fontSize: 15,
      marginRight: 20,
      fontWeight: "600",
    },
    completeTxt1: {
      color: colors.text,
      fontSize: 15,
      fontWeight: "600",
    },
    progressBar: {
      backgroundColor: colors.text,
      height: 10,
      borderTopLeftRadius: 20,
      borderBottomLeftRadius: 20,
    },
    button: {
      backgroundColor: colors.text,
      width: "50%",
      height: 30,
      borderRadius: 20,
      marginTop: 20,
      alignItems: "center",
      justifyContent: "center",
      alignSelf: "center",
    },
    buttonTxt: {
      fontSize: 20,
      fontWeight: "bold",
      color: colors.themeColor === "#FFFFFF" ? "white" : "black",
    },
  });

export default UserEditProfile;
