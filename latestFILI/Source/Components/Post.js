import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Share,
  FlatList,
  RefreshControl,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { useTheme, useIsFocused } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  ALERT_TYPE,
  AlertNotificationRoot,
  Dialog,
} from "react-native-alert-notification";
import { API_BASE_URL,POST_GET_ALL_TOPICS_ENDPOINT } from "../Constant/ConstantApi";

const Post = () => {
  // Define your state variables
  const colors = useTheme().colors;
  const isFocused = useIsFocused();
  const [communityData, setCommunityData] = useState([]);
  const [cpost, setCPost] = useState("");
  const [commentsData, setCommentsData] = useState({});
  const [openPostIds, setOpenPostIds] = useState([]); // Track open comment posts
  const [isPlaceholderRed, setIsPlaceholderRed] = useState(false); // Track placeholder text color
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showBoxForPost, setShowBoxForPost] = useState({});
  const commentInputRef = useRef(null);
  const [isModifying, setIsModifying] = useState(false);
  const [modifiedPostId, setModifiedPostId] = useState(null);
  const [modifiedPostContent, setModifiedPostContent] = useState("");
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

  const fetchData = useCallback(async () => {
    try {
      const authToken = await AsyncStorage.getItem("authToken");
      //Post Api Base Call
      const response = await fetch(
        `${API_BASE_URL}:${POST_GET_ALL_TOPICS_ENDPOINT}`,
        {
          method: "GET",
          headers: { Authorization: authToken },
        }
      );

      if (response.ok) {
        const postData = await response.json();
        setCommunityData(postData);
      } else {
        console.log("Failed to fetch user profile data");
        showErrorMessage("Failed to fetch user profile data");
      }
    } catch (error) {
      console.log("Error:", error);
      showErrorMessage("Something Went Wrong. Please Try Again.");
    }
  }, []);

  const fetchCommentsForPost = useCallback(async (postId) => {
    try {
      const authToken = await AsyncStorage.getItem("authToken");
      const response = await fetch(
        `http://192.168.1.12:8086/api/v1/comments/topicComment/${postId}`,
        {
          method: "GET",
          headers: { Authorization: authToken },
        }
      );

      if (response.status === 200) {
        const result = await response.json();
        setCommentsData((prevData) => ({ ...prevData, [postId]: result }));
      } else {
        console.log("API request failed with status " + response.status);
        showErrorMessage("Failed To Load Comments... Try Again.");
      }
    } catch (error) {
      console.log("Error:", error);
      showErrorMessage("Something Went Wrong. Please Try Again.");
    }
  }, []);

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    try {
      await fetchData();
    } catch (error) {
      console.log("Error while refreshing:", error);
    } finally {
      setIsRefreshing(false);
    }
  }, [fetchData]);

  useEffect(() => {
    if (isFocused) {
      fetchData();
    }
  }, [isFocused, fetchData]);

  const toggleComments = (postId) => {
    if (openPostIds.includes(postId)) {
      setOpenPostIds((prevIds) => prevIds.filter((id) => id !== postId));
    } else {
      setOpenPostIds((prevIds) => [...prevIds, postId]);
      fetchCommentsForPost(postId);
    }
  };

  const onShare = async (description) => {
    const shareOptions = {
      message: description,
    };
    try {
      const result = await Share.share(shareOptions);
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          console.log(`Shared via ${result.activityType}`);
        } else {
          console.log("Shared successfully");
        }
      } else if (result.action === Share.dismissedAction) {
        console.log("Share dismissed");
      }
    } catch (error) {
      console.log("Error => ", error);
    }
  };

  const postComment = async (postId) => {
    if (!cpost.trim()) {
      setIsPlaceholderRed(true);
      return;
    }

    try {
      const authToken = await AsyncStorage.getItem("authToken");
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      myHeaders.append("Authorization", authToken);

      const raw = JSON.stringify({ commentText: cpost.trim() });

      const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow",
      };

      const response = await fetch(
        `http://192.168.1.12:8086/api/v1/comments/topicComment/${postId}`,
        requestOptions
      );
      if (response.status === 200) {
        console.log("Comment posted successfully");
        fetchData();
        fetchCommentsForPost(postId);
        setCPost(""); // Clear comment input field after posting
        setIsPlaceholderRed(false); // Reset placeholder text color
      } else {
        console.log("Failed to post comment. Status: " + response.status);
        showErrorMessage("Failed to post comment. Please try again later.");
      }
    } catch (error) {
      console.log("Error:", error);
      showErrorMessage("Something Went Wrong. Please Try Again.");
    }
  };

  const likePostOrComment = async (postId, commentId) => {
    try {
      const authToken = await AsyncStorage.getItem("authToken");
      const myHeaders = new Headers();
      myHeaders.append("Authorization", authToken);

      const requestOptions = {
        method: "PUT",
        headers: myHeaders,
        redirect: "follow",
      };

      let likeUrl;
      if (commentId) {
        likeUrl = `http://192.168.1.12:8086/api/v1/comments/commentLikeReaction/${commentId}`;
      } else {
        likeUrl = `http://192.168.1.12:8086/api/v1/topics/userTopicLikeReaction/${postId}`;
      }
      const response = await fetch(likeUrl, requestOptions);

      if (response.ok) {
        console.log("Post/comment liked successfully");
        // Update local state based on postId and commentId
        if (commentId) {
          const updatedCommentsData = { ...commentsData };
          updatedCommentsData[postId] = updatedCommentsData[postId].map(
            (comment) => {
              if (comment.id === commentId) {
                return {
                  ...comment,
                  likeByUser: !comment.likeByUser,
                  likeCountComment: {
                    totalLikeCount: comment.likeByUser
                      ? comment.likeCountComment.totalLikeCount - 1
                      : comment.likeCountComment.totalLikeCount + 1,
                  },
                };
              }
              return comment;
            }
          );
          setCommentsData(updatedCommentsData);
        } else {
          const updatedCommunityData = communityData.map((post) => {
            if (post.id === postId) {
              return {
                ...post,
                likeByUser: !post.likeByUser,
                likeCountTopic: {
                  totalLikeCount: post.likeByUser
                    ? post.likeCountTopic.totalLikeCount - 1
                    : post.likeCountTopic.totalLikeCount + 1,
                },
              };
            }
            return post;
          });
          setCommunityData(updatedCommunityData);
        }
      } else {
        console.log(`Failed to like. Status: ${response.status}`);
        showErrorMessage("Failed to like. Please try again later.");
      }
    } catch (error) {
      console.log("Error:", error);
      showErrorMessage("Something Went Wrong. Please Try Again.");
    }
  };

  const toggleBoxForPost = (postId) => {
    console.log("Toggle box for post:", postId);
    setShowBoxForPost((prevShowBox) => ({
      ...prevShowBox,
      [postId]: !prevShowBox[postId],
    }));
    if (!isModifying) {
      setModifiedPostContent("");
      setModifiedPostId(postId);
    }
  };

  const postModify = (postId, item) => {
    toggleBoxForPost(postId);
    setIsModifying(true);
    setModifiedPostContent(item.description);
  };

  const postDelete = async (postId) => {
    console.log("Delete button pressed for post ", postId);
    try {
      const authToken = await AsyncStorage.getItem("authToken");
      const myHeaders = new Headers();
      myHeaders.append("Authorization", authToken);

      const requestOptions = {
        method: "DELETE",
        headers: myHeaders,
        redirect: "follow",
      };

      const deleteUrl = `http://192.168.1.12:8086/api/v1/topics/${postId}`;

      const response = await fetch(deleteUrl, requestOptions);
      if (response.ok) {
        // Remove the deleted post from the state
        const updatedCommunityData = communityData.filter(
          (post) => post.id !== postId
        );
        setCommunityData(updatedCommunityData);
        // Close the box if it's open for the deleted post
        setShowBoxForPost((prevShowBox) => {
          const updatedShowBox = { ...prevShowBox };
          delete updatedShowBox[postId];
          return updatedShowBox;
        });
      } else {
        console.log(`Failed to delete the post. Status: ${response.status}`);
        showErrorMessage("Failed to delete the post. Please try again later.");
      }
    } catch (error) {
      console.log("Error:", error);
      showErrorMessage("Something Went Wrong. Please Try Again.");
    }
  };

  const saveModifiedPost = async () => {
    if (!modifiedPostContent.trim()) {
      return;
    }
    setIsLoading(true);
    try {
      const authToken = await AsyncStorage.getItem("authToken");
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      myHeaders.append("Authorization", authToken);

      const raw = JSON.stringify({ description: modifiedPostContent.trim() });

      const requestOptions = {
        method: "PUT",
        headers: myHeaders,
        body: raw,
        redirect: "follow",
      };

      const response = await fetch(
        `http://192.168.1.12:8086/api/v1/topics/${modifiedPostId}`,
        requestOptions
      );
      if (response.ok) {
        const updatedCommunityData = communityData.map((post) => {
          if (post.id === modifiedPostId) {
            return {
              ...post,
              description: modifiedPostContent,
            };
          }
          return post;
        });
        // Batch state updates
        setIsModifying(false);
        setModifiedPostId(null);
        setModifiedPostContent("");
        setCommunityData(updatedCommunityData);

        console.log("Post updated successfully");
      } else {
        console.log(`Failed to modify the post. Status: ${response.status}`);
        showErrorMessage("Failed to modify the post. Please try again later.");
      }
    } catch (error) {
      console.log("Error:", error);
      showErrorMessage("Something Went Wrong. Please Try Again.");
    } finally {
      setIsLoading(false); // Set loading state back to false after API call completes
    }
  };

  return (
    <AlertNotificationRoot>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : -200} // Adjust this offset as needed
      >
        <View style={styles(colors).Maincontainer}>
          <FlatList
            data={communityData}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item, index }) => (
              <View style={styles(colors).postContainer}>
                <View style={styles(colors).rowContainer}>
                  <Image
                    source={require("../../assets/user/1-1.png")}
                    style={{ width: 25, height: 25 }}
                  />
                  <Text style={styles(colors).name}>{item.username}</Text>
                </View>
                <View style={styles(colors).innerContainer}>
                  <View style={styles(colors).box}>
                    <View style={{ flexDirection: "row" }}>
                      {isModifying && modifiedPostId === item.id ? (
                        <TextInput
                          style={styles(colors).editTextInput}
                          onChangeText={(text) => setModifiedPostContent(text)}
                          value={modifiedPostContent}
                          editable={true}
                          multiline={true}
                        />
                      ) : (
                        <Text style={styles(colors).boxContent}>
                          {item.description}
                        </Text>
                      )}
                      {item.owner ? (
                        <TouchableOpacity
                          onPress={() => toggleBoxForPost(item.id)}>
                          <Image
                            source={require("../../assets/Community/dot.png")}
                            style={{
                              width: 15,
                              height: 15,
                              marginLeft: "auto",
                            }}
                          />
                        </TouchableOpacity>
                      ) : null}
                      {showBoxForPost[item.id] && (
                        <View style={styles(colors).buttonContainer}>
                          <TouchableOpacity
                            style={styles(colors).modifyButton}
                            onPress={() => {
                              postModify(item.id, item);
                            }}>
                            <Image
                              source={require("../../assets/Community/1-1.png")}
                              style={{ width: 16, height: 16 }}
                            />
                            <Text style={styles(colors).buttonText}>Edit</Text>
                          </TouchableOpacity>
                          <TouchableOpacity
                            style={styles(colors).deleteButton}
                            onPress={() => {
                              postDelete(item.id);
                            }}>
                            <Image
                              source={require("../../assets/Community/delete-3.png")}
                              style={{ width: 14, height: 14 }}
                            />
                            <Text style={styles(colors).buttonText}>
                              Delete
                            </Text>
                          </TouchableOpacity>
                        </View>
                      )}
                    </View>
                  </View>
                  {isModifying && modifiedPostId === item.id ? (
                    <View style={styles(colors).buttonxContainer}>
                      {isLoading ? (
                        <ActivityIndicator
                          size="small"
                          color={colors.primary}
                        />
                      ) : (
                        <TouchableOpacity
                          style={styles(colors).saveButton}
                          onPress={saveModifiedPost}>
                          <Text style={styles(colors).buttonText}>Save</Text>
                        </TouchableOpacity>
                      )}
                      <TouchableOpacity
                        style={styles(colors).cancelButton}
                        onPress={() => {
                          setIsModifying(false); // Exit modify mode
                        }}>
                        <Text style={styles(colors).buttonText}>Cancel</Text>
                      </TouchableOpacity>
                    </View>
                  ) : null}
                  <View style={styles(colors).lastView}>
                    <TouchableOpacity
                      onPress={() => toggleComments(item.id)}
                      style={styles(colors).rowContainer}>
                      <Text style={styles(colors).comment}>Comments</Text>
                      <Text style={styles(colors).commentCount}>
                        {item.topicCommentCount}
                      </Text>
                    </TouchableOpacity>
                    <View style={{ flexDirection: "row" }}>
                      <TouchableOpacity
                        onPress={() => likePostOrComment(item.id)}>
                        {item.likeByUser ? (
                          <Icon name="heart" color={"red"} size={20} />
                        ) : (
                          <Icon name="heart-outline" color={"red"} size={20} />
                        )}
                      </TouchableOpacity>
                      <Text style={styles(colors).like}>
                        {item.likeCountTopic.totalLikeCount}
                      </Text>
                      <TouchableOpacity
                        onPress={() => onShare(item.description)}>
                        <Icon name="share-social" color={"green"} size={20} />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
                {openPostIds.includes(item.id) && (
                  <View>
                    <FlatList
                      data={commentsData[item.id] || []}
                      keyExtractor={(comment) => comment.id.toString()}
                      renderItem={({ item: comment }) => (
                        <View style={styles(colors).comments}>
                          <Image
                            source={require("../../assets/user/1-1.png")}
                            style={{ width: 20, height: 20 }}
                          />
                          <View style={styles(colors).cinnerContainer}>
                            <Text style={styles(colors).cname}>
                              {comment.username}
                            </Text>
                            <View style={styles(colors).cbox}>
                              <Text style={styles(colors).like}>
                                {comment.commentText}
                              </Text>
                              <View style={styles(colors).lastView2}>
                                <TouchableOpacity
                                  onPress={() =>
                                    likePostOrComment(item.id, comment.id)
                                  }>
                                  {comment.likeByUser ? (
                                    <Icon
                                      name="heart"
                                      color={"red"}
                                      size={18}
                                    />
                                  ) : (
                                    <Icon
                                      name="heart-outline"
                                      color={"red"}
                                      size={18}
                                    />
                                  )}
                                </TouchableOpacity>
                                <Text style={styles(colors).like}>
                                  {comment.likeCountComment.totalLikeCount}
                                </Text>
                              </View>
                            </View>
                          </View>
                        </View>
                      )}
                    />
                    <View style={styles(colors).cpost}>
                      <TextInput
                        ref={commentInputRef}
                        style={styles(colors).cpostInput}
                        onChangeText={(text) => {
                          setCPost(text);
                          setIsPlaceholderRed(false);
                        }}
                        placeholder="Add a comment!"
                        placeholderTextColor={
                          isPlaceholderRed ? "red" : colors.text
                        }
                        value={cpost}
                      />
                      <TouchableOpacity onPress={() => postComment(item.id)}>
                        <Text style={styles(colors).postButton}>Comment</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                )}
              </View>
            )}
            refreshControl={
              <RefreshControl
                refreshing={isRefreshing}
                onRefresh={handleRefresh}
                tintColor="#130B4D" // Customize the loading spinner color
              />
            }
          />
        </View>
      </KeyboardAvoidingView>
    </AlertNotificationRoot>
  );
};

