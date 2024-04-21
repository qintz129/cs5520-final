import { Text, View, Image, Dimensions } from "react-native";
import React, { useState, useEffect } from "react";
import CustomButton from "./CustomButton";
import AntDesign from "react-native-vector-icons/AntDesign";
import { useNavigation } from "@react-navigation/native";
import { storage } from "../firebase-files/firebaseSetup";
import { ref, getDownloadURL } from "firebase/storage";
import { Entypo } from "@expo/vector-icons";
import { useCustomFonts } from "../hooks/UseFonts";
import { exploreBookCardStyles } from "../styles/ComponentStyles";
import { COLORS } from "../styles/Colors";

// ExploreBookCard component to display the book card in Explore screen
export default function ExploreBookCard({ item }) {
  const navigation = useNavigation();
  const [bookAvatar, setBookAvatar] = useState(null);
  const screenWidth = Dimensions.get("window").width;
  const bookCardWidth = (screenWidth - 15 * 3) / 2;
  const styles = exploreBookCardStyles;
  const { fontsLoaded } = useCustomFonts();
  if (!fontsLoaded) {
    return null;
  }
  // If the book has an image, load the image from firebase storage
  useEffect(() => {
    if (item.image) {
      const imageRef = ref(storage, item.image);
      getDownloadURL(imageRef)
        .then((url) => {
          setBookAvatar(url);
        })
        .catch((error) => {
          console.error("Failed to load image:", error);
        });
    }
  }, [item.image]);

  return (
    <CustomButton
      onPress={() =>
        navigation.navigate("Book Detail", {
          bookId: item.id,
          ownerId: item.owner,
          distance: item.distance,
        })
      }
    >
      <View style={[styles.item, { width: bookCardWidth }]}>
        <View style={styles.cover}>
          {bookAvatar ? (
            <Image source={{ uri: bookAvatar }} style={styles.bookAvatar} />
          ) : (
            <AntDesign
              name="picture"
              size={styles.imageIconSize}
              color={COLORS.grey}
            />
          )}
        </View>
        <Text
          style={styles.titleText}
          numberOfLines={2}
          adjustsFontSizeToFit
          minimumFontScale={0.5} // to adjust the font size to fit the text
          ellipsizeMode="tail"
        >
          {item.bookName}
        </Text>
        <Text
          style={styles.authorText}
          numberOfLines={2}
          adjustsFontSizeToFit
          minimumFontScale={0.5}
          ellipsizeMode="tail"
        >
          {item.author}
        </Text>
        <View style={styles.distanceContainer}>
          <Entypo
            name="location-pin"
            size={styles.pinIconSize}
            color={COLORS.mainTheme}
          />
          <Text style={styles.distanceText}>{item.distance} km</Text>
        </View>
      </View>
    </CustomButton>
  );
}
