import { Text, View, FlatList, ActivityIndicator } from "react-native";
import React, { useEffect, useState } from "react";
import { database } from "../firebase-files/firebaseSetup";
import { collection, onSnapshot, query } from "firebase/firestore";
import { convertTimestamp } from "../utils/Utils";
import ReviewCard from "../components/ReviewCard";
import { useCustomFonts } from "../hooks/UseFonts";
import { activityIndicatorStyles } from "../styles/CustomStyles";
import { reviewsStyles } from "../styles/ScreenStyles";

// Reviews component to display the reviews for a user
export default function Reviews({ userId }) {
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const styles = reviewsStyles;
  const { fontsLoaded } = useCustomFonts();
  if (!fontsLoaded) {
    return null;
  }

  useEffect(() => {
    const q = query(collection(database, "users", userId, "reviews"));
    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        let newArray = [];
        querySnapshot.forEach((doc) => {
          // update this to also add id of doc to the newArray
          newArray.push({ ...doc.data(), id: doc.id });
          // store this data in a new array
        });
        newArray.sort((a, b) => {
          // Convert string timestamps to numerical timestamps and compare
          return Date.parse(b.date) - Date.parse(a.date);
        });
        //updating the goals array with the new array
        const updatedArray = newArray.map((item) => ({
          ...item,
          date: convertTimestamp(item.date),
        }));

        setReviews(updatedArray);
        setIsLoading(false);
      },
      (error) => {
        console.log(error.message);
      }
    );
    return () => {
      unsubscribe();
    };
  }, []);

  //console.log(reviews);
  return (
    <View style={styles.container}>
      {isLoading ? (
        <ActivityIndicator
          size={activityIndicatorStyles.size}
          color={activityIndicatorStyles.color}
          style={activityIndicatorStyles.style}
        />
      ) : reviews.length === 0 ? (
        <Text style={styles.noReviewsText}>No reviews</Text>
      ) : (
        <FlatList
          data={reviews}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <ReviewCard review={item} />}
        />
      )}
    </View>
  );
}
