import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function App() {
  const [data, setData] = useState(null); // Initialize data as null

  const getApiData = async () => {
    try {
      const url = "https://jsonplaceholder.typicode.com/posts/1";
      const response = await fetch(url);
      if (response.ok) {
        const result = await response.json();
        setData(result);
      } else {
        console.error("Failed to fetch data");
      }
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };

  useEffect(() => {
    getApiData();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={{ fontSize: 30 }}>API Calling In React Native app</Text>
      {data ? (
        <View>
          <Text style={{ fontSize: 30 }}>Id :{data.id} </Text>
          <Text style={{ fontSize: 30 }}>User Id :{data.userId} </Text>
          <Text style={{ fontSize: 30 }}>Title :{data.title} </Text>
          <Text style={{ fontSize: 30 ,color:'red' }}>Body :{data.body} </Text>
        </View>
      ) : (
        <Text>Loading...</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop:50,
    alignItems: 'center',
  },
});
