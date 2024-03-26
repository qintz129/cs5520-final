import { StyleSheet, Text, View, FlatList } from "react-native";
import React, { useEffect, useState } from "react";
import { database } from "../firebase-files/firebaseSetup";
import { collection, onSnapshot, query } from "firebase/firestore";
import { convertTimestamp } from "../Utils";
import ReviewCard from "../components/ReviewCard";

export default function Reviews({ userId }) {
  const [reviews, setReviews] = useState([]);
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
        // console.log(newArray);
        //updating the goals array with the new array
        const updatedArray = newArray.map((item) => ({
          ...item,
          date: convertTimestamp(item.date),
        }));
        setReviews(updatedArray);
      },
      (error) => {
        console.log(error.message);
      }
    );
    return () => {
      unsubscribe();
    };
  }, []);

  console.log(reviews);
  return (
    <View>
      <FlatList
        data={reviews}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <ReviewCard review={item} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({});
