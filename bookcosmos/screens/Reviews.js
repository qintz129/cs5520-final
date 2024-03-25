import { StyleSheet, Text, View } from 'react-native'
import React, {useEffect, useState} from 'react'  
import {database, auth} from "../firebase-files/firebaseSetup"; 
import { collection, onSnapshot, query} from "firebase/firestore";

export default function Reviews() {  
 const [reviews, setReviews] = useState([]);
  useEffect(() => { 
    const q = query(collection(database, "users", auth.currentUser.uid, "reviews"));
    const unsubscribe = onSnapshot(
      q, (querySnapshot) => {
        let newArray = [];
        querySnapshot.forEach((doc) => {
          // update this to also add id of doc to the newArray
          newArray.push({ ...doc.data(), id: doc.id });
          // store this data in a new array
        });
        // console.log(newArray);
        //updating the goals array with the new array
        setReviews(newArray);
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
      <Text>Reviews</Text>
    </View>
  )
}

const styles = StyleSheet.create({})