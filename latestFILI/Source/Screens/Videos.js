import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  Dimensions,
} from "react-native";
import { useIsFocused } from "@react-navigation/native";
import { useTheme } from "@react-navigation/native";
import Background from "../Components/Background";
import TopNav from "../Components/TopNav";
import YoutubePlayer from "react-native-youtube-iframe";

const { height, width } = Dimensions.get("window");

const data = [
  { type: "video" },
  { type: "image", src: require("../../assets/image1.png") },
];

const Videos = (props) => {
  const colors = useTheme().colors;
  const isFocused = useIsFocused();
  const [currentIndex, setCurrentIndex] = useState(0);

  const profile = () => {
    props.navigation.navigate("Profile");
  };

  return (
    <Background>
      <TopNav onProfile={profile} />
      <ScrollView>
        <View style={styles(colors).Maincontainer}>
          {/* <View
            style={{
              marginHorizontal: 10,
              borderRadius: 10,
              borderWidth: 2,
              borderColor: "white",
              padding: 10,
              marginTop: 15,
              elevation: 2,
              flexDirection: "row",
            }}>
            <Image
              source={require("../../assets/mainlogo.png")}
              resizeMode="contain"
              style={{ width: 100, height: 100 }}
            />
            <Text
              style={{
                color: colors.text,
                fontSize: 30,
                fontWeight: "bold",
                marginLeft: 10,
              }}>
              BudgetAlizer
            </Text>
          </View> */}
          <View style={styles(colors).sliderContainer}>
            <ScrollView
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              onScroll={(event) => {
                const x = event.nativeEvent.contentOffset.x;
                setCurrentIndex(Math.round(x / width));
              }}>
              {data.map((item, index) => (
                <View key={index} style={styles(colors).slide}>
                  {item.type === "video" && (
                    <YoutubePlayer
                      height={height * 0.28}
                      play={false}
                      videoId={"O-wq-C-52NY"}
                    />
                  )}
                  {item.type === "image" && (
                    <Image source={item.src} style={styles(colors).image} />
                  )}
                </View>
              ))}
            </ScrollView>
          </View>
          <View style={styles(colors).scroll}>
            {data.map((item, index) => (
              <View
                key={index}
                style={[
                  styles(colors).item,
                  {
                    backgroundColor:
                      currentIndex === index && isFocused
                        ? colors.text
                        : "#695F9B",
                  },
                ]}
              />
            ))}
          </View>
        </View>
      </ScrollView>
    </Background>
  );
};

const styles = (colors) =>
  StyleSheet.create({
    Maincontainer: {
      flex: 1,
    },
    sliderContainer: {
      height: height * 0.28,
      marginTop: 20,
    },
    slide: {
      width: width,
      height: height * 0.28,
    },
    image: {
      width: "100%",
      height: "100%",
      resizeMode: "contain",
    },
    scroll: {
      flexDirection: "row",
      justifyContent: "center",
      marginTop: 5,
    },
    item: {
      width: 8,
      height: 8,
      borderRadius: 4,
      margin: 2,
    },
  });

export default Videos;
