import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { writeToDB, updateToDB } from "../firebase-files/firestoreHelper";
import { database, storage } from "../firebase-files/firebaseSetup";
import { doc, onSnapshot } from "firebase/firestore";
import { CustomInput, MultilineInput } from "../components/InputHelper";
import CustomButton from "../components/CustomButton";
import ImageManager from "../components/ImageManager";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import * as Location from "expo-location";
import { googleApi } from "@env";
import Geocoder from "react-native-geocoding";
import { useCustomFonts } from "../hooks/UseFonts";
import { COLORS } from "../styles/Colors";
import { addABookStyles } from "../styles/ScreenStyles";

// AddABook screen to add a new book or edit an existing book
export default function AddABook({ navigation, route }) {
  const [bookName, setBookName] = useState("");
  const [author, setAuthor] = useState("");
  const [description, setDescription] = useState("");
  const [BookStatus, setBookStatus] = useState("free");
  const [imageUri, setImageUri] = useState(null);
  const [downloadUri, setDownloadUri] = useState(null);
  const [uploadUri, setUploadUri] = useState(null);
  const [hasNewImage, setHasNewImage] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const [address, setAddress] = useState("");
  const [canGetAddress, setCanGetAddress] = useState(false);
  const { editMode, bookId } = route.params;
  const [isSaveLoading, setIsSaveLoading] = useState(false);
  const styles = addABookStyles;
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
      if (location) {
        setUserLocation(location.coords);
        // When the user's location is available, can use the address fetch button
        setCanGetAddress(true);
      }
    }
    getUserLocation();
  }, []);

  // Render the header based on the edit mode
  useEffect(() => {
    navigation.setOptions({
      title: editMode ? "Edit Book" : "Add A Book",
    });
  }, [editMode]);

  // If the edit mode is true, fetch the book from the database
  useEffect(() => {
    if (editMode) {
      // Set up a real-time subscription to the book data
      const docRef = doc(database, "books", bookId);

      const unsubscribe = onSnapshot(
        docRef,
        (docSnap) => {
          if (docSnap.exists()) {
            const bookData = docSnap.data();
            setBookName(bookData.bookName);
            setAuthor(bookData.author);
            setDescription(bookData.description);
            setBookStatus(bookData.bookStatus);
            setAddress(bookData.address);
            if (bookData.image) {
              setImageUri(bookData.image);
            }
          } else {
            console.error("No such document!");
          }
        },
        (error) => {
          console.error("Error fetching book data:", error);
        }
      );

      // Clean up the listener when the component unmounts or bookId/editMode changes
      return () => unsubscribe();
    }
  }, [editMode, bookId]);
  // Fetch the image from the storage
  useEffect(() => {
    const fetchImage = async () => {
      const imageRef = ref(storage, imageUri);

      try {
        const url = await getDownloadURL(imageRef);
        setDownloadUri(url);
      } catch (error) {
        console.log(error);
      }
    };

    if (imageUri) {
      fetchImage();
    }
  }, [imageUri]);
  // Receive the image uri from the ImageManager
  const receiveImageUri = (takenImageUri) => {
    setUploadUri(takenImageUri);
  };
  // Check if a new image is received
  const receiveNewImage = (newImage) => {
    setHasNewImage(newImage);
  };
  // Upload the image to the storage
  async function getImageData(uri) {
    try {
      const response = await fetch(uri);
      const imageBlob = await response.blob();
      const imageName = uri.substring(uri.lastIndexOf("/") + 1);
      const imageRef = ref(storage, `bookImages/${imageName}`);
      const uploadResult = await uploadBytes(imageRef, imageBlob);
      console.log("uploadResult", uploadResult);
      return uploadResult.metadata.fullPath;
    } catch (err) {
      console.log(err);
    }
  }
  // Process the image
  async function processImage(uploadUri) {
    try {
      const newImageUri = await getImageData(uploadUri);
      setImageUri(newImageUri);
      return newImageUri;
    } catch (error) {
      console.error("Error updating book info with new image:", error);
      return null;
    }
  }
  // Handle the save button
  async function handleSave() {
    Alert.alert(
      "Important",
      "Are you sure you want to save these changes?",
      [
        { text: "No" },
        {
          text: "Yes",
          onPress: async () => {
            setIsSaveLoading(true);
            try { 
              // Check if the required fields are filled
              if (!bookName || !author || !address) {
                Alert.alert("Please fill in book name, author, and address.");
                return;
              }

              const location = await findCoordinates(address);
              if (!location) {
                Alert.alert(
                  "Failed to find location for the address provided."
                );
                return;
              }
              const formattedLocation = {
                latitude: location.lat,
                longitude: location.lng,
              };

              const newBookData = {
                bookName: bookName,
                author: author,
                description: description,
                bookStatus: BookStatus,
                address: address,
                location: formattedLocation,
              };

              if (hasNewImage && uploadUri) {
                const newImageUri = await processImage(uploadUri);
                newBookData.image = newImageUri;
              }
              console.log("newBookData", newBookData);
              // If in the edit mode, update the book data
              if (editMode) {
                await updateToDB(bookId, "books", null, null, newBookData);
                navigation.goBack();
              } else {
                writeToDB(newBookData, "books");
                navigation.goBack();
              }
              Alert.alert("Book saved successfully!");
            } catch (error) {
              console.error("Error confirming save:", error);
            } finally {
              setIsSaveLoading(false);
            }
          },
        },
      ],
      { cancelable: true }
    );
  }

  const handleClear = () => {
    // Clear all input fields
    setBookName("");
    setAuthor("");
    setDescription("");
    setAddress("");
    Keyboard.dismiss();
  };
  // Fetch the book description from Google Books API
  const fetchBookDescription = async (name, author) => {
    const url = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(
      name
    )}+inauthor:${encodeURIComponent(author)}&key=${googleApi}`;
    console.log("Fetching book details from:", url);
    try {
      const response = await fetch(url);
      const json = await response.json();
      if (json.totalItems > 0 && json.items[0].volumeInfo.description) {
        // Assuming you want to open the first result
        const description = json.items[0].volumeInfo.description;
        setDescription(description);
      } else {
        Alert.alert("Sorry, no books found with the given name and author.");
      }
    } catch (error) {
      console.error("Failed to fetch book details:", error);
    }
  };
  // Initialize the Geocoder
  Geocoder.init(googleApi, { language: "en" });

  // Get coordinates from address
  const findCoordinates = async (searchAddress) => {
    try {
      const response = await Geocoder.from(searchAddress);
      const location = response.results[0].geometry.location;

      return location;
    } catch (error) {
      console.error("Failed to fetch coordinates:", error);
      return null;
    }
  };
  // Get address from coordinates
  const getReverseGeocodingData = (lat, lng) => {
    const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${googleApi}`;
    if (lat && lng) {
      fetch(url)
        .then((response) => response.json())
        .then((data) => {
          if (data.status === "OK") {
            // Get the first result
            const firstResult = data.results[0];
            console.log("Address converted", firstResult.formatted_address);
            setAddress(firstResult.formatted_address);
          } else {
            console.log("Geocoder failed due to: " + data.status);
          }
        })
        .catch((error) => console.error(error));
      console.log(address);
    }
  };

  return (
    <SafeAreaView style={styles.container}>   
      {/* KeyboardAvoidingView to avoid the keyboard covering the input fields */}
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : null}
        style={Platform.OS === "ios" ? { flex: 1 } : null}
        keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
      >
        <ScrollView>
          <View style={styles.inputContainer}>
            <ImageManager
              receiveImageUri={receiveImageUri}
              receiveNewImage={receiveNewImage}
              initialImageUri={downloadUri}
              mode="book"
            />
            <CustomInput
              title="Book Name*"
              value={bookName}
              onChangeText={setBookName}
            />
            <CustomInput
              title="Author*"
              value={author}
              onChangeText={setAuthor}
            />
            <CustomInput
              title="Address*"
              value={address}
              onChangeText={setAddress}
              placeholder="Enter or auto-fill address here..."
              fetch={true}
              fetchFunction={() =>
                getReverseGeocodingData(
                  userLocation.latitude,
                  userLocation.longitude
                )
              }
              pressable={canGetAddress}
            />
            <MultilineInput
              title="Description"
              onChangeText={setDescription}
              value={description}
              placeholder="Write your book description here or import it from google books..."
              fetch={true}
              fetchFunction={() => fetchBookDescription(bookName, author)}
              pressable={bookName && author}
            />
            <View style={styles.buttonContainer}>
              <CustomButton
                customStyle={styles.clearButton}
                onPress={handleClear}
              >
                <Text style={styles.clearText}>Clear</Text>
              </CustomButton>
              <CustomButton
                customStyle={styles.saveButton}
                onPress={handleSave}
              >
                {isSaveLoading ? (
                  <ActivityIndicator color={COLORS.white} />
                ) : (
                  <Text style={styles.saveText}>Save</Text>
                )}
              </CustomButton>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
