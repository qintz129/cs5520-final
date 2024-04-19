import { Text, View, ActivityIndicator, FlatList } from "react-native";
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
import { calculateDistance } from "../utils/Utils";
import { useCustomFonts } from "../hooks/UseFonts";
import { activityIndicatorStyles } from "../styles/CustomStyles";
import { mapView } from "../utils/Constants";
import { COLORS } from "../styles/Colors";
import { mapStyles } from "../styles/ScreenStyles";

export default function Map() {
  const navigation = useNavigation();
  const [userLocation, setUserLocation] = useState(null);
  const [isLoading, setLoading] = useState(true);
  const [zoomLevel, setZoomLevel] = useState(0);
  const [booksLocations, setBooksLocations] = useState([]);
  const [selectedBooks, setSelectedBooks] = useState(null);
  const [selectedBooksDistance, setSelectedBooksDistance] = useState(null);
  const styles = mapStyles;
  const { fontsLoaded } = useCustomFonts();
  if (!fontsLoaded) {
    return null;
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
          size={activityIndicatorStyles.size}
          color={activityIndicatorStyles.color}
          style={activityIndicatorStyles.style}
        />
      ) : (
        userLocation && (
          <MapView
            style={styles.map}
            initialRegion={{
              latitude: userLocation.latitude,
              longitude: userLocation.longitude,
              latitudeDelta: mapView.latitudeDelta,
              longitudeDelta: mapView.longitudeDelta,
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
                      size={styles.bookIconSize}
                      color={COLORS.black}
                      style={styles.bookIcon}
                    />
                    {zoomLevel < mapView.zoomLevel && (
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
            <Entypo
              name="location-pin"
              size={styles.pinIconSize}
              color={COLORS.mainTheme}
            />
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
