import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import Background from "../Components/Background";
import { useTheme } from "@react-navigation/native";
import Module from "../Components/Module";
import TopNav from "../Components/TopNav";
import CircularProgress from "react-native-circular-progress-indicator";

const Modules = (props) => {
  const profile = () => {
    props.navigation.navigate("Profile");
  };
  const onPressModule = (moduleData) => {
    props.navigation.navigate("ChaptersPage", {
      ID: moduleData.id,
    });
  };
  const colors = useTheme().colors;

  const [moduleCounts, setModuleCounts] = useState({
    totalModules: "",
    totalCompletedModules: "",
  });
  const updateModuleCounts = (totalModules, totalCompletedModules) => {
    // Do something with the module counts, e.g., update the state
    setModuleCounts({
      totalModules: totalModules,
      totalCompletedModules: totalCompletedModules,
    });
  };

  const progressRatio =
    moduleCounts.totalCompletedModules / moduleCounts.totalModules;
  console.log(progressRatio);

  return (
    <Background>
      <TopNav onProfile={profile} />
      <View style={styles(colors).container}>
        <View style={styles(colors).row}>
          <Text style={styles(colors).heading}>Modules</Text>
          <View style={styles(colors).progressContainer}>
            <Text style={styles(colors).percentageText}>
              {Math.round(progressRatio * 100)}%
            </Text>
            <CircularProgress
              maxValue={1}
              value={progressRatio}
              radius={20}
              clockwise
              showProgressValue={false} // Hide the progress text value
            />
          </View>
        </View>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles(colors).flex}>
            <Module
              onPress={onPressModule}
              updateModuleCounts={updateModuleCounts}
            />
          </View>
        </ScrollView>
      </View>
    </Background>
  );
};

const styles = (colors) =>
  StyleSheet.create({
    container: {
      marginHorizontal: 30,
      flex: 1,
      marginBottom: "20%",
    },
    row: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 5,
      marginTop: 5,
    },
    heading: {
      color: colors.text,
      fontSize: 25,
      fontWeight: "700",
      marginBottom: 10,
      marginTop: 5,
    },
    flex: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      flexWrap: "wrap",
    },
    progressContainer: {
      flexDirection: "row", // Arrange items horizontally
      alignItems: "center", // Center items vertically
    },
    percentageText: {
      color:colors.text,
      marginRight: 10, // Adjust the spacing between text and progress bar
      fontSize: 16, // Adjust font size as needed
    },
  });

export default Modules;
