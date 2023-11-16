import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { API_BASE_URL,MODULE_SUMM_ENDPOINT } from "../Constant/ConstantApi";
import { useTheme } from "@react-navigation/native";
import { useIsFocused } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  ALERT_TYPE,
  AlertNotificationRoot,
  Dialog,
} from "react-native-alert-notification";

const Module = ({ onPress, updateModuleCounts }) => {
  const colors = useTheme().colors;
  const isFocused = useIsFocused();
  const [moduleData, setModuleData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

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
      fetchModulesFromBackend();
    }
  }, [isFocused]);

  const fetchModulesFromBackend = async () => {
    setIsLoading(true);
    const authToken = await AsyncStorage.getItem("authToken");

    const myHeaders = new Headers();
    myHeaders.append("Authorization", `${authToken}`);

    const requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };

    fetch(
      `${API_BASE_URL}:${MODULE_SUMM_ENDPOINT}`,
      requestOptions
    )
      .then((response) => response.json())
      .then((data) => {
        const userModuleSummary = data[0].userModuleSummary;
        const processedData = userModuleSummary.map((moduleObject) => {
          const { id, moduleTitle, numberOfChapters, completionPercentage } =
            moduleObject;
          return { id, moduleTitle, numberOfChapters, completionPercentage };
        });
        console.log("Total Modules:", data[0].totalModules);
        console.log("Total Completed Modules:", data[0].totalCompletedModules);
        updateModuleCounts(data[0].totalModules, data[0].totalCompletedModules);
        setModuleData(processedData);
        console.log(processedData);
        setIsLoading(false);
      })
      .catch((error) => {
        console.log("error", error);
        showErrorMessage("Something Went Wrong. Please Try Again.");
        setIsLoading(false);
      });
  };

  return (
    <>
      {isLoading ? ( // Check if isLoading is true
        <View style={styles(colors).loadingContainer}>
          <ActivityIndicator size="large" color="green" animating={true} />
          <Text style={styles(colors).loadingText}>Loading Modules...</Text>
        </View>
      ) : moduleData !== null ? (
        moduleData.map((moduleItem, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => onPress(moduleItem)}
            style={[
              styles(colors).container,
              moduleItem.completionPercentage === 100 &&
                styles(colors).completedModule,
            ]}>
            <Text style={styles(colors).heading}>{moduleItem.moduleTitle}</Text>
            <View style={styles(colors).line}></View>
            <View>
              <View style={styles(colors).view1}>
                <Text style={styles(colors).txt1}>
                  {moduleItem.numberOfChapters}
                </Text>
                <Text style={styles(colors).txt2}>Chapters</Text>
              </View>
              <View style={styles(colors).view2}>
                <Text
                  style={
                    styles(colors).txt1
                  }>{`${moduleItem.completionPercentage}%`}</Text>
                <Text style={styles(colors).txt2}>Completed</Text>
              </View>
            </View>
          </TouchableOpacity>
        ))
      ) : (
        <View style={styles(colors).loadingContainer}>
          <Text style={styles(colors).ErrorText}>
            Something Went Wrong , Please Try Again.
          </Text>
        </View>
      )}
    </>
  );
};

const styles = (colors) =>
  StyleSheet.create({
    container: {
      width: "48%",
      height: 200,
      borderColor: colors.text,
      borderWidth: 1,
      backgroundColor: colors.primary,
      borderRadius: 10,
      marginBottom: 50,
      padding: 10,
      elevation: 5,
      justifyContent: "space-between",
    },
    completedModule: {
      opacity: 0.5, // Adjust the opacity to make it slightly blurred
    },
    heading: {
      color: "white",
      fontSize: 19,
      fontWeight: "bold",
      textAlign: "justify",
    },
    ErrorText: {
      color: colors.text,
      fontSize: 22,
      fontWeight: "bold",
      textAlign: "center",
      marginTop: 30,
    },
    line: {
      width: "70%",
      height: 1,
      backgroundColor: colors.secondary,
      alignSelf: "center",
    },
    view1: {
      flexDirection: "row",
    },
    txt1: {
      color: "white",
      fontSize: 15,
      fontWeight: "600",
      marginRight: 5,
    },
    view2: {
      flexDirection: "row",
    },
    txt2: {
      color: "white",
      fontSize: 15,
      fontWeight: "400",
    },
    loadingContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    loadingText: {
      marginTop: 10,
      fontSize: 16,
      color: colors.text,
    },
  });

export default Module;
