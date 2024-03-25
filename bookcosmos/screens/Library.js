import { StyleSheet, Text, View, FlatList } from "react-native";
import React, { useState, useEffect, useRef } from "react";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { database } from "../firebase-files/firebaseSetup";
import {
  getAllDocs,
  deleteBookFromDB,
} from "../firebase-files/firestoreHelper";
import Swipeable from "react-native-gesture-handler/Swipeable";
import CustomButton from "../components/CustomButton";

export default function Library({ navigation, userId, isMyLibrary }) {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    // Define the query to fetch books for a specific user
    const booksQuery = query(
      collection(database, "books"),
      where("owner", "==", userId)
    );

    // Subscribe to the query
    const unsubscribe = onSnapshot(booksQuery, (snapshot) => {
      const fetchedBooks = [];
      snapshot.forEach((doc) => {
        fetchedBooks.push({ id: doc.id, ...doc.data() });
      });
      // Update the state variable with the fetched books
      setBooks(fetchedBooks);
    });

    // Clean up the subscription when the component unmounts
    return () => unsubscribe();
  }, [userId]);

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

  const handlePressBook = (item) => {
    if (isMyLibrary) {
      navigation.navigate("Add A Book", { editMode: true, bookId: item.id });
    } else {
      navigation.navigate("Book Detail", {
        bookId: item.id,
        ownerId: item.owner,
      });
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
        <CustomButton onPress={() => handlePressBook(item)}>
          {item.bookName && <Text>{item.bookName}</Text>}
          {item.author && <Text>{item.author}</Text>}
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
