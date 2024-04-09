import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
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
  const { editMode, bookId } = route.params;

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

  const receiveImageUri = (takenImageUri) => {
    setUploadUri(takenImageUri);
  };

  const receiveNewImage = (newImage) => {
    setHasNewImage(newImage);
  };

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

  async function handleSave() {
    try {
      // Ensure all fields are filled before saving
      if (!bookName || !author) {
        Alert.alert("Please fill in book name and author.");
        return;
      }

      const newBookData = {
        bookName: bookName,
        author: author,
        description: description,
        bookStatus: BookStatus,
        location: userLocation,
      };

      if (hasNewImage && uploadUri) {
        const newImageUri = await processImage(uploadUri);
        newBookData.image = newImageUri;
      }

      if (editMode) {
        confirmAndSave(newBookData);
      } else {
        console.log("newBookData", newBookData);
        writeToDB(newBookData, "books");
        navigation.goBack();
      }
    } catch (error) {
      console.error("Error saving book:", error);
    }
  }

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

  function confirmAndSave(bookData) {
    Alert.alert(
      "Important",
      "Are you sure you want to save these changes?",
      [
        { text: "No" },
        {
          text: "Yes",
          onPress: async () => {
            try {
              if (hasNewImage && uploadUri) {
                bookData.image = await processImage(uploadUri);
              }
              console.log("bookData", bookData);
              await updateToDB(bookId, "books", null, null, bookData);
              Keyboard.dismiss();
              navigation.goBack();
            } catch (error) {
              console.error("Error confirming save:", error);
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
    Keyboard.dismiss();
  }; 

  const fetchBookDescription = async (name, author) => {
    const url = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(name)}+inauthor:${encodeURIComponent(author)}&key=${googleApi}`;
    console.log('Fetching book details from:', url); 
    console.log('name:', name); 
    console.log('author:', author);
    try {
      const response = await fetch(url);
      const json = await response.json();
  
      if (json.totalItems > 0) {
        // Assuming you want to open the first result
        const description = json.items[0].volumeInfo.description; 
        setDescription(description);
      } else {
        Alert.alert( "Sorry, no books found with the given name and author.");
      }
    } catch (error) {
      console.error('Failed to fetch book details:', error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
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
              <MultilineInput
                title="Description"
                onChangeText={setDescription}
                value={description}
                placeholder="Write your book description here..."
              />   
            </View>
            <CustomButton onPress={() => fetchBookDescription(bookName, author)} customStyle={styles.fetchButton}> 
              <Text>Fetch Description</Text> 
            </CustomButton>
            <View style={styles.buttonContainer}>
              <CustomButton onPress={handleClear}>
                <Text>Clear</Text>
              </CustomButton>
              <CustomButton onPress={handleSave}>
                <Text>Save</Text>
              </CustomButton>
            </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  inputContainer: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginTop: 20,
  }, 
  fetchButton: {  
    alignItems: "flex-start", 
    marginLeft: 20
  },
});
