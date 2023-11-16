import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, Modal, ScrollView } from 'react-native';
import axios from 'axios';

const App = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [modalContent, setModalContent] = useState('');

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
      const formattedData = JSON.stringify(response.data, null, 2);
      setModalContent(formattedData);
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
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={googleLogin}>
        <Text style={styles.buttonText}>Google Login</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={argyleLogin}>
        <Text style={styles.buttonText}>Argyle Login</Text>
      </TouchableOpacity>

      {/* Modal to display fetched data */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <ScrollView contentContainerStyle={styles.scrollContainer}>
            <View style={styles.modalContent}>
              <Text>{modalContent}</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Text style={styles.modalCloseButton}>Close</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    backgroundColor: 'blue',
    padding: 10,
    marginVertical: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    elevation: 5,
  },
  modalCloseButton: {
    color: 'blue',
    marginTop: 10,
    textAlign: 'center',
  },
});

export default App;
