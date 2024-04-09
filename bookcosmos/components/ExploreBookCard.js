import { StyleSheet, Text, View, Image, Dimensions } from "react-native";
import React, { useState, useEffect } from "react";
import CustomButton from "./CustomButton";
import AntDesign from "react-native-vector-icons/AntDesign";
import { useNavigation } from "@react-navigation/native";
import { storage } from "../firebase-files/firebaseSetup";
import { ref, getDownloadURL } from "firebase/storage";

export default function ExploreBookCard({ item }) {
  const navigation = useNavigation();
  const [bookAvatar, setBookAvatar] = useState(null);
  const screenWidth = Dimensions.get("window").width;
  const bookCardWidth = (screenWidth - 15 * 3) / 2;

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
        <Text style={styles.title}>{item.bookName}</Text>
        <Text style={styles.text}>{item.author}</Text>
      </View>
    </CustomButton>
  );
}

const styles = StyleSheet.create({
  item: {
    flex: 1,
    margin: 10,
    height: 250,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cover: {
    width: "100%",
    height: 150,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
    overflow: "hidden",
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
    padding: 5,
  },
  text: {
    fontSize: 14,
    textAlign: "center",
    padding: 5,
  },
});
