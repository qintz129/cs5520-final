import { StyleSheet, Text, View, ActivityIndicator } from "react-native";
import React, { useState, useEffect } from "react";
import MapView, { Marker } from "react-native-maps";
import { FlatList } from "react-native-gesture-handler";
import * as Location from "expo-location";
import { Feather } from "@expo/vector-icons";
import CustomButton from "../components/CustomButton";

export default function Map() {
  const [selectedUser, setSelectedUser] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [isLoading, setLoading] = useState(true);
  const [zoomLevel, setZoomLevel] = useState(0);

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

  // simulate location
  const userWithBooks = [
    {
      id: 1,
      coordinate: {
        latitude: 49.227,
        longitude: -122.98,
      },
      books: 3,
    },
    {
      id: 2,
      coordinate: { latitude: 49.22, longitude: -122.9968 },
      books: 1,
    },
  ];

  // Handle region change
  function handleRegionChange(region) {
    setZoomLevel(region.latitudeDelta + region.longitudeDelta);
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
            {userWithBooks.map((user) => (
              <Marker
                key={user.id}
                coordinate={user.coordinate}
                onPress={() => setSelectedUser(user)}
              >
                <Feather
                  name="book-open"
                  size={24}
                  color="black"
                  style={styles.bookIcon}
                />
                {zoomLevel < 0.5 && (
                  <Text style={styles.markerText}>
                    {user.books === 1 ? "1 Book" : `${user.books} Books`}
                  </Text>
                )}
              </Marker>
            ))}
          </MapView>
        )
      )}
      {selectedUser && (
        <View style={styles.bottomContainer}>
          <Text style={styles.header}>Library of User {selectedUser?.id}</Text>
          <FlatList
            data={Array(selectedUser?.books)
              .fill()
              .map((_, index) => ({ id: index }))}
            renderItem={({ item }) => (
              <Text style={styles.bookItem}>Book {item.id + 1}</Text>
            )}
            keyExtractor={(item, index) => index.toString()}
          />
          <CustomButton
            onPress={() => setSelectedUser(null)}
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
