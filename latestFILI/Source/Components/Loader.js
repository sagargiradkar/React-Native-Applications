import { View, Text, StyleSheet, useWindowDimensions } from "react-native";
import { BarIndicator } from "react-native-indicators";

const Loader = ({ visible = false }) => {
  const { width, height } = useWindowDimensions();
  return (
    visible && (
      <View style={[styles.container, { width, height }]}>
        <View style={styles.loader}>
          <BarIndicator color="gray" count={5} />
          <Text style={styles.text}>Loading Please Wait!</Text>
        </View>
      </View>
    )
  );
};

const styles = StyleSheet.create({
  loader: {
    height: 90,
    backgroundColor: "transparent",
    marginHorizontal: 50,
    borderRadius: 5,
    paddingHorizontal: 20,
    alignItems: "center",
  },
  container: {
    position: "absolute",
    zIndex: 10,
    backgroundColor: "transparent",
    justifyContent: "center",
  },
  text: {
    marginBottom: 10,
    fontSize: 16,
    color: "gray",
  },
});

export default Loader;
