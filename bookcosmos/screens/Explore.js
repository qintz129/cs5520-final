import { StyleSheet, Text, View, FlatList } from "react-native";
import React, { useState, useEffect } from "react";
import {
  collection,
  onSnapshot,
  query,
  orderBy,
  startAt,
  endAt,
} from "firebase/firestore";
import { database } from "../firebase-files/firebaseSetup";
import { doc, getDoc } from "firebase/firestore";
import CustomButton from "../components/CustomButton";
import CustomInput from "../components/CustomInput";

export default function Explore({ navigation }) {
  const [books, setBooks] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState("");

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        // Define the books collection reference
        const booksCollection = collection(database, "books");

        // Define the query
        let booksQuery = query(booksCollection);

        // If there's a search keyword, filter by bookName or author
        if (searchKeyword) {
          // Filter by bookName or author matching the lowercase searchKeyword
          booksQuery = query(
            booksCollection,
            orderBy("bookName"),
            startAt(searchKeyword),
            endAt(searchKeyword + "\uf8ff")
          );
        }

        // Subscribe to the query
        const unsubscribe = onSnapshot(booksQuery, async (snapshot) => {
          const fetchedBooks = [];
          const promises = snapshot.docs.map(async (doc) => {
            const bookData = doc.data();
            const ownerName = await getOwnerName(bookData.owner);
            fetchedBooks.push({ id: doc.id, ...bookData, ownerName });
          });
          await Promise.all(promises);
          // Update the state variable with the fetched books
          setBooks(fetchedBooks);
        });

        // Clean up the subscription when the component unmounts
        return () => unsubscribe();
      } catch (error) {
        console.error("Error fetching books:", error);
      }
    };

    fetchBooks();
  }, [searchKeyword, books]);

  const getOwnerName = async (ownerId) => {
    try {
      const userDoc = doc(database, "users", ownerId);
      const userSnap = await getDoc(userDoc);
      if (userSnap.exists()) {
        const userData = userSnap.data();
        return userData.name;
      } else {
        return "Unknown";
      }
    } catch (error) {
      console.error("Error fetching owner name:", error);
      return "Unknown";
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <CustomButton
        onPress={() =>
          navigation.navigate("Book Detail", {
            bookId: item.id,
            ownerId: item.owner,
          })
        }
      >
        {item.bookName && <Text>Book Name : {item.bookName}</Text>}
        {item.author && <Text>Author: {item.author}</Text>}
        {item.owner && <Text>User: {item.ownerName}</Text>}
      </CustomButton>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.search}>
        <CustomInput
          placeholder="Search books by name"
          onChangeText={(text) => setSearchKeyword(text)}
        />
      </View>
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
  search: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
});
