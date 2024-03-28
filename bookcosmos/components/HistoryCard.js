import { StyleSheet, Text, View } from "react-native";
import React, { useState, useEffect } from "react";
import CustomButton from "./CustomButton";
import { collection, query, where, getDocs } from "firebase/firestore";
import { database } from "../firebase-files/firebaseSetup";

export default function HistoryCard({
  myBook,
  theirBook,
  date,
  navigation,
  reviewee,
  reviewer, 
  exchangeId
}) {
  const [isSubmit, setIsSubmit] = useState(false); 
  const handleReview = () => {
    navigation.navigate("Add A Review", {
      reviewee: reviewee, 
      exchangeId: exchangeId, 
      onReviewSubmitted: () => setIsSubmit(true),
    });
  };
  useEffect(() => { 
    const fetchReviews = async () => {
      const reviewsRef = collection(database, "users", reviewee, "reviews");
      const q = query(reviewsRef, where("exchangeId", "==", exchangeId));
      try {
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          setIsSubmit(true);
        }
      } catch (err) {
        console.error("Error fetching reviews:", err);
      }
    }; 
  try {
    fetchReviews(); 
  } catch (error) { 
    console.error("Error fetching reviews:", error); 
  }
  }, [exchangeId, reviewee]);  
  return (
    <View style={styles.container}>
        <Text>{date}</Text>
      <View style={styles.books}> 
       <View style={styles.bookItem}>
        <Text>My book:</Text>
         <Text>{myBook}</Text> 
        </View>
        <View style={styles.bookItem}>
        <Text>Their book:</Text>
         <Text>{theirBook}</Text> 
        </View>
      </View> 
        <CustomButton onPress={handleReview} disabled={isSubmit}>
          <Text>{isSubmit ? "Reviewed" : "Review"}</Text>
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
  container: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    backgroundColor: '#fff',
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