const styles = (colors) =>
  StyleSheet.create({
    Maincontainer: {
      flex: 1,
    },
    postContainer: {
      marginBottom: 10,
    },
    rowContainer: {
      flexDirection: "row",
      alignItems: "center",
    },
    innerContainer: {
      marginLeft: 30,
      width: "70%",
    },
    name: {
      marginLeft: 3,
      fontSize: 20,
      fontWeight: "bold",
      color: colors.text,
    },
    box: {
      width: "auto",
      backgroundColor: "white",
      borderRadius: 13,
      borderWidth: 1,
      borderColor: "#130B4D",
      marginTop: 5,
      padding: 7,
    },
    modifyButton: {
      flexDirection: "row",
      backgroundColor: "green",
      borderRadius: 5,
      paddingVertical: 5,
      paddingHorizontal: 5,
      marginBottom: 5,
      alignItems: "center",
      width: 60,
    },
    deleteButton: {
      flexDirection: "row",
      backgroundColor: "red",
      borderRadius: 5,
      paddingVertical: 5,
      paddingHorizontal: 5,
      alignItems: "center",
    },
    buttonContainer: {
      position: "absolute",
      right: -70,
      alignItems: "center",
      borderWidth: 2,
      borderRadius: 2,
      backgroundColor: "white",
      borderColor: "#ccc",
      padding: 3,
      height: 72,
    },
    buttonText: {
      color: "white",
      fontSize: 12,
      fontWeight: "bold",
    },
    boxContent: {
      width: "92%",
    },
    lastView: {
      width: "95%",
      marginTop: 10,
      flexDirection: "row",
      justifyContent: "space-between",
    },
    lastView2: {
      flexDirection: "row",
      marginTop: 10,
    },
    comment: {
      fontSize: 15,
      color: colors.text,
    },
    commentCount: { fontSize: 15, color: colors.text, marginLeft: 6 },
    like: { fontSize: 13, marginRight: 10, color: colors.text },
    comments: {
      flex: 1,
      flexDirection: "row",
      marginTop: 10,
      width: "70%",
      marginHorizontal: 30,
    },
    cname: {
      fontSize: 16,
      fontWeight: "700",
      color: colors.text,
    },
    cinnerContainer: {
      marginLeft: 3,
      width: "80%",
    },
    cbox: {
      width: "100%",
      borderRadius: 10,
      marginTop: 10,
    },
    cpost: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginTop: 20,
      width: "65%",
      alignItems: "center",
      marginHorizontal: 50,
    },
    cpostInput: {
      width: "75%",
      borderBottomWidth: 1,
      fontSize: 15,
      color: colors.text,
      borderColor: colors.text,
    },
    postButton: {
      fontSize: 13,
      width: 65,
      height: 27,
      textAlignVertical: "center",
      textAlign: "center",
      color: "black",
      backgroundColor: "skyblue",
      borderRadius: 5,
      fontWeight: "bold",
    },
    saveButton: {
      backgroundColor: "skyblue",
      padding: 7,
      borderRadius: 5,
      width: 54,
      alignItems: "center",
    },
    cancelButton: {
      backgroundColor: "orange",
      padding: 7,
      borderRadius: 5,
    },
    buttonxContainer: {
      flexDirection: "row",
      justifyContent: "space-around",
      marginTop: 10,
    },
    editTextInput: {
      width: "92%",
      color: "black",
    },
  });

export default Post;
