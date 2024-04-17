import { StyleSheet, Text, View, Image } from "react-native";
import React, { useState, useEffect } from "react";
import CustomButton from "../components/CustomButton";
import Library from "./Library";
import Reviews from "./Reviews";
import { Ionicons } from "@expo/vector-icons";
import { onSnapshot, doc } from "firebase/firestore";
import { database, storage } from "../firebase-files/firebaseSetup";
import { ref, getDownloadURL } from "firebase/storage";
import { useCustomFonts } from "../Fonts";
import { FontAwesome } from "@expo/vector-icons";

// OtherUserProfile component to display the profile of other users
export default function OtherUserProfile({ navigation, route }) {
  const [activeTab, setActiveTab] = useState("library");
  const { ownerId, ownerName, rating } = route.params;
  const [userAvatar, setUserAvatar] = useState(null);

  const { fontsLoaded } = useCustomFonts();
  if (!fontsLoaded) {
    return <Text>Loading...</Text>;
  }

  useEffect(() => {
    navigation.setOptions({
      title: ownerName,
    });
  }, [ownerName]);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      doc(database, "users", ownerId),
      (doc) => {
        if (doc.exists()) {
          const userData = doc.data();
          if (userData.image) {
            const imageRef = ref(storage, userData.image);
            getDownloadURL(imageRef)
              .then((url) => {
                setUserAvatar(url);
              })
              .catch((error) => {
                console.log(error);
              });
          }
        } else {
          console.log("No such document!");
        }
      },
      (err) => {
        console.log(err);
      }
    );
    return () => unsubscribe();
  }, [ownerId]);

  return (
    <View style={styles.container}>
      <View style={styles.topContainer}>
        <View style={styles.userAvatar}>
          {userAvatar ? (
            <Image source={{ uri: userAvatar }} style={styles.Image} />
          ) : (
            <Ionicons name="person-circle" size={100} color="black" />
          )}
          {rating > 0 && (
            <View style={styles.userRatingContainer}>
              <FontAwesome name="star" size={24} color="#fdcc0d" />
              <Text style={styles.ratingText}>{rating}</Text>
            </View>
          )}
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
      </View>
      {activeTab === "library" ? (
        <Library navigation={navigation} userId={ownerId} isMyLibrary={false} />
      ) : (
        <Reviews userId={ownerId} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topContainer: {
    backgroundColor: "white",
  },
  userAvatar: {
    marginTop: 20,
    alignItems: "center",
    marginVertical: 5,
    rowGap: 15,
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
  Image: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  userRatingContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    columnGap: 10,
  },
  ratingText: {
    fontSize: 22,
    fontFamily: "SecularOne_400Regular",
    textAlign: "center",
  },
  tabText: {
    fontFamily: "SecularOne_400Regular",
    fontSize: 18,
    color: "gray",
  },
});
