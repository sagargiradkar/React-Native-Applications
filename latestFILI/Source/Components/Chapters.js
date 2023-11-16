import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
} from "react-native";
import { useTheme } from "@react-navigation/native";
import Background from "../Components/Background";
import Icon from "react-native-vector-icons/Ionicons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useIsFocused } from "@react-navigation/native";
import { useBackHandler } from "@react-native-community/hooks";
import { Audio } from "expo-av";
import {
  ALERT_TYPE,
  AlertNotificationRoot,
  Toast,
} from "react-native-alert-notification";
import { API_BASE_URL } from "../Constant/ConstantApi";

const ChaptersPage = (props) => {
  const colors = useTheme().colors;
  const [chapterData, setChapterData] = useState({
    title: "",
    content: "",
    description: "",
  });
  const [isPlaying, setIsPlaying] = useState(false);
  const [sound, setSound] = useState(null);
  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      fetchModulesFromBackend();
    }
  }, [isFocused]);

  useBackHandler(() => {
    stopAudio();
    props.navigation.navigate("HomeScreen");
    return true;
  });

  const fetchModulesFromBackend = async () => {
    const { ID } = props.route.params;
    console.log("Selected Module ID:", ID);

    const authToken = await AsyncStorage.getItem("authToken");

    const myHeaders = new Headers();
    myHeaders.append("Authorization", `${authToken}`);

    const requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };
    const url = `${API_BASE_URL}:8085/api/v1/usersModulesChapters/user/chapter/${ID}`;

    fetch(url, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        if (result && result.content) {
          setChapterData({
            title: result.title,
            content: result.content,
            description: result.description,
          });
          console.log({
            title: result.title,
            content: result.content,
            description: result.description,
          });
        }
      })
      .catch((error) => {
        console.log("error", error);
        showErrorMessage("Something Went Wrong. Please Try Again.");
      });
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

  const showModuleFinishedAlert = () => {
    Toast.show({
      type: ALERT_TYPE.SUCCESS,
      title: "Congratulations",
      textBody: "You have completed this module.",
      autoClose: 1000,
      titleStyle: { color: "green" },
      textBodyStyle: { fontWeight: "bold" },
      onHide: () => {
        props.navigation.navigate("HomeScreen");
      },
    });
  };

  const onNextOrPrevious = async (isNext) => {
    const { ID } = props.route.params;
    const authToken = await AsyncStorage.getItem("authToken");

    const myHeaders = new Headers();
    myHeaders.append("Authorization", `${authToken}`);

    const requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };
    const apiUrl = isNext
      ? `${API_BASE_URL}:8085/api/v1/usersModulesChapters/user/nextChapter/${ID}`
      : `${API_BASE_URL}:8085/api/v1/usersModulesChapters/user/previousChapter/${ID}`;

    try {
      const response = await fetch(apiUrl, requestOptions);
      const result = await response.json();

      if (result && result.content) {
        setChapterData({
          title: result.title,
          content: result.content,
          description: result.description,
        });
        console.log({
          title: result.title,
          content: result.content,
          description: result.description,
        });
        stopAudio();
      } else if (result && result.message === "FINISHED MODULE") {
        showModuleFinishedAlert();
      }
    } catch (error) {
      console.log(
        `Error fetching ${isNext ? "next" : "previous"} chapter:`,
        error
      );
      showErrorMessage("Something Went Wrong. Please Try Again.");
    }
  };

  const playAudio = async () => {
    try {
      const { sound } = await Audio.Sound.createAsync(
        require("../../assets/Audio/synthesis-2_6H6C7epm.mp3")
      );
      setSound(sound);
      await sound.playAsync();
      setIsPlaying(true);
    } catch (error) {
      console.log("Error playing audio:", error);
    }
  };
  // Function to stop audio
  const stopAudio = async () => {
    if (sound) {
      await sound.stopAsync();
      setIsPlaying(false);
    }
  };

  const onBack = () => {
    props.navigation.navigate("HomeScreen");
    stopAudio();
  };

  return (
    <AlertNotificationRoot>
      <Background>
        <View style={styles(colors).container}>
          <View style={styles(colors).arrow}>
            <TouchableOpacity onPress={onBack}>
              <Icon name="arrow-back" color={colors.text} size={30} />
            </TouchableOpacity>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Text style={styles(colors).chapterNo}>
                Chapter {chapterData.description}
              </Text>
              <View style={{ flex: 1, alignItems: "flex-end" }}>
                <TouchableOpacity onPress={isPlaying ? stopAudio : playAudio}>
                  <Image
                    source={require("../../assets/Sound_gif.gif")}
                    resizeMode="contain"
                    style={{ width: 50, height: 50, marginRight: 30 }}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>
          <View style={styles(colors).containerData}>
            <Text style={styles(colors).nameData}>{chapterData.title}</Text>
            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={styles(colors).contentData}>
                {chapterData.content}
              </Text>
            </ScrollView>
          </View>
        </View>
        <View style={styles(colors).end}>
          <TouchableOpacity
            style={styles(colors).button}
            onPress={() => onNextOrPrevious(false)}>
            <Text style={styles(colors).previous}>Previous</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles(colors).button}
            onPress={() => onNextOrPrevious(true)}>
            <Text style={styles(colors).next}>Next</Text>
          </TouchableOpacity>
        </View>
      </Background>
    </AlertNotificationRoot>
  );
};

const styles = (colors) =>
  StyleSheet.create({
    container: {
      flex: 0.96,
      marginTop: "5%",
    },
    containerData: {
      marginHorizontal: 20,
      height: "85%",
    },
    nameData: {
      color: colors.text,
      fontSize: 30,
      fontWeight: "500",
      marginBottom: 20,
      alignSelf: "center",
    },
    contentData: {
      color: colors.text,
      fontSize: 18,
      fontWeight: "300",
      textAlign: "justify",
    },
    arrow: {
      marginLeft: 30,
      marginBottom: 20,
    },
    chapterNo: {
      marginTop: 5,
      color: colors.text,
      fontSize: 30,
      fontWeight: "bold",
      alignSelf: "center",
      marginRight: 30,
    },
    end: {
      flexDirection: "row",
      justifyContent: "space-around",
      width: "100%",
      height: "5%",
    },
    button: {
      backgroundColor: colors.primary,
      borderRadius: 10,
      width: 100,
      justifyContent: "center",
    },
    previous: {
      color: "white",
      fontSize: 18,
      textAlign: "center",
    },
    next: {
      color: "white",
      fontSize: 18,
      textAlign: "center",
    },
  });

export default ChaptersPage;
