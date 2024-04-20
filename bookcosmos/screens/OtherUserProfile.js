import { Text, View, Image } from "react-native";
import React, { useState, useEffect } from "react";
import CustomButton from "../components/CustomButton";
import Library from "./Library";
import Reviews from "./Reviews";
import { Ionicons } from "@expo/vector-icons";
import { onSnapshot, doc } from "firebase/firestore";
import { database, storage } from "../firebase-files/firebaseSetup";
import { ref, getDownloadURL } from "firebase/storage";
import { Entypo } from "@expo/vector-icons";
import { useCustomFonts } from "../hooks/UseFonts";
import { FontAwesome } from "@expo/vector-icons";
import { COLORS } from "../styles/Colors";
import { otherUserProfileStyles } from "../styles/ScreenStyles";

// OtherUserProfile component to display the profile of other users
export default function OtherUserProfile({ navigation, route }) {
  const [activeTab, setActiveTab] = useState("library");
  const { ownerId, ownerName, rating } = route.params;
  const [userAvatar, setUserAvatar] = useState(null);
  const styles = otherUserProfileStyles;
  const { fontsLoaded } = useCustomFonts();
  if (!fontsLoaded) {
    return null;
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
      <View style={styles.userAvatar}>
        {userAvatar ? (
          <Image source={{ uri: userAvatar }} style={styles.Image} />
        ) : (
          <Ionicons
            name="person-circle"
            size={styles.personIconSize}
            color={COLORS.black}
          />
        )}
        <View style={styles.avatarBottom}>
          {rating > 0 && (
            <View style={styles.userRatingContainer}>
              <FontAwesome
                name="star"
                size={styles.starIconSize}
                color={COLORS.reviewStar}
              />
              <Text style={styles.ratingText}>{rating}</Text>
            </View>
          )}
          <CustomButton
            onPress={() =>
              navigation.navigate("Chat", {
                otherId: ownerId,
                otherName: ownerName,
              })
            }
          >
            <Entypo
              name="chat"
              size={styles.chatIconSize}
              color={COLORS.black}
            />
          </CustomButton>
        </View>
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
        <Library navigation={navigation} userId={ownerId} isMyLibrary={false} />
      ) : (
        <Reviews userId={ownerId} />
      )}
    </View>
  );
}
