import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  FlatList,
} from "react-native";
import React, { useState, useEffect } from "react";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import { Ionicons } from "@expo/vector-icons";
import CustomButton from "../components/CustomButton";
import {
  fetchBooksAtLocation,
  getAllDocs,
} from "../firebase-files/firestoreHelper";
import BookCard from "../components/BookCard";
import { useNavigation } from "@react-navigation/native";
import { auth } from "../firebase-files/firebaseSetup";
import { Entypo } from "@expo/vector-icons";
import { calculateDistance } from "../Utils";
import { useCustomFonts } from "../Fonts";

export default function Map() {
  const navigation = useNavigation();
  const [userLocation, setUserLocation] = useState(null);
  const [isLoading, setLoading] = useState(true);
  const [zoomLevel, setZoomLevel] = useState(0);
  const [booksLocations, setBooksLocations] = useState([]);
  const [selectedBooks, setSelectedBooks] = useState(null);
  const [selectedBooksDistance, setSelectedBooksDistance] = useState(null);
  const { fontsLoaded } = useCustomFonts();
  if (!fontsLoaded) {
    return <Text>Loading...</Text>;
  }

  // Get user's location
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

  // Get books' locations
  useEffect(() => {
    const fetchBooksLocations = async () => {
      try {
        const books = await getAllDocs("books");
        const locations = await Promise.all(
          books.map(async (book) => {
            if (book.location === undefined) return null;
            const latitude = book.location.latitude;
            const longitude = book.location.longitude;
            const booksLocation = await fetchBooksAtLocation(
              { latitude, longitude },
              auth.currentUser.uid
            );
            const booksCount = booksLocation ? booksLocation.length : 0;
            const booksAtLocation = booksLocation ? booksLocation : null;
            return {
              latitude,
              longitude,
              booksCount,
              booksAtLocation,
            };
          })
        );
        setBooksLocations(locations);
      } catch (error) {
        console.error("Error fetching books locations:", error);
      }
    };
    fetchBooksLocations();
  }, []);

  // Handle region change
  function handleRegionChange(region) {
    setZoomLevel(region.latitudeDelta + region.longitudeDelta);
  }

  // Handle marker press
  function handleMarkerPress(location) {
    const distance = calculateDistance(
      userLocation.latitude,
      userLocation.longitude,
      location.latitude,
      location.longitude
    );
    setSelectedBooksDistance(distance);
    // Sort books by book name in ascending order
    const sortedBooks = location.booksAtLocation.sort((a, b) =>
      a.bookName.localeCompare(b.bookName)
    );
    setSelectedBooks(sortedBooks);
  }

  // Handle press book
  function handlePressBook(item) {
    const distance = calculateDistance(
      userLocation.latitude,
      userLocation.longitude,
      item.location.latitude,
      item.location.longitude
    );
    navigation.navigate("Book Detail", {
      bookId: item.id,
      ownerId: item.owner,
    });
  }

  return (
    <>
      {isLoading ? (
        <ActivityIndicator
          size="large"
          color="#55c7aa"
          style={{ marginTop: 20 }}
        />
      ) : (
        userLocation && (
          <MapView
            style={styles.map}
            initialRegion={{
              latitude: userLocation.latitude,
              longitude: userLocation.longitude,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
            showsUserLocation={true}
            onUserLocationChange={(event) =>
              setUserLocation(event.nativeEvent.coordinate)
            }
            onRegionChange={handleRegionChange}
          >
            {booksLocations.map(
              (location, index) =>
                location.booksCount > 0 && (
                  <Marker
                    key={index}
                    coordinate={{
                      latitude: location.latitude,
                      longitude: location.longitude,
                    }}
                    onPress={() => handleMarkerPress(location)}
                  >
                    <Ionicons
                      name="library-outline"
                      size={27}
                      color="black"
                      style={styles.bookIcon}
                    />
                    {zoomLevel < 0.2 && (
                      <View style={styles.markerTextContainer}>
                        <Text style={styles.markerText}>
                          {location.booksCount === 1
                            ? "1 Book"
                            : `${location.booksCount} Books`}
                        </Text>
                      </View>
                    )}
                  </Marker>
                )
            )}
          </MapView>
        )
      )}
      {selectedBooks && (
        <View style={styles.bottomContainer}>
          <Text style={styles.header}>Books at this location</Text>
          <View style={styles.distanceContainer}>
            <Entypo name="location-pin" size={24} color="#55c7aa" />
            <Text style={styles.distanceText}>{selectedBooksDistance} km</Text>
          </View>
          <FlatList
            data={selectedBooks}
            renderItem={({ item }) => (
              <BookCard item={item} handlePressBook={handlePressBook} />
            )}
            keyExtractor={(item) => item.id}
          />
          <CustomButton
            onPress={() => setSelectedBooks(null)}
            customStyle={styles.closeButton}
          >
            <Text style={styles.closeText}>Close</Text>
          </CustomButton>
        </View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  map: {
    flex: 1,
  },
  bookIcon: {
    marginLeft: 16,
  },
  distanceContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  distanceText: {
    fontSize: 16,
    fontFamily: "SecularOne_400Regular",
    marginLeft: 5,
  },
  markerTextContainer: {
    backgroundColor: "#55c7aa",
    borderRadius: 8,
    padding: 5,
  },
  markerText: {
    fontWeight: "bold",
    color: "white",
    fontFamily: "SecularOne_400Regular",
    fontSize: 14,
  },
  bottomContainer: {
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "white",
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: "50%",
  },
  header: {
    fontSize: 20,
    fontFamily: "SecularOne_400Regular",
    marginBottom: 10,
  },
  closeButton: {
    fontSize: 16,
    marginTop: 20,
    backgroundColor: "#f44336",
    borderRadius: 10,
    marginHorizontal: 100,
    height: 40,
  },
  closeText: {
    fontFamily: "SecularOne_400Regular",
    color: "white",
    fontSize: 18,
  },
});
