import { Text, View, Image } from "react-native";
import React, { useState, useEffect } from "react";
import CustomButton from "./CustomButton";
import { storage, database } from "../firebase-files/firebaseSetup";
import { ref, getDownloadURL } from "firebase/storage";
import { AntDesign } from "@expo/vector-icons";
import { useCustomFonts } from "../hooks/UseFonts";
import { doc, getDoc } from "firebase/firestore";
import { COLORS } from "../styles/Colors";
import { historyCardStyles } from "../styles/ComponentStyles";

// HistoryCard component to display the history of exchanges
export default function HistoryCard({
  myBook,
  theirBook,
  date,
  navigation,
  reviewee,
  exchangeId,
  isReviewed,
  status,
}) {
  const [myBookData, setMyBookData] = useState([]);
  const [theirBookData, setTheirBookData] = useState([]);
  const [myBookAvatar, setMyBookAvatar] = useState(null);
  const [theirBookAvatar, setTheirBookAvatar] = useState(null);
  const styles = historyCardStyles;
  const { fontsLoaded } = useCustomFonts();
  if (!fontsLoaded) {
    return null;
  }

  // Fetch books data from the database
  useEffect(() => {
    const fetchBooksData = async () => {
      try {
        const myBookDocRef = doc(database, "books", myBook);
        const theirBookDocRef = doc(database, "books", theirBook);

        const myBookSnapshot = await getDoc(myBookDocRef);
        const theirBookSnapshot = await getDoc(theirBookDocRef);

        if (myBookSnapshot.exists()) {
          setMyBookData(myBookSnapshot.data());
        }

        if (theirBookSnapshot.exists()) {
          setTheirBookData(theirBookSnapshot.data());
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchBooksData();
  }, [myBook, theirBook]);
  
  // Load the images of the books from firebase storage
  useEffect(() => {
    if (myBookData.image) {
      const imageRef = ref(storage, myBookData.image);
      getDownloadURL(imageRef)
        .then((url) => {
          setMyBookAvatar(url);
        })
        .catch((error) => {
          console.error("Failed to load image:", error);
        });
    }
  }, [myBookData.image]);
  
  // Load their book image
  useEffect(() => {
    if (theirBookData.image) {
      const imageRef = ref(storage, theirBookData.image);
      getDownloadURL(imageRef)
        .then((url) => {
          setTheirBookAvatar(url);
        })
        .catch((error) => {
          console.error("Failed to load image:", error);
        });
    }
  }, [theirBookData.image]);

  // Function to handle the review button
  const handleReview = () => {
    navigation.navigate("Add A Review", {
      reviewee: reviewee,
      exchangeId: exchangeId,
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.dateContainer}>
        <Text style={styles.dateText}>{date}</Text>
      </View>
      <View style={styles.books}>
        <View style={styles.bookItem}>
          <Text style={styles.myBookText}>My book</Text>
          {myBookAvatar ? (
            <Image source={{ uri: myBookAvatar }} style={styles.image} />
          ) : (
            <AntDesign
              name="picture"
              size={styles.pictureIconSize}
              color={COLORS.grey}
            />
          )}
          <Text style={styles.bookNameText}>{myBookData.bookName}</Text>
        </View>
        <View style={styles.bookItem}>
          <Text style={styles.theirBookText}>Their book</Text>
          {theirBookAvatar ? (
            <Image source={{ uri: theirBookAvatar }} style={styles.image} />
          ) : (
            <AntDesign
              name="picture"
              size={styles.pictureIconSize}
              color={COLORS.grey}
            />
          )}
          <Text style={styles.bookNameText}>{theirBookData.bookName}</Text>
        </View>
      </View>
      <View style={styles.bottomView}>
        {status === "completed" ? (
          <CustomButton
            customStyle={styles.reviewButton}
            onPress={handleReview}
            disabled={isReviewed}
          >
            <Text style={isReviewed ? styles.reviewedText : styles.reviewText}>
              {isReviewed ? "Reviewed" : "Review"}
            </Text>
          </CustomButton>
        ) : (
          <Text style={styles.rejectedText}>Rejected</Text>
        )}
      </View>
    </View>
  );
}
