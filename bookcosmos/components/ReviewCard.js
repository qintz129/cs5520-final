import React from "react";
import { View, Text } from "react-native";
import { Rating } from "react-native-ratings";
import { useCustomFonts } from "../hooks/UseFonts";
import { reviewCardStyles } from "../styles/ComponentStyles";

// ReviewCard component to display a review
export default function ReviewCard({ review }) {
  const styles = reviewCardStyles;
  const { fontsLoaded } = useCustomFonts();
  if (!fontsLoaded) {
    return null;
  }

  return (
    <View style={styles.card}>
      <Rating
        readonly
        startingValue={review.rating}
        imageSize={styles.ratingImageSize}
        style={styles.rating}
      />
      <View style={styles.header}>
        <Text style={styles.reviewerName}>{review.reviewerName}</Text>
        <Text style={styles.date}>{review.date}</Text>
      </View>
      <Text style={styles.comment}>{review.comment}</Text>
    </View>
  );
}
