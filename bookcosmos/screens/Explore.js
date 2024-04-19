import { Text, View, FlatList, ActivityIndicator } from "react-native";
import React, { useState, useEffect } from "react";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { auth, database } from "../firebase-files/firebaseSetup";
import { doc, getDoc } from "firebase/firestore";
import { CustomInput } from "../components/InputHelper";
import ExploreBookCard from "../components/ExploreBookCard";
import * as Location from "expo-location";
import { calculateDistance } from "../utils/Utils";
import { useCustomFonts } from "../hooks/UseFonts";
import { activityIndicatorStyles } from "../styles/CustomStyles";
import { exploreStyles } from "../styles/ScreenStyles";

// Explore component to display the books available for exchange
export default function Explore({ navigation }) {
  const [books, setBooks] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [isLoading, setLoading] = useState(true);
  const [userLocation, setUserLocation] = useState(null);
  const styles = exploreStyles;
  const { fontsLoaded } = useCustomFonts();
  if (!fontsLoaded) {
    return null;
  }

  // Get the user's location
  useEffect(() => {
    async function getUserLocation() {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.log("Permission to access location was denied");
        return;
      }
      let location = await Location.getCurrentPositionAsync();
      setUserLocation(location.coords);
    }
    getUserLocation();
  }, []);

  useEffect(() => {
    if (!userLocation) return; // Only proceed if userLocation is available
    const fetchBooks = () => {
      setLoading(true);
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
            const distance = calculateDistance(
              userLocation.latitude,
              userLocation.longitude,
              book.location.latitude,
              book.location.longitude
            );
            return { ...book, ownerName, distance };
          });

          const booksWithOwnerName = await Promise.all(promises);
          const sortedBooks = booksWithOwnerName.sort(
            (a, b) => a.distance - b.distance
          );
          setBooks(sortedBooks);
          setLoading(false);
        });
        return unsubscribe;
      } catch (error) {
        console.error("Error fetching books:", error);
      }
    };

    const unsubscribe = fetchBooks();

    return () => unsubscribe();
  }, [searchKeyword, userLocation]);

  // Function to get the owner name from the database by ownerId
  const getOwnerName = async (ownerId) => {
    setLoading(true);
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
    } finally {
      setLoading(false);
    }
  };
  //console.log(books);

  return (
    <View style={styles.container}>
      <View style={styles.search}>
        <CustomInput
          placeholder="Search books by name"
          onChangeText={(text) => setSearchKeyword(text)}
        />
      </View>
      {isLoading ? (
        <ActivityIndicator
          size={activityIndicatorStyles.size}
          color={activityIndicatorStyles.color}
          style={activityIndicatorStyles.style}
        />
      ) : books.length > 0 ? (
        <FlatList
          data={books}
          renderItem={({ item }) => <ExploreBookCard item={item} />}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
        />
      ) : (
        <Text style={styles.noResultsText}>No books available</Text>
      )}
    </View>
  );
}
