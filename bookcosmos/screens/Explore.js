import {
  StyleSheet,
  Text,
  View,
  FlatList,
  ActivityIndicator,
} from "react-native";
import React, { useState, useEffect } from "react";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { auth, database } from "../firebase-files/firebaseSetup";
import { doc, getDoc} from "firebase/firestore";
import CustomButton from "../components/CustomButton";
import { CustomInput } from "../components/InputHelper";  
import {AntDesign} from '@expo/vector-icons';

// Explore component to display the books available for exchange
export default function Explore({ navigation }) {
  const [books, setBooks] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    const fetchBooks = () => {
      try {
        setLoading(true);
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
          setLoading(false);
        });
        return unsubscribe;
      } catch (error) {
        console.error("Error fetching books:", error);
      }
    };

    const unsubscribe = fetchBooks();

    return () => unsubscribe();
  }, [searchKeyword]);
 
  // Function to get the owner name from the database by ownerId
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
  
  // Function to render each book item
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
        <AntDesign name="picture" size={50} color="black" />
        {item.bookName && <Text>Book Name : {item.bookName}</Text>}
        {item.author && <Text>Author: {item.author}</Text>}
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
      {isLoading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <>
          {books.length > 0 && (
            <FlatList
              data={books}
              renderItem={renderItem}
              keyExtractor={(item, index) => index.toString()} 
              numColumns={2} 
            />
          )}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  item: {
    flex: 1,
    margin: 10,
    maxWidth: '50%',
    height: 200,  // 设定一个固定高度
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1, // 给书本添加轻微的边框
    borderColor: '#ddd', // 边框颜色较浅
    borderRadius: 5, // 轻微的圆角
    shadowColor: '#000', // 阴影颜色
    shadowOffset: { width: 0, height: 2 }, // 阴影方向
    shadowOpacity: 0.25, // 阴影透明度
    shadowRadius: 3.84, // 阴影扩散
    elevation: 5, // Android 上的阴影效果
  },
  search: {
    padding: 10, 
    width: "100%", 
    alignItems: "center"

  },
});
