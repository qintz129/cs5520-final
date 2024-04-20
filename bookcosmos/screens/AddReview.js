import { View, Text, ActivityIndicator, Keyboard, Alert } from "react-native";
import React, { useState, useEffect } from "react";
import { AirbnbRating } from "react-native-ratings";
import CustomButton from "../components/CustomButton";
import { MultilineInput } from "../components/InputHelper";
import { useRoute } from "@react-navigation/native";
import { writeToDB, updateToDB } from "../firebase-files/firestoreHelper";
import { database, auth } from "../firebase-files/firebaseSetup";
import { getDoc, doc } from "firebase/firestore";
import { useCustomFonts } from "../hooks/UseFonts";
import { COLORS } from "../styles/Colors";
import { addReviewStyles } from "../styles/ScreenStyles";

export default function AddReview({ navigation }) {
  const [reviewer, setReviewer] = useState("");
  const [isSubmitLoading, setIsSubmitLoading] = useState(false);
  const styles = addReviewStyles;
  const { fontsLoaded } = useCustomFonts();
  if (!fontsLoaded) {
    return null;
  }

  useEffect(() => {
    const getUserInfo = async () => {
      try {
        console.log(auth.currentUser.uid);
        const docRef = doc(database, "users", auth.currentUser.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setReviewer(docSnap.data().name);
        } else {
          console.log("No such document!");
        }
      } catch (err) {
        console.log(err);
      }
    };
    getUserInfo();
  }, []);

  const route = useRoute();
  const [rating, setRating] = useState(3);
  const [comment, setComment] = useState("");
  const [key, setKey] = useState(0);
  const { reviewee, exchangeId } = route.params;

  const ratingCompleted = (rate) => {
    setRating(rate);
  };

  const handleSubmit = async () => {
    const newReview = {
      rating: rating,
      comment: comment,
      reviewerId: auth.currentUser.uid,
      reviewerName: reviewer,
      revieweeId: reviewee,
      date: new Date().toISOString(),
      exchangeId: exchangeId,
    };

    try {
      Alert.alert("Confirm", "Are you sure you want to submit this review?", [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Confirm",
          onPress: async () => {
            setIsSubmitLoading(true);
            // Write the review to the database
            await writeToDB(newReview, "users", reviewee, "reviews");
            console.log("Review submitted successfully");

            // Update the isReviewed field to True in the history
            await updateToDB(
              exchangeId,
              "users",
              auth.currentUser.uid,
              "history",
              {
                isReviewed: true,
              }
            );
            Keyboard.dismiss();
            Alert.alert("The review has been submitted successfully!");
            navigation.goBack();
          },
        },
      ]);
    } catch (error) {
      console.error("Error submitting review:", error);
    } finally {
      setIsSubmitLoading(false);
    }
  };

  const handleClear = () => {
    // Clear all input fields
    setComment("");
    setRating(3);
    setKey((prevKey) => prevKey + 1);
    Keyboard.dismiss();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Leave a Review for Your Book Partner</Text>
      <AirbnbRating key={key} onFinishRating={ratingCompleted} />
      <MultilineInput
        title="Comment"
        value={comment}
        onChangeText={setComment}
        placeholder="Write your comment here..."
      />
      <View style={styles.buttonContainer}>
        <CustomButton customStyle={styles.clearButton} onPress={handleClear}>
          <Text style={styles.buttonText}>Clear</Text>
        </CustomButton>
        <CustomButton customStyle={styles.submitButton} onPress={handleSubmit}>
          {isSubmitLoading ? (
            <ActivityIndicator color={COLORS.white} />
          ) : (
            <Text style={styles.buttonText}>Submit</Text>
          )}
        </CustomButton>
      </View>
    </View>
  );
}
