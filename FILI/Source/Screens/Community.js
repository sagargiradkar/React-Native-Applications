import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TextInput,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  ALERT_TYPE,
  AlertNotificationRoot,
  Dialog,
} from "react-native-alert-notification";
import Background from "../Components/Background";
import TopNav from "../Components/TopNav";
import Post from "../Components/Post";
import { useTheme } from "@react-navigation/native";

const Community = (props) => {
  const colors = useTheme().colors;
  const [modalVisible, setModalVisible] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [post, setPost] = useState("");
  const [postError, setPostError] = useState("");

  const profile = useCallback(() => {
    props.navigation.navigate("Profile");
  }, [props.navigation]);

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

  const setPosts = async () => {
    if (!post) {
      setPostError("Type Something First !!"); // Set the error message
      return; // Exit the function
    }
    setModalVisible(!modalVisible);
    try {
      const authToken = await AsyncStorage.getItem("authToken");
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      myHeaders.append("Authorization", authToken);

      const raw = JSON.stringify({
        description: post,
      });

      const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow",
      };

      const response = await fetch(
        "http://192.168.143.131:8086/api/v1/topics",
        requestOptions
      );

      if (response.ok) {
        const result = await response.text();
        console.log(result);
        setPost("");
        setRefreshKey((prevKey) => prevKey + 1);
      } else {
        console.log("error", error);
        showErrorMessage("Post Failure... Please Try Again.");
      }
    } catch (error) {
      console.log("Error:", error);
      showErrorMessage("Something Went Wrong. Please Try Again.");
    }
  };

  return (
    <AlertNotificationRoot>
      <Background>
        <TopNav onProfile={profile} />
        <View style={styles(colors).ScrollPostcontainer}>
          <Post key={refreshKey} />
        </View>
        <TouchableOpacity
          onPress={() => setModalVisible(true)}
          style={styles(colors).iconView}>
          <Icon
            name="add-circle"
            color={"#130B4D"}
            size={55}
            style={{ marginLeft: 1, marginTop: -1.5, marginRight: -1.5 }}
          />
        </TouchableOpacity>
        <Modal
          animationType="fade"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(!modalVisible);
            setPostError(""); // Clear the error message when closing the modal
            setPost("");
          }}>
          <View style={styles(colors).centeredView}>
            <View style={styles(colors).modalView}>
              <TextInput
                multiline={true}
                placeholder="Share your finance knowledge with others..."
                style={styles(colors).textInput}
                onChangeText={(text) => {
                  setPost(text);
                  setPostError("");
                }}
              />
              {postError ? (
                <Text style={styles(colors).errorText}>{postError}</Text>
              ) : null}
              <View style={styles(colors).endView}>
                <TouchableOpacity onPress={setPosts}>
                  <Text style={styles(colors).close}>Post</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </Background>
    </AlertNotificationRoot>
  );
};

const styles = (colors) =>
  StyleSheet.create({
    ScrollPostcontainer: {
      flex: 1,
      marginTop: 10,
      marginHorizontal: 20,
      marginBottom: "20%",
      position: "relative",
    },
    iconView: {
      position: "absolute",
      right: 15,
      bottom: 70,
      width: 55,
      height: 55,
      borderRadius: 30,
      backgroundColor: "#FFFFFF",
      justifyContent: "center",
      alignItems: "center",
      elevation: 4,
    },
    centeredView: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "rgba(0,0,0,0.5)",
    },
    modalView: {
      width: "80%",
      backgroundColor: "#EBEBFF",
      borderRadius: 10,
      justifyContent: "center",
      alignItems: "center",
      paddingVertical: 20,
    },
    textInput: {
      width: "90%",
      height: 400,
      backgroundColor: "white",
      borderRadius: 10,
      padding: 20,
      borderWidth: 2,
      borderColor: "#130B4D",
      marginBottom: 20,
      textAlignVertical: "top",
    },
    endView: {
      marginRight: 20,
      alignSelf: "flex-end",
    },
    close: {
      color: "#130B4D",
      fontSize: 18,
      fontWeight: "500",
    },
    errorText: {
      color: "red",
      fontSize: 14,
      marginTop: 5,
    },
  });

export default Community;
