import { StyleSheet, Text, View, FlatList } from "react-native";
import React, { useState, useEffect } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { database } from "../firebase-files/firebaseSetup";
import {
  getAllDocs,
  deleteBookFromDB,
} from "../firebase-files/firestoreHelper";
import Swipeable from "react-native-gesture-handler/Swipeable";
import CustomButton from "../components/CustomButton";

export default function Library({ navigation }) {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    // Define the books collection reference
    const booksCollection = collection(database, "books");

    // Subscribe to the query
    const unsubscribe = onSnapshot(booksCollection, (snapshot) => {
      const fetchedBooks = [];
      snapshot.forEach((doc) => {
        fetchedBooks.push({ id: doc.id, ...doc.data() });
      });
      // Update the state variable with the fetched books
      setBooks(fetchedBooks);
    });

    // Clean up the subscription when the component unmounts
    return () => unsubscribe();
  }, []);

  const handleDeleteItem = async (item) => {
    try {
      // Call the deleteBookFromDB function to delete the book from the database
      await deleteBookFromDB(item.id);

      // After successful deletion, fetch the updated list of books from the database
      const updatedBooksData = await getAllDocs("books");
      setBooks(updatedBooksData);
    } catch (error) {
      console.error("Error deleting book:", error);
    }
  };

  const renderItem = ({ item }) => (
    <Swipeable
      renderRightActions={() => (
        <CustomButton
          style={styles.deleteButton}
          onPress={() => handleDeleteItem(item)}
        >
          <Text style={styles.deleteButtonText}>Delete</Text>
        </CustomButton>
      )}
    >
      <View style={styles.item}>
        <CustomButton
          onPress={() =>
            navigation.navigate("Add A Book", {
              editMode: true,
              bookId: item.id,
            })
          }
        >
          {item.bookName && <Text>Name: {item.bookName}</Text>}
          {item.author && <Text>Author: {item.author}</Text>}
        </CustomButton>
      </View>
    </Swipeable>
  );

  return (
    <View style={styles.container}>
      {books.length > 0 && (
        <FlatList
          data={books}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  item: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
});
