import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Text,
  Keyboard,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  Alert,
  Modal,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import Background from "../Components/Background";
import Btn from "../Components/Btn";
import { useTheme } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from 'axios';

const App = ({ navigation }) => {
  const [rememberMe, setRememberMe] = useState(false);
  const [inputs, setInputs] = React.useState({ email: "", password: "" });
  const colors = useTheme().colors;
  const [modalVisible, setModalVisible] = useState(false);
  const [modalContent, setModalContent] = useState("");

  useEffect(() => {
    loadSavedCredentials();
  }, []);

  const fetchData = async (url) => {
    try {
      console.warn("Fetching data...");
      console.warn(url);

      const response = await axios.get(url);

      console.warn(response);

      if (!response.status === 200) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      console.log("Setting modal content...");
      setModalContent(JSON.stringify(response.data));
      setModalVisible(true);
    } catch (error) {
      console.warn(error);
      console.error("Error fetching data:", error.message);
      Alert.alert("Error", "An error occurred while fetching data");
    }
  };

  const googleLogin = async () => {
    console.log("Attempting Google login...");
    await fetchData("https://www.google.com/");
  };

  const argyleLogin = async () => {
    console.log("Attempting Argyle login...");
    await fetchData("https://api.hibudgeting.com:9005/api/v1/hello");
  };

  return (
    <AlertNotificationRoot>
      <Background>
        <ScrollView>
      
            <View style={styles(colors).googleButtonContainer}>
              <TouchableOpacity
                style={styles(colors).googleButton}
                onPress={googleLogin}
              >
                <Text style={styles(colors).googleButtonText}>Google</Text>
              </TouchableOpacity>
            </View>
            <View style={styles(colors).googleButtonContainer}>
              <TouchableOpacity
                style={styles(colors).googleButton}
                onPress={argyleLogin}
              >
                <Text style={styles(colors).googleButtonText}>Argyle</Text>
              </TouchableOpacity>
            </View>
        </ScrollView>
      </Background>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles(colors).modalContainer}>
          <ScrollView style={{ flex: 1 }}>
            <View style={styles(colors).modalContent}>
              <Text style={styles(colors).modalText}>{modalContent}</Text>
              <TouchableOpacity
                style={styles(colors).modalCloseButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles(colors).modalCloseButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </Modal>
    </AlertNotificationRoot>
  );
};

const styles = (colors) =>
  StyleSheet.create({
    container: {
      height: Dimensions.get("window").height,
      alignItems: "center",
    },
    logo: {
      width: "30%",
      height: "30%",
      resizeMode: "contain",
    },
    heading: { fontSize: 38, color: colors.text, marginBottom: 30 },
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
    rememberMeContainer: {
      flexDirection: "row",
      alignItems: "left",
    },
    checkBox: {
      flexDirection: "row",
      alignItems: "left",
    },
    checkBoxText: {
      fontSize: 16,
      color: colors.text,
    },
    googleButtonContainer: {
      marginTop: 20,
    },
    googleButton: {
      backgroundColor: "#4285F4",
      paddingVertical: 10,
      paddingHorizontal: 20,
      borderRadius: 5,
    },
    googleButtonText: {
      color: "white",
      fontSize: 16,
      fontWeight: "bold",
    },
    modalContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    modalContent: {
      backgroundColor: "white",
      padding: 20,
      borderRadius: 10,
      elevation: 5,
    },
    modalText: {
      fontSize: 16,
    },
    modalCloseButton: {
      marginTop: 10,
      backgroundColor: "#4285F4",
      paddingVertical: 10,
      paddingHorizontal: 20,
      borderRadius: 5,
      alignSelf: "flex-end",
    },
    modalCloseButtonText: {
      color: "white",
      fontSize: 16,
      fontWeight: "bold",
    },
  });

export default App;
