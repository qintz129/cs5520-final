import { Text, View, Image } from "react-native";
import React, { useState, useEffect } from "react";
import CustomButton from "../components/CustomButton";
import Library from "./Library";
import Reviews from "./Reviews";
import { Ionicons } from "@expo/vector-icons";
import { useUser } from "../hooks/UserContext";
import { ref, getDownloadURL } from "firebase/storage";
import { auth, storage } from "../firebase-files/firebaseSetup";
import { useCustomFonts } from "../hooks/UseFonts";
import { Feather } from "@expo/vector-icons";
import { COLORS } from "../styles/Colors";
import { profileStyles } from "../styles/ScreenStyles";

// Profile component to display the profile of the user
export default function Profile({ navigation }) {
  const { userInfo } = useUser();
  const [activeTab, setActiveTab] = useState("library");
  const [imageUri, setImageUri] = useState(null);
  const [downloadUri, setDownloadUri] = useState(null);
  const styles = profileStyles;
  const { fontsLoaded } = useCustomFonts();
  if (!fontsLoaded) {
    return null;
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

  //console.log(userInfo);
  return (
    <View style={styles.container}>
      <CustomButton onPress={() => navigation.navigate("User Info")}>
        <View style={styles.userAvatar}>
          {downloadUri ? (
            <Image source={{ uri: downloadUri }} style={styles.image} />
          ) : (
            <Ionicons
              name="person-circle"
              size={styles.avatarIconSize}
              color={COLORS.black}
            />
          )}
        </View>
      </CustomButton>
      <Text style={styles.userNameText}>{userInfo.name}</Text>
      <View style={styles.addABook}>
        <CustomButton
          customStyle={styles.addBookButton}
          onPress={() => navigation.navigate("Add A Book", { editMode: false })}
        >
          <Feather
            name="book"
            size={styles.bookIconSize}
            color={COLORS.white}
          />
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
