import { StyleSheet, Text, View } from "react-native";
import React, { useState, useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";
import { database } from "../firebase-files/firebaseSetup";
import CustomButton from "../components/CustomButton";

export default function BookDetail({ route, navigation }) {
  const [bookName, setBookName] = useState("");
  const [author, setAuthor] = useState("");
  const [description, setDescription] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const { bookId, ownerId } = route.params;

  useEffect(() => {
    let bookData;
    // Fetch the book data from the database by bookId
    const fetchBookData = async () => {
      try {
        // Fetch the book data from the database
        const docRef = doc(database, "books", bookId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          bookData = docSnap.data();
          setBookName(bookData.bookName);
          setAuthor(bookData.author);
          setDescription(bookData.description);

          await fetchOwnerName(bookData.owner);
        } else {
          console.error("No such document!");
        }
      } catch (error) {
        console.error("Error fetching book data:", error);
      }
    };

    const fetchOwnerName = async () => {
      try {
        const docRef = doc(database, "users", bookData.owner);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const userData = docSnap.data();
          setOwnerName(userData.name);
        } else {
          setOwnerName("Unknown");
        }
      } catch (error) {
        console.error("Error fetching owner name:", error);
        setOwnerName("Unknown");
      }
    };
    fetchBookData();
  }, [bookId]);

  return (
    <View style={styles.container}>
      <Text>Book Name: {bookName}</Text>
      <Text>Author: {author}</Text>
      <Text>Description: {description}</Text>
      <View style={styles.userContainer}>
        <CustomButton
          onPress={() =>
            navigation.navigate("Other User Profile", {
              ownerId: ownerId,
              ownerName: ownerName,
            })
          }
        >
          <Text>User: {ownerName}</Text>
        </CustomButton>
      </View>
      <View style={styles.buttonContainer}>
        <CustomButton>
          <Text>Send Request</Text>
        </CustomButton>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: "center",
  },
});
