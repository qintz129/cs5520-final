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
import { doc, getDoc } from "firebase/firestore";
import CustomButton from "../components/CustomButton";
import { CustomInput } from "../components/InputHelper";
import ExploreBookCard from "../components/ExploreBookCard";
import * as Location from "expo-location";

// Explore component to display the books available for exchange
export default function Explore({ navigation }) {
  const [books, setBooks] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [isLoading, setLoading] = useState(true);
  const [userLocation, setUserLocation] = useState(null);

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
      setLoading(false);
    }
    getUserLocation();
  }, []);

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
            if (!userLocation)
              return { ...book, ownerName, distance: "loading..." };
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

  // Function to calculate the distance between two locations using Haversine formula
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) *
        Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Distance in km
    return distance.toFixed(1);
  };

  const deg2rad = (deg) => {
    return deg * (Math.PI / 180);
  };

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
              renderItem={({ item }) => <ExploreBookCard item={item} />}
              keyExtractor={(item) => item.id.toString()}
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
  search: {
    padding: 10,
    width: "100%",
    alignItems: "center",
  },
});
