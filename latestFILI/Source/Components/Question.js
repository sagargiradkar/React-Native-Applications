import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ScrollView,
} from "react-native";
import { useTheme } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useIsFocused } from "@react-navigation/native";
import {
  AlertNotificationRoot,
  ALERT_TYPE,
  Dialog,
  Toast,
} from "react-native-alert-notification";
import { API_BASE_URL, USER_QUIZE_ENDPOINT } from "../Constant/ConstantApi";

const Question = ({ ...props }) => {
  const colors = useTheme().colors;
  const isFocused = useIsFocused();
  const [quizData, setQuizData] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedQuestionId, setSelectedQuestionId] = useState(null);
  const [selectedOptionId, setSelectedOptionId] = useState(null);
  const [selectedOptions, setSelectedOptions] = useState(
    Array(quizData.length).fill(null)
  );
  const [answeredQuestions, setAnsweredQuestions] = useState(
    Array(quizData.length).fill(false)
  );
  const scrollViewRef = useRef(null);
  const [quizIdFromBackend, setQuizIdFromBackend] = useState(null);
  const [quizName, setQuizName] = useState(null);

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

  const showErrorAlert = (message) => {
    Dialog.show({
      type: ALERT_TYPE.DANGER,
      title: "ERROR",
      textBody: message,
      button: "Close",
    });
  };

  useEffect(() => {
    if (isFocused) {
      fetchQuizData();
    }
  }, [isFocused]);
  const fetchQuizData = async () => {
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
        `${API_BASE_URL}:${USER_QUIZE_ENDPOINT}`,
        requestOptions
      );

      if (response.status === 200) {
        const data = await response.json();
        const quizData = data.questions.map((question) => ({
          id: question.id,
          text: question.text,
          options: question.options,
        }));
        setQuizData(quizData);
        setQuizIdFromBackend(data.id);
        setQuizName(data.quizName);
        console.log("Quiz Name:", data.quizName);
        console.log("Quiz ID:", data.id);
        console.log("Full data:", data);
      } else if (response.status === 400) {
        const data = await response.json();
        console.log("Response Status Code:", response.status);
        console.log("Response Data:", data); // Move this logging here

        if (data.message === "Please complete at least one module first.") {
          Dialog.show({
            type: ALERT_TYPE.WARNING,
            title: "WARNING!",
            textBody: "Please complete at least one module first.",
            button: "Go To The Module.",
            onHide: () => {
              props.navigation.navigate("Module");
            },
          });
        } else if (
          data.message ===
          "No more quizzes available. Please complete any remaining modules."
        ) {
          Dialog.show({
            type: ALERT_TYPE.WARNING,
            title: "WARNING!",
            textBody:
              "No more quizzes available. Please complete any remaining modules.",
            button: "Go To The Module.",
            onHide: () => {
              props.navigation.navigate("Module");
            },
          });
        } else if (
          data.message === "Congratulations! You've completed all quizzes."
        ) {
          Dialog.show({
            type: ALERT_TYPE.WARNING,
            title: "WARNING!",
            textBody: "Congratulations! You've completed all quizzes.",
            button: "Go To The Module.",
            onHide: () => {
              props.navigation.navigate("Module");
            },
          });
        } else {
          showErrorAlert("Something Went Wrong. Please Try Again.");
        }
      } else {
        showErrorAlert("Something Went Wrong. Please Try Again.");
      }
    } catch (error) {
      console.log("Error:", error.message);
      showErrorAlert("Something Went Wrong. Please Try Again.");
    }
  };

  const handleScroll = (event) => {
    console.log("scroll answered", answeredQuestions[currentIndex]);
    console.log("scroll current", currentIndex);
    if (event && event.nativeEvent) {
      // Check if event is defined and has nativeEvent
      const contentOffsetX = event.nativeEvent.contentOffset.x; // Horizontal scroll
      const itemWidth = Dimensions.get("window").width; // Adjust this as needed
      const newIndex = Math.floor(contentOffsetX / itemWidth);

      // Check if the user has answered the current question
      if (
        answeredQuestions[currentIndex] === true ||
        newIndex !== currentIndex
      ) {
        setCurrentIndex(newIndex);
        console.log("scroll newIndex", newIndex);
      } else {
        Dialog.show({
          type: ALERT_TYPE.WARNING,
          title: "Warning",
          textBody: "Please select an option for the current question.",
          button: "OK",
        });
        // Scroll back to the current question
        scrollViewRef.current.scrollTo({
          x: currentIndex * itemWidth,
          animated: true,
        });
      }
    }
  };

  useEffect(() => {
    if (selectedQuestionId !== null && selectedOptionId !== null) {
      console.log("Selected Question ID:", selectedQuestionId);
      console.log("Selected Option ID:", selectedOptionId);
      setAnsweredQuestions((prev) => {
        const updated = [...prev];
        updated[currentIndex] = true;
        return updated;
      });
    }
  }, [selectedQuestionId, selectedOptionId]);

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      // Scroll to the previous view
      scrollViewRef.current.scrollTo({
        x: (currentIndex - 1) * Dimensions.get("window").width,
      });
    }
  };

  const handleNext = () => {
    const selectedOptionIndex = selectedOptions[currentIndex];
    console.log("next", selectedOptionIndex);
    if (selectedOptionIndex !== undefined) {
      // User has answered the current question, proceed to the next question
      if (currentIndex < quizData.length - 1) {
        setCurrentIndex(currentIndex + 1);
        // Scroll to the next view
        scrollViewRef.current.scrollTo({
          x: (currentIndex + 1) * Dimensions.get("window").width,
          animated: true,
        });
      } else {
        handleSubmit();
      }
    } else {
      // User hasn't answered the current question, show a warning
      showToastMessage("Please select an option for the current question.");
      // Scroll back to the current question
      scrollViewRef.current.scrollTo({
        x: currentIndex * Dimensions.get("window").width,
        animated: true,
      });
    }
  };

  const handleSubmit = () => {
    const selectedAnswers = {};
    // Iterate through quizData to collect selected answers
    quizData.forEach((quizItem, index) => {
      const questionId = quizItem.id;
      const selectedOptionIndex = selectedOptions[index];
      // Check if an option was selected for the current question
      if (selectedOptionIndex !== null) {
        const selectedOptionId = quizItem.options[selectedOptionIndex].id;
        selectedAnswers[questionId] = selectedOptionId;
      }
    });
    // Log the selected answers object
    console.log("Selected Answers:", selectedAnswers);
    console.log("Quiz ID:", quizIdFromBackend);
    props.navigation.navigate("QuizResult", {
      quizId: quizIdFromBackend,
      selectedAnswers: selectedAnswers,
    });
  };

  return (
    <AlertNotificationRoot>
      <Text style={styles(colors).questionName}>{quizName}</Text>
      <Text style={styles(colors).questions}>⏩ Questions</Text>
      <ScrollView
        ref={scrollViewRef} // Set the ref for the ScrollView
        horizontal // Enable horizontal scrolling
        pagingEnabled // Enable paging for questions
        showsHorizontalScrollIndicator={false} // Hide horizontal scroll indicator
        onScroll={handleScroll}>
        {quizData.map((QuizItem, index) => (
          <View style={styles(colors).container} key={index}>
            <Text style={styles(colors).question}>{QuizItem.text}</Text>
            <ScrollView
              style={{ maxHeight: "90%" }} // Set a maximum height for vertical scrolling
            >
              {QuizItem.options.map((option, optionIndex) => (
                <TouchableOpacity
                  style={[
                    styles(colors).optionContainer,
                    {
                      backgroundColor:
                        selectedOptions[index] === optionIndex
                          ? "white"
                          : colors.primary,
                      borderColor:
                        selectedOptions[index] === optionIndex
                          ? "#130B4D"
                          : "white",
                    },
                  ]}
                  onPress={() => {
                    setSelectedOptions((prevSelectedOptions) => {
                      const newSelectedOptions = [...prevSelectedOptions];
                      newSelectedOptions[index] = optionIndex;
                      return newSelectedOptions;
                    });

                    setSelectedQuestionId(QuizItem.id); // Update selected question ID
                    setSelectedOptionId(option.id); // Update selected option ID
                  }}
                  key={optionIndex}>
                  <View style={styles(colors).option}>
                    <View
                      style={[
                        styles(colors).optionIcon,
                        { backgroundColor: "#130B4D", borderColor: "white" },
                      ]}></View>
                    <Text
                      style={[
                        styles(colors).optionText,
                        {
                          color:
                            selectedOptions[index] === optionIndex
                              ? "#130B4D"
                              : "white",
                        },
                      ]}>
                      {option.text}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        ))}
      </ScrollView>
      <View style={styles(colors).buttonContainer}>
        <TouchableOpacity
          style={styles(colors).button}
          onPress={handlePrevious}>
          <Text style={styles(colors).buttonText}>Previous</Text>
        </TouchableOpacity>
        <Text style={styles(colors).quizInfo}>
          {currentIndex + 1} out of {quizData.length}
        </Text>
        <TouchableOpacity
          style={styles(colors).SubNextbutton}
          onPress={handleNext}>
          <Text style={styles(colors).buttonText}>
            {currentIndex === quizData.length - 1 ? "Submit" : "Next"}
          </Text>
        </TouchableOpacity>
      </View>
    </AlertNotificationRoot>
  );
};

const styles = (colors) =>
  StyleSheet.create({
    container: {
      width: Dimensions.get("window").width,
      flexDirection: "column", // Display questions and options in a column
    },
    questionName: {
      color: colors.text,
      fontSize: 25,
      fontWeight: "bold",
      marginBottom: 15,
      textAlign: "center",
    },
    questions: {
      color: colors.text,
      fontSize: 16,
      fontWeight: "bold",
      marginBottom: 5,
      textAlign: "justify",
      marginHorizontal: 15,
    },
    question: {
      color: colors.text,
      fontSize: 25,
      fontWeight: "500",
      marginBottom: 15,
      textAlign: "justify",
      marginHorizontal: 15,
    },
    optionContainer: {
      borderWidth: 1,
      width: "90%",
      elevation: 5,
      borderRadius: 15,
      marginBottom: 25,
      alignSelf: "center",
      paddingHorizontal: 15,
      paddingVertical: 10,
      justifyContent: "center",
    },
    option: {
      flexDirection: "row",
      alignItems: "center",
    },
    optionIcon: {
      width: 20,
      height: 20,
      borderRadius: 10,
      borderWidth: 2,
      marginRight: 5,
    },
    optionText: {
      fontSize: 18,
      fontWeight: "300",
      marginHorizontal: 5,
      width: "93%",
    },
    buttonContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingHorizontal: 20,
      height: Dimensions.get("window").height * 0.1,
    },
    button: {
      backgroundColor: colors.primary,
      borderRadius: 10,
      paddingVertical: 10,
      paddingHorizontal: 20,
    },
    SubNextbutton: {
      backgroundColor: colors.primary,
      borderRadius: 10,
      paddingVertical: 10,
      paddingHorizontal: 20,
      width: "30%",
    },
    buttonText: {
      color: "white",
      fontSize: 16,
      fontWeight: "bold",
      textAlign: "center",
    },
    quizInfo: {
      color: colors.text,
      fontSize: 18,
      fontWeight: "bold",
    },
  });

export default Question;
