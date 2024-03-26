import { View, Text, TextInput, StyleSheet, Keyboard } from "react-native";
import React, { useState, useEffect } from "react";
import { AirbnbRating } from "react-native-ratings";
import CustomButton from "../components/CustomButton";
import { useRoute } from "@react-navigation/native";
import { writeToDB } from "../firebase-files/firestoreHelper";
import { database, auth } from "../firebase-files/firebaseSetup";
import { getDoc, doc } from "firebase/firestore";

export default function AddReview({ navigation }) {
  const [reviewer, setReviewer] = useState("");
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
  const { reviewee } = route.params;

  const ratingCompleted = (rate) => {
    setRating(rate);
  };

  const handleSubmit = () => {
    const newReview = {
      rating: rating,
      comment: comment,
      reviewerId: auth.currentUser.uid,
      reviewerName: reviewer,
      revieweeId: reviewee,
      date: new Date().toISOString(),
    };
    console.log(newReview);
    writeToDB(newReview, "users", reviewee, "reviews");
    Keyboard.dismiss();
    navigation.goBack();
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
      <TextInput
        style={styles.input}
        onChangeText={setComment}
        value={comment}
        placeholder="Write your comment here..."
        multiline
      />
      <View style={styles.buttonContainer}>
        <CustomButton onPress={handleSubmit}>
          <Text>Submit</Text>
        </CustomButton>
        <CustomButton onPress={handleClear}>
          <Text>Clear</Text>
        </CustomButton>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    padding: 20,
  },
  header: {
    fontSize: 18,
    marginBottom: 20,
  },
  input: {
    width: "100%",
    borderColor: "gray",
    borderWidth: 1,
    marginTop: 20,
    padding: 10,
    borderRadius: 5,
    minHeight: 100,
    textAlignVertical: "top",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginTop: 20,
  },
});