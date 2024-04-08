import { StyleSheet, Text, View, ActivityIndicator } from "react-native";
import React, { useState, useEffect } from "react";
import MapView, { Marker } from "react-native-maps";
import { FlatList } from "react-native-gesture-handler";
import * as Location from "expo-location";
import { Feather } from "@expo/vector-icons";
import CustomButton from "../components/CustomButton";
import {
  fetchBooksAtLocation,
  getAllDocs,
} from "../firebase-files/firestoreHelper";
import BookCard from "../components/BookCard";
import { useNavigation } from "@react-navigation/native";

export default function Map() {
  const navigation = useNavigation();
  const [userLocation, setUserLocation] = useState(null);
  const [isLoading, setLoading] = useState(true);
  const [zoomLevel, setZoomLevel] = useState(0);
  const [booksLocations, setBooksLocations] = useState([]);
  const [selectedBooks, setSelectedBooks] = useState(null);

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
  }, [userLocation]);

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
            const booksCount = (
              await fetchBooksAtLocation({ latitude, longitude })
            ).length;
            const booksAtLocation = await fetchBooksAtLocation({
              latitude,
              longitude,
            });
            return { latitude, longitude, booksCount, booksAtLocation };
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
    setSelectedBooks(location.booksAtLocation);
  }

  // Handle press book
  function handlePressBook(item) {
    navigation.navigate("Book Detail", { bookId: item.id });
  }

  return (
    <>
      {isLoading ? (
        <ActivityIndicator size="large" color="#0000ff" />
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
            {booksLocations.map((location, index) => (
              <Marker
                key={index}
                coordinate={{
                  latitude: location.latitude,
                  longitude: location.longitude,
                }}
                onPress={() => handleMarkerPress(location)}
              >
                <Feather
                  name="book-open"
                  size={24}
                  color="black"
                  style={styles.bookIcon}
                />
                {zoomLevel < 0.5 && (
                  <Text style={styles.markerText}>
                    {location.booksCount === 1
                      ? "1 Book"
                      : `${location.booksCount} Books`}
                  </Text>
                )}
              </Marker>
            ))}
          </MapView>
        )
      )}
      {selectedBooks && (
        <View style={styles.bottomContainer}>
          <Text style={styles.header}>Books at this location:</Text>
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
            <Text>Close</Text>
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
  markerText: {
    fontWeight: "bold",
    color: "black",
    backgroundColor: "lightblue",
    padding: 5,
    borderRadius: 5,
  },
  bottomContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "white",
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  header: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  bookItem: {
    fontSize: 16,
    marginBottom: 5,
  },
  closeButton: {
    fontSize: 16,
    marginTop: 20,
  },
});
