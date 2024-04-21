import {
  Text,
  View,
  Image,
  Alert,
  Linking,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import React, { useState, useEffect } from "react";
import { doc, getDoc, getDocs, collection } from "firebase/firestore";
import { database, auth } from "../firebase-files/firebaseSetup";
import CustomButton from "../components/CustomButton";
import ChooseBookModal from "../components/ChooseBookModal";
import AntDesign from "react-native-vector-icons/AntDesign";
import { ref, getDownloadURL } from "firebase/storage";
import { storage } from "../firebase-files/firebaseSetup";
import { Entypo } from "@expo/vector-icons";
import { googleApi } from "@env";
import { useCustomFonts } from "../hooks/UseFonts";
import { FontAwesome } from "@expo/vector-icons";
import * as Location from "expo-location";
import { calculateDistance } from "../utils/Utils";
import { activityIndicatorStyles } from "../styles/CustomStyles";
import { COLORS } from "../styles/Colors";
import { bookDetailStyles } from "../styles/ScreenStyles";

// BookDetail component to display the details of a book
export default function BookDetail({ route, navigation }) {
  const [bookName, setBookName] = useState("");
  const [author, setAuthor] = useState("");
  const [bookImageURI, setBookImageURI] = useState("");
  const [description, setDescription] = useState("");
  const [ownerAvatarURI, setOwnerAvatarURI] = useState("");
  const [ownerAvatar, setOwnerAvatar] = useState(null);
  const [ownerName, setOwnerName] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [bookStatus, setBookStatus] = useState("free");
  const { bookId, ownerId } = route.params;
  const [rating, setRating] = useState(0);
  const [isLoading, setLoading] = useState(true);
  const [bookAvatar, setBookAvatar] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [distance, setDistance] = useState(null);
  const [bookLocation, setBookLocation] = useState(null);
  const styles = bookDetailStyles;
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
    }
    getUserLocation();
  }, []);

  // Calculate the distance between the user and the book location
  useEffect(() => {
    if (userLocation && bookLocation) {
      const distance = calculateDistance(
        userLocation.latitude,
        userLocation.longitude,
        bookLocation.latitude,
        bookLocation.longitude
      );
      setDistance(distance);
      if (distance) {
        setLoading(false);
      }
    }
  }, [userLocation, bookLocation]);

  useEffect(() => {
    let bookData;
    // Fetch the book data from the database by bookId
    const fetchBookData = async () => {
      try {
        // Fetch the book data from the database
        const docRef = doc(database, "books", bookId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          bookData = docSnap.data();
          setBookName(bookData.bookName);
          setAuthor(bookData.author);
          setBookImageURI(bookData.image);
          setDescription(bookData.description);
          setBookStatus(bookData.bookStatus);
          setBookLocation(bookData.location);

          await fetchOwnerName(bookData.owner);
        } else {
          console.error("No such document!");
        }
      } catch (error) {
        console.error("Error fetching book data:", error);
      }
    };

    // Fetch the owner avatar and name from the database by ownerId
    const fetchOwnerName = async () => {
      try {
        const docRef = doc(database, "users", bookData.owner);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const userData = docSnap.data();
          setOwnerAvatarURI(userData.image);
          setOwnerName(userData.name);
        } else {
          setOwnerName("Unknown");
        }
      } catch (error) {
        console.error("Error fetching owner name:", error);
        setOwnerName("Unknown");
      }
    };
    fetchBookData();
  }, [bookId]);

  // Function to fetch ratings from the database
  async function getRatings(path) {
    try {
      const querySnapshot = await getDocs(collection(database, path));
      let ratings = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        if (data.rating) {
          ratings.push(data.rating);
        }
      });
      return ratings;
    } catch (err) {
      console.error("Error fetching ratings:", err);
      return [];
    }
  }

  // Calculate the average rating of the owner
  useEffect(() => {
    const fetchRatings = async () => {
      try {
        const ratings = await getRatings(`users/${ownerId}/reviews`);
        if (ratings.length === 0) {
          setRating(0);
        } else {
          const averageRating =
            ratings.reduce((acc, curr) => acc + curr, 0) / ratings.length;
          setRating(Math.round(averageRating * 10) / 10);
        }
      } catch (error) {
        console.error("Error fetching ratings:", error);
      }
    };

    fetchRatings();
  }, [ownerId]);

  const handleSendRequest = () => {
    setModalVisible(true);
  };

  // Function to handle the book selection, after the user selects a book, the modal will be closed
  const handleSelectBook = (selectedBookId) => {
    //console.log("Selected book ID:", selectedBookId);
    setModalVisible(false);
  };

  useEffect(() => {
    if (bookImageURI) {
      const imageRef = ref(storage, bookImageURI);
      getDownloadURL(imageRef)
        .then((url) => {
          setBookAvatar(url);
        })
        .catch((error) => {
          console.error("Failed to load image:", error);
        });
    }
  }, [bookImageURI]);

  useEffect(() => {
    if (ownerAvatarURI) {
      const imageRef = ref(storage, ownerAvatarURI);
      getDownloadURL(imageRef)
        .then((url) => {
          setOwnerAvatar(url);
        })
        .catch((error) => {
          console.error("Failed to load image:", error);
        });
    }
  }, [ownerAvatarURI]);

  const fetchBookDetails = async (name, author) => {
    const url = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(
      name
    )}+inauthor:${encodeURIComponent(author)}&key=${googleApi}`;
    //console.log("Fetching book details from:", url);
    try {
      const response = await fetch(url);
      const json = await response.json();

      if (json.totalItems > 0 && json.items[0].volumeInfo.infoLink) {
        // Assuming you want to open the first result
        const bookUrl = json.items[0].volumeInfo.infoLink;
        Linking.openURL(bookUrl);
      } else {
        Alert.alert("Sorry, no books found with the given name and author.");
      }
    } catch (error) {
      console.error("Failed to fetch book details:", error);
    }
  };

  // State to keep track of whether the description is expanded or not
  const [isExpanded, setIsExpanded] = useState(false);

  // Function to toggle the description
  const toggleDescription = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <View>
      <ScrollView>
        {isLoading ? (
          <ActivityIndicator
            size={activityIndicatorStyles.size}
            color={activityIndicatorStyles.color}
            style={activityIndicatorStyles.style}
          />
        ) : (
          <View style={styles.container}>
            {bookAvatar ? (
              <Image source={{ uri: bookAvatar }} style={styles.image} />
            ) : (
              <AntDesign
                name="picture"
                size={styles.pictureIconSize}
                color={COLORS.grey}
                style={styles.pictureIconStyle}
              />
            )}
            <View style={styles.bookInfoContainer}>
              <Text style={styles.titleText}>{bookName}</Text>
              <Text style={styles.authorText}>{author}</Text>
              <View style={styles.descriptionContainer}>
                <Text style={styles.descriptionText}>
                  {description.length > 200 && !isExpanded
                    ? `${description.substring(0, 200)}...`
                    : description}
                </Text>
                {description.length > 200 && (
                  <CustomButton onPress={toggleDescription}>
                    <Text style={styles.expandButtonText}>
                      {isExpanded ? "Hide" : "Read more"}
                    </Text>
                  </CustomButton>
                )}
              </View>
            </View>
            <View style={styles.googleBooks}>
              <CustomButton
                onPress={() => fetchBookDetails(bookName, author)}
                customStyle={styles.googleButton}
              >
                <AntDesign
                  name="google"
                  size={styles.googleIconSize}
                  color={COLORS.black}
                />
                <Text style={styles.googleButtonText}>
                  More information from Google Books
                </Text>
              </CustomButton>
            </View>
            <View style={styles.userInfoContainer}>
              <View style={styles.userButtonContainer}>
                <CustomButton
                  onPress={() =>
                    navigation.navigate("Other User Profile", {
                      ownerId: ownerId,
                      ownerName: ownerName,
                      rating: rating,
                      distance: distance,
                    })
                  }
                  customStyle={styles.ownerButton}
                >
                  <View style={styles.userContainer}>
                    {ownerAvatar ? (
                      <Image
                        source={{ uri: ownerAvatar }}
                        style={styles.ownerAvatar}
                      />
                    ) : (
                      <AntDesign
                        name="user"
                        size={styles.userIconSize}
                        color={COLORS.grey}
                      />
                    )}
                    <View style={styles.userTextContainer}>
                      <Text style={styles.userText}>{ownerName}</Text>
                      {rating > 0 && (
                        <View style={styles.userRatingContainer}>
                          <FontAwesome
                            name="star"
                            size={styles.starIconSize}
                            color={COLORS.reviewStar}
                          />
                          <Text style={styles.ratingText}>{rating}</Text>
                        </View>
                      )}
                    </View>
                  </View>
                </CustomButton>
              </View>
              <View style={styles.divider}></View>
              <View style={styles.locationContainer}>
                <Entypo
                  name="location-pin"
                  size={styles.pinIconSize}
                  color={COLORS.mainTheme}
                />
                <Text style={styles.distanceText}>{distance} km</Text>
              </View>
            </View>
            <View style={styles.buttonContainer}>
              {bookStatus === "free" && auth.currentUser.uid !== ownerId && (
                <CustomButton
                  onPress={handleSendRequest}
                  customStyle={styles.sendRequestButton}
                >
                  <Text style={styles.buttonText}>Send Request</Text>
                </CustomButton>
              )}
            </View>
            <ChooseBookModal
              visible={modalVisible}
              onRequestClose={() => setModalVisible(false)}
              onSelectBook={handleSelectBook}
              fromUserId={auth.currentUser.uid}
              requestedBookId={bookId}
              toUserId={ownerId} 
            />
          </View>
        )}
      </ScrollView>
    </View>
  );
}
