import { StyleSheet, Text, View, Image } from "react-native";
import React, { useState, useEffect } from "react";
import CustomButton from "../components/CustomButton";
import Library from "./Library";
import Reviews from "./Reviews";
import { Ionicons } from "@expo/vector-icons";
import { useUser } from "../hooks/UserContext";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { auth, database, storage } from "../firebase-files/firebaseSetup";
import { useCustomFonts } from "../Fonts";
import { Feather } from "@expo/vector-icons";

// Profile component to display the profile of the user
export default function Profile({ navigation }) {
  const { userInfo } = useUser();
  const [activeTab, setActiveTab] = useState("library");
  const [imageUri, setImageUri] = useState(null);
  const [downloadUri, setDownloadUri] = useState(null);

  const { fontsLoaded } = useCustomFonts();
  if (!fontsLoaded) {
    return <Text>Loading...</Text>;
  }

  useEffect(() => {
    setImageUri(userInfo.imageUri);
  }, [userInfo.imageUri]);

  useEffect(() => {
    const fetchImage = async () => {
      const imageRef = ref(storage, imageUri);

      try {
        const url = await getDownloadURL(imageRef);
        setDownloadUri(url);
      } catch (error) {
        console.log(error);
      }
    };

    if (imageUri) {
      fetchImage();
    }
  }, [imageUri]);

  console.log(userInfo);
  return (
    <View style={styles.container}>
      <CustomButton onPress={() => navigation.navigate("User Info")}>
        <View style={styles.userAvatar}>
          {downloadUri ? (
            <Image source={{ uri: downloadUri }} style={styles.image} />
          ) : (
            <Ionicons name="person-circle" size={100} color="black" />
          )}
        </View>
      </CustomButton>
      <Text style={styles.userNameText}>{userInfo.name}</Text>
      <View style={styles.addABook}>
        <CustomButton
          customStyle={styles.addBookButton}
          onPress={() => navigation.navigate("Add A Book", { editMode: false })}
        >
          <Feather name="book" size={24} color="white" />
          <Text style={styles.addBookText}>Add A Book</Text>
        </CustomButton>
      </View>
      <View style={styles.tabs}>
        <CustomButton
          customStyle={[
            styles.tab,
            activeTab === "library" && styles.activeTab,
          ]}
          onPress={() => setActiveTab("library")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "library" && styles.activeTabText,
            ]}
          >
            My Library
          </Text>
        </CustomButton>
        <CustomButton
          customStyle={[
            styles.tab,
            activeTab === "reviews" && styles.activeTab,
          ]}
          onPress={() => setActiveTab("reviews")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "reviews" && styles.activeTabText,
            ]}
          >
            Reviews
          </Text>
        </CustomButton>
      </View>
      {activeTab === "library" ? (
        <Library
          navigation={navigation}
          userId={auth.currentUser.uid}
          isMyLibrary={true}
        />
      ) : (
        <Reviews userId={auth.currentUser.uid} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  addABook: {
    alignItems: "flex-start",
    marginVertical: 10,
    marginLeft: 30,
  },
  addBookButton: {
    backgroundColor: "#55c7aa",
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 20,
    flexDirection: "row",
    columnGap: 10,
  },
  addBookText: {
    fontFamily: "SecularOne_400Regular",
    fontSize: 18,
    color: "white",
  },
  tabs: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "stretch",
    marginHorizontal: 20,
  },
  tab: {
    flex: 1,
  },
  activeTab: {
    borderBottomWidth: 3,
    borderBottomColor: "#55c7aa",
  },
  activeTabText: {
    color: "black",
    marginBottom: 10,
  },
  tabText: {
    fontFamily: "SecularOne_400Regular",
    fontSize: 18,
    color: "gray",
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  container: {
    flex: 1,
  },
  userAvatar: {
    alignItems: "center",
    marginVertical: 5,
  },
  userNameText: {
    fontSize: 22,
    fontFamily: "SecularOne_400Regular",
    textAlign: "center",
  },
});
