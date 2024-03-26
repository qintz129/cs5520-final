import { StyleSheet, Text, View } from "react-native";
import React, { useState, useEffect } from "react";
import CustomButton from "./CustomButton";
import { collection, query, where, getDocs } from "firebase/firestore";
import { database } from "../firebase-files/firebaseSetup";

export default function HistoryCard({
  myBook,
  theirBook,
  date,
  status,
  navigation,
  reviewee,
  reviewer,
}) {
  const [isSubmit, setIsSubmit] = useState(false);
  const handleReview = () => {
    navigation.navigate("Add A Review", {
      reviewee: reviewee,
    });
  };
  useEffect(() => {
    const fetchReviews = async () => {
      console.log("reviewee", reviewee);
      console.log("reviewer", reviewer);
      const reviewsRef = collection(database, "users", reviewee, "reviews");
      const q = query(reviewsRef, where("reviewerId", "==", reviewer));
      try {
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          setIsSubmit(true);
        }
      } catch (err) {
        console.error("Error fetching reviews:", err);
      }
    };
    fetchReviews();
  }, []);
  return (
    <View style={styles.container}>
      <View style={styles.status}>
        <Text>{date}</Text>
        <Text>{status}</Text>
      </View>
      <View style={styles.books}>
        <Text>My book: {myBook}</Text>
        <Text>Their book: {theirBook}</Text>
      </View>
      {status === "completed" && (
        <CustomButton onPress={handleReview} disabled={isSubmit}>
          <Text>{isSubmit ? "Reviewed" : "Review"}</Text>
        </CustomButton>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  status: {},
  books: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  container: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
});
