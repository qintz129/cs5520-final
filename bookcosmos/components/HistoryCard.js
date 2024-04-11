import { StyleSheet, Text, View, Image } from "react-native";
import React, { useState, useEffect } from "react";
import CustomButton from "./CustomButton";
import { storage } from "../firebase-files/firebaseSetup";
import { ref, getDownloadURL } from "firebase/storage";
import { AntDesign } from "@expo/vector-icons";

// HistoryCard component to display the history of exchanges
export default function HistoryCard({
  myBook,
  theirBook,
  date,
  navigation,
  reviewee,
  reviewer,
  exchangeId,
  isReviewed,
}) {
  const [myBookAvatar, setMyBookAvatar] = useState(null);
  const [theirBookAvatar, setTheirBookAvatar] = useState(null);

  useEffect(() => {
    if (myBook.image) {
      const imageRef = ref(storage, myBook.image);
      getDownloadURL(imageRef)
        .then((url) => {
          setMyBookAvatar(url);
        })
        .catch((error) => {
          console.error("Failed to load image:", error);
        });
    }
  }, [myBook.image]);

  useEffect(() => {
    if (theirBook.image) {
      const imageRef = ref(storage, theirBook.image);
      getDownloadURL(imageRef)
        .then((url) => {
          setTheirBookAvatar(url);
        })
        .catch((error) => {
          console.error("Failed to load image:", error);
        });
    }
  }, [theirBook.image]);

  // Function to handle the review button
  const handleReview = () => {
    navigation.navigate("Add A Review", {
      reviewee: reviewee,
      exchangeId: exchangeId,
    });
  };

  console.log(isReviewed);

  return (
    <View style={styles.container}>
      <Text>{date}</Text>
      <View style={styles.books}>
        <View style={styles.bookItem}>
          <Text>My book:</Text>
          {myBookAvatar ? (
            <Image source={{ uri: myBookAvatar }} style={styles.image} />
          ) : (
            <AntDesign name="picture" size={50} color="grey" />
          )}
          <Text>{myBook.bookName}</Text>
        </View>
        <View style={styles.bookItem}>
          <Text>Their book:</Text>
          {theirBookAvatar ? (
            <Image source={{ uri: theirBookAvatar }} style={styles.image} />
          ) : (
            <AntDesign name="picture" size={50} color="grey" />
          )}
          <Text>{theirBook.bookName}</Text>
        </View>
      </View>
      <CustomButton onPress={handleReview} disabled={isReviewed}>
        <Text>{isReviewed ? "Reviewed" : "Review"}</Text>
      </CustomButton>
    </View>
  );
}

const styles = StyleSheet.create({
  books: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  bookItem: {
    width: "45%",
    alignItems: "center",
  },
  image: {
    width: 70,
    height: 70,
    borderRadius: 10,
  },
  container: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    backgroundColor: "#fff",
    borderRadius: 8,
    margin: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 1.41,
    elevation: 2,
  },
});
