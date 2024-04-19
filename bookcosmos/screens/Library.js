import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Alert,
  ActivityIndicator,
} from "react-native";
import React, { useState, useEffect, useCallback } from "react";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { database } from "../firebase-files/firebaseSetup";
import { deleteFromDB } from "../firebase-files/firestoreHelper";
import BookCard from "../components/BookCard";
import { useCustomFonts } from "../Fonts";

// Library component to display the books in the library
export default function Library({ navigation, userId, isMyLibrary }) {
  const [books, setBooks] = useState([]);
  const { fontsLoaded } = useCustomFonts();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let booksQuery;
    // Define the query to fetch books for my profile
    if (isMyLibrary) {
      booksQuery = query(
        collection(database, "books"),
        where("owner", "==", userId)
      );
    } else {
      // Define the query to fetch books for others' profiles
      booksQuery = query(
        collection(database, "books"),
        where("owner", "==", userId),
        where("bookStatus", "==", "free")
      );
    }

    // Subscribe to the query
    const unsubscribe = onSnapshot(
      booksQuery,
      (snapshot) => {
        const fetchedBooks = [];
        snapshot.forEach((doc) => {
          fetchedBooks.push({ id: doc.id, ...doc.data() });
        });

        const filterBooks = fetchedBooks.filter(
          (book) => book.bookStatus !== "completed"
        );
        // Sort the fetched books by book name
        filterBooks.sort((a, b) => a.bookName.localeCompare(b.bookName));
        // Update the state variable with the fetched books
        setBooks(filterBooks);
        setIsLoading(false);
      },
      (error) => {
        console.error("Error fetching books:", error);
      }
    );

    // Clean up the subscription when the component unmounts
    return () => unsubscribe();
  }, [userId]);

  console.log("books: ", books);

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
              await deleteFromDB(item.id, "books", null, null);
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
      navigation.navigate("Add A Book", {
        editMode: true,
        bookId: item.id,
      });
    } else {
      console.log("item: ", item);
      navigation.navigate("Book Detail", {
        bookId: item.id,
        ownerId: item.owner,
      });
    }
  };

  return (
    <View style={styles.container}>
      {isLoading ? (
        <ActivityIndicator
          size="large"
          color="#55c7aa"
          style={{ marginTop: 20 }}
        />
      ) : books.length === 0 ? (
        <View>
          <Text style={styles.emptyLibraryText}>Library is empty</Text>
        </View>
      ) : (
        <FlatList
          data={books}
          renderItem={({ item }) => (
            <BookCard
              item={item}
              isMyLibrary={isMyLibrary}
              handleDeleteItem={handleDeleteItem}
              handlePressBook={handlePressBook}
            />
          )}
          keyExtractor={(item) => item.id.toString()}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  emptyLibraryText: {
    fontSize: 20,
    textAlign: "center",
    marginTop: 20,
    fontFamily: "Molengo_400Regular",
    color: "grey",
  },
});
