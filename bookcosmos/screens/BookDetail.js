import {
  StyleSheet,
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
import { useCustomFonts } from "../Fonts";
import { FontAwesome } from "@expo/vector-icons";
import * as Location from "expo-location";
import { calculateDistance } from "../Utils";

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
  const [requestSent, setRequestSent] = useState(false);
  const [bookStatus, setBookStatus] = useState("free");
  const { bookId, ownerId } = route.params;
  const [rating, setRating] = useState(0);
  const [isLoading, setLoading] = useState(true);
  const [bookAvatar, setBookAvatar] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [distance, setDistance] = useState(null);
  const [bookLocation, setBookLocation] = useState(null);

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
    console.log("Selected book ID:", selectedBookId);
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
    console.log("Fetching book details from:", url);
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

  return (
    <View>
      <ScrollView>
        {isLoading ? (
          <ActivityIndicator
            size="large"
            color="#55c7aa"
            style={{ marginTop: 20 }}
          />
        ) : (
          <View style={styles.container}>
            {bookAvatar ? (
              <Image source={{ uri: bookAvatar }} style={styles.image} />
            ) : (
              <AntDesign
                name="picture"
                size={200}
                color="grey"
                style={{ alignSelf: "center" }}
              />
            )}
            <View style={styles.bookInfoContainer}>
              <Text style={styles.titleText}>{bookName}</Text>
              <Text style={styles.authorText}>{author}</Text>
              <Text style={styles.descriptionText}>{description}</Text>
            </View>
            <View style={styles.googleBooks}>
              <CustomButton
                onPress={() => fetchBookDetails(bookName, author)}
                customStyle={{
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                  columnGap: 10,
                }}
              >
                <AntDesign name="google" size={24} color="black" />
                <Text style={styles.googleButtonText}>
                  See more information from Google Books
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
                  customStyle={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    columnGap: 10,
                  }}
                >
                  <View style={styles.userContainer}>
                    {ownerAvatar ? (
                      <Image
                        source={{ uri: ownerAvatar }}
                        style={{ width: 50, height: 50, borderRadius: 50 }}
                      />
                    ) : (
                      <AntDesign name="user" size={50} color="grey" />
                    )}
                    <View style={styles.userTextContainer}>
                      <Text style={styles.userText}>{ownerName}</Text>
                      {rating > 0 && (
                        <View style={styles.userRatingContainer}>
                          <FontAwesome name="star" size={20} color="#fdcc0d" />
                          <Text style={styles.ratingText}>{rating}</Text>
                        </View>
                      )}
                    </View>
                  </View>
                </CustomButton>
              </View>
              <View style={styles.divider}></View>
              <View style={styles.locationContainer}>
                <Entypo name="location-pin" size={24} color="#55c7aa" />
                <Text style={styles.distanceText}>{distance} km</Text>
              </View>
            </View>
            <View style={styles.buttonContainer}>
              {!requestSent &&
                bookStatus === "free" &&
                auth.currentUser.uid !== ownerId && (
                  <CustomButton
                    onPress={handleSendRequest}
                    customStyle={{
                      backgroundColor: "#55c7aa",
                      width: 200,
                      height: 50,
                      borderRadius: 10,
                      alignSelf: "center",
                    }}
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
              requestSent={requestSent}
              setRequestSent={setRequestSent}
            />
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  image: {
    width: "100%",
    height: 370,
    borderRadius: 10,
  },
  bookInfoContainer: {
    padding: 10,
  },
  titleText: {
    fontSize: 30,
    marginBottom: 5,
    fontWeight: "bold",
    fontFamily: "SecularOne_400Regular",
    marginTop: 10,
    textAlign: "center",
  },
  authorText: {
    marginTop: 5,
    marginBottom: 15,
    fontSize: 25,
    fontFamily: "Molengo_400Regular",
    textAlign: "center",
  },
  descriptionText: {
    fontSize: 18,
    fontFamily: "Catamaran_400Regular",
    textAlign: "justify",
  },
  userInfoContainer: {
    marginTop: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
    borderWidth: 1,
    borderColor: "lightgrey",
    padding: 10,
    borderRadius: 10,
  },
  userButtonContainer: {
    flexDirection: "column",
    justifyContent: "center",
  },
  userContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    columnGap: 20,
  },
  userTextContainer: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  userText: {
    fontSize: 18,
    fontFamily: "SecularOne_400Regular",
    textAlign: "center",
  },
  userRatingContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    columnGap: 10,
  },
  ratingText: {
    fontSize: 18,
    fontFamily: "SecularOne_400Regular",
    textAlign: "center",
  },
  divider: {
    height: 50,
    width: 1,
    backgroundColor: "lightgrey",
    marginLeft: 10,
    marginRight: 10,
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  distanceText: {
    fontSize: 18,
    fontFamily: "SecularOne_400Regular",
    textAlign: "center",
  },
  buttonText: {
    color: "#f5f5f5",
    fontSize: 18,
    fontFamily: "SecularOne_400Regular",
  },
  googleBooks: {
    borderWidth: 1,
    borderColor: "lightgrey",
    padding: 10,
    borderRadius: 10,
  },
  googleButtonText: {
    fontSize: 16,
    fontFamily: "SecularOne_400Regular",
    color: "black",
  },
  buttonContainer: {
    marginTop: 10,
  },
});
