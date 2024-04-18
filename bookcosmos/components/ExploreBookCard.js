import {
  StyleSheet,
  Text,
  View,
  Image,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import React, { useState, useEffect } from "react";
import CustomButton from "./CustomButton";
import AntDesign from "react-native-vector-icons/AntDesign";
import { useNavigation } from "@react-navigation/native";
import { storage } from "../firebase-files/firebaseSetup";
import { ref, getDownloadURL } from "firebase/storage";
import { Entypo } from "@expo/vector-icons";
import { useCustomFonts } from "../Fonts";

export default function ExploreBookCard({ item }) {
  const navigation = useNavigation();
  const [bookAvatar, setBookAvatar] = useState(null);
  const screenWidth = Dimensions.get("window").width;
  const bookCardWidth = (screenWidth - 15 * 3) / 2;

  const { fontsLoaded } = useCustomFonts();
  if (!fontsLoaded) {
    return <Text>...</Text>;
  }

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
            <Image
              source={{ uri: bookAvatar }}
              style={{ width: "100%", height: "100%" }}
            />
          ) : (
            <AntDesign name="picture" size={100} color="grey" />
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
          <Entypo name="location-pin" size={24} color="#55c7aa" />
          <Text style={styles.distanceText}>{item.distance} km</Text>
        </View>
      </View>
    </CustomButton>
  );
}

const styles = StyleSheet.create({
  item: {
    flex: 1,
    margin: 10,
    height: 270,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    position: "relative",
    backgroundColor: "white",
  },
  cover: {
    width: "100%",
    height: 150,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
    overflow: "hidden",
    shadowColor: "#000",
  },
  titleText: {
    marginTop: 5,
    fontSize: 17,
    fontWeight: "bold",
    textAlign: "center",
    padding: 5,
    fontFamily: "SecularOne_400Regular",
  },
  authorText: {
    fontSize: 15,
    textAlign: "center",
    fontFamily: "Molengo_400Regular",
  },
  distanceContainer: {
    position: "absolute",
    bottom: 0,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    padding: 5,
  },
  distanceText: {
    fontSize: 14,
    fontFamily: "SecularOne_400Regular",
  },
});
