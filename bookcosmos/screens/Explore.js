import { StyleSheet, Text, View, FlatList } from "react-native";
import React, { useState, useEffect } from "react";
import {
  collection,
  onSnapshot,
  query,
  orderBy,
  startAt,
  endAt,
  where,
  or,
} from "firebase/firestore";
import { auth, database } from "../firebase-files/firebaseSetup";
import { doc, getDoc, getDocs } from "firebase/firestore";
import CustomButton from "../components/CustomButton";
import CustomInput from "../components/CustomInput";

export default function Explore({ navigation }) {
  const [books, setBooks] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState("");

  useEffect(() => {
    const fetchBooks = () => {
      try {
        const booksCollection = collection(database, "books");
        let booksQuery = booksCollection;

        if (searchKeyword) {
          // Convert the search keyword to lowercase
          const keywordLowerCase = searchKeyword.toLowerCase();

          booksQuery = query(
            booksCollection,
            where("bookNameLower", ">=", keywordLowerCase),
            where("bookNameLower", "<=", keywordLowerCase + "\uf8ff")
          );
        }

        const unsubscribe = onSnapshot(booksQuery, async (querySnapshot) => {
          let fetchedBooks = querySnapshot.docs
            .map((doc) => ({ id: doc.id, ...doc.data() }))
            .filter(
              (book) =>
                book.owner !== auth.currentUser.uid &&
                book.bookStatus === "free"
            );

          const promises = fetchedBooks.map(async (book) => {
            const ownerName = await getOwnerName(book.owner);
            return { ...book, ownerName };
          });

          const booksWithOwnerName = await Promise.all(promises);
          setBooks(booksWithOwnerName);
        });

        return unsubscribe;
      } catch (error) {
        console.error("Error fetching books:", error);
      }
    };

    const unsubscribe = fetchBooks();

    return () => unsubscribe();
  }, [searchKeyword]);

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
  container: {
    flex: 1,
  },
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
