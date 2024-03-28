import { StyleSheet, Text, View, FlatList, Alert } from "react-native";
import React, { useState, useEffect } from "react";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { database } from "../firebase-files/firebaseSetup";
import {
  getAllDocs, 
  deleteFROMDB
} from "../firebase-files/firestoreHelper";
import Swipeable from "react-native-gesture-handler/Swipeable";
import CustomButton from "../components/CustomButton";
import { AntDesign} from "@expo/vector-icons";

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
        where("bookStatus", "==", "free")
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
              await deleteFROMDB(item.id, "books"); 
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

  const renderItem = ({ item }) => {
    // Render the item inside a Swipeable component if it's not in exchange
    if (item.bookStatus ==="free" && isMyLibrary) {
      return (
        <Swipeable
          renderRightActions={() => (
            <CustomButton
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
    } else if (item.bookStatus === "free" && !isMyLibrary) {   
      return (
        <View style={styles.item}>
        <CustomButton onPress={() => handlePressBook(item)}>
          {item.bookName && <Text>{item.bookName}</Text>}
          {item.author && <Text>{item.author}</Text>}
        </CustomButton>
      </View> 
      );
    }
    else if (item.bookStatus === "pending"){
      // Render the item inside a regular View component if it's pending
      return (
        <View style={styles.item}>
          <CustomButton onPress={() => handlePressBook(item)}>
            {item.bookName && <Text>{item.bookName}</Text>}
            {item.author && <Text>{item.author}</Text>}
            <AntDesign name="swapright" size={24} color="red" />
          </CustomButton>
        </View>
      );
    } else if (item.bookStatus === "inExchange"){
      // Render the item inside a regular View component if it's in exchange
      return (
        <View style={styles.item}>
          <CustomButton onPress={() => handlePressBook(item)}>
            {item.bookName && <Text>{item.bookName}</Text>}
            {item.author && <Text>{item.author}</Text>}
            <AntDesign name="swap" size={24} color="red" />
          </CustomButton>
        </View>
      );
    }
  };
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
  container: {
    flex: 1,
  },
  item: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },   
  deleteButtonText: { 
    padding: 10,
  }

});
