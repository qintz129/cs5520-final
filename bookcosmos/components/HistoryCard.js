import { StyleSheet, Text, View } from "react-native";
import React, { useState, useEffect } from "react";
import CustomButton from "./CustomButton";

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
          <Text>{myBook}</Text>
        </View>
        <View style={styles.bookItem}>
          <Text>Their book:</Text>
          <Text>{theirBook}</Text>
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
