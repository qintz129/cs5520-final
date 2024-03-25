import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, TextInput, Button } from "react-native";
import {
  getAllDocs,
  writeUserBooksToDB,
  updateBookInDB,
} from "../firebase-files/firestoreHelper";
import { database } from "../firebase-files/firebaseSetup";
import { doc, getDoc } from "firebase/firestore";

export default function AddABook({ navigation, route }) {
  const [bookName, setBookName] = useState("");
  const [author, setAuthor] = useState("");
  const [description, setDescription] = useState("");
  const { editMode, bookId } = route.params;

  // Render the header based on the edit mode
  useEffect(() => {
    navigation.setOptions({
      title: editMode ? "Edit Book" : "Add A Book",
    });
  }, [editMode]);

  // If the edit mode is true, fetch the book from the database
  useEffect(() => {
    if (editMode) {
      // Fetch the book data from the database
      const fetchBookData = async () => {
        try {
          const docRef = doc(database, "books", bookId);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const bookData = docSnap.data();
            setBookName(bookData.bookName);
            setAuthor(bookData.author);
            setDescription(bookData.description);
          } else {
            console.error("No such document!");
          }
        } catch (error) {
          console.error("Error fetching book data:", error);
        }
      };
      fetchBookData();
    }
  }, [editMode, bookId]);

  const handleSave = async () => {
    try {
      // Ensure all fields are filled before saving
      if (!bookName || !author || !description) {
        alert("Please fill in all fields");
        return;
      }

      if (editMode) {
        const updatedBookData = {
          bookName,
          author,
          description,
        };
        await updateBookInDB(bookId, updatedBookData);
      } else {
        // Create a new book data object
        const newBookData = {
          bookName,
          author,
          description,
        };

        // Write book data to the database
        await writeUserBooksToDB(newBookData);
      }
      // Navigate back to the previous screen
      navigation.goBack();
    } catch (error) {
      console.error("Error saving book:", error);
    }
  };

  const handleClear = () => {
    // Clear all input fields
    setBookName("");
    setAuthor("");
    setDescription("");
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Book Name"
        value={bookName}
        onChangeText={setBookName}
      />
      <TextInput
        style={styles.input}
        placeholder="Author"
        value={author}
        onChangeText={setAuthor}
      />
      <TextInput
        style={styles.input}
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
      />
      <View style={styles.buttonContainer}>
        <Button title="Clear" onPress={handleClear} />
        <Button title="Save" onPress={handleSave} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    width: "100%",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginTop: 20,
  },
});
