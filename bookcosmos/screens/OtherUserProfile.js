import { StyleSheet, Text, View, Image } from "react-native";
import React, { useState, useEffect } from "react";
import CustomButton from "../components/CustomButton";
import Library from "./Library";
import Reviews from "./Reviews";
import { Ionicons } from "@expo/vector-icons";
import { onSnapshot, doc } from "firebase/firestore";
import { database, storage } from "../firebase-files/firebaseSetup";
import { ref, getDownloadURL } from "firebase/storage";

// OtherUserProfile component to display the profile of other users
export default function OtherUserProfile({ navigation, route }) {
  const [activeTab, setActiveTab] = useState("library");
  const { ownerId, ownerName, rating } = route.params;
  const [userAvatar, setUserAvatar] = useState(null);

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
      <View style={styles.userAvatar}>
        {userAvatar ? (
          <Image source={{ uri: userAvatar }} style={styles.Image} />
        ) : (
          <Ionicons name="person-circle" size={100} color="black" />
        )}
        {rating > 0 && <Text>Rating: {rating}</Text>}
      </View>
      <View style={styles.tabs}>
        <CustomButton onPress={() => setActiveTab("library")}>
          <Text>My Library</Text>
        </CustomButton>
        <CustomButton onPress={() => setActiveTab("reviews")}>
          <Text>Reviews</Text>
        </CustomButton>
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
  userAvatar: {
    alignItems: "center",
    marginVertical: 5,
  },
  tabs: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 10,
  },
  Image: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
});
