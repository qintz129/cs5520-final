import { StyleSheet, Text, View, FlatList, Alert } from "react-native";
import React, { useState, useEffect } from "react";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { database } from "../firebase-files/firebaseSetup";
import {
  getAllDocs,
  deleteBookFromDB,
} from "../firebase-files/firestoreHelper";
import Swipeable from "react-native-gesture-handler/Swipeable";
import CustomButton from "../components/CustomButton";
import { FontAwesome } from "@expo/vector-icons";

export default function Library({ navigation, userId, isMyLibrary }) {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    let booksQuery;
    // Define the query to fetch books for a specific user
    if (isMyLibrary) {
      booksQuery = query(
        collection(database, "books"),
        where("owner", "==", userId)
      );
    } else {
      booksQuery = query(
        collection(database, "books"),
        where("owner", "==", userId),
        where("isBookInExchange", "==", false)
      );
    }

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
      Alert.alert(
        "Delete Book",
        "Are you sure you want to delete this book?",
        [
          {
            text: "Cancel",
            style: "cancel",
          },
          {
            text: "Delete",
            onPress: async () => {
              // Call the deleteBookFromDB function to delete the book from the database
              await deleteBookFromDB(item.id);

              // After successful deletion, fetch the updated list of books from the database
              const updatedBooksData = await getAllDocs("books");
              setBooks(updatedBooksData);
            },
          },
        ],
        { cancelable: true }
      );
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
          {item.isBookInExchange && (
            <FontAwesome name="exchange" size={24} color="red" />
          )}
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
