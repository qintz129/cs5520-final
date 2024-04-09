import { StyleSheet, Text, View, ActivityIndicator, Image } from "react-native";
import React, { useState, useEffect } from "react";
import { doc, getDoc, getDocs, collection } from "firebase/firestore";
import { database, auth } from "../firebase-files/firebaseSetup";
import CustomButton from "../components/CustomButton";
import ChooseBookModal from "../components/ChooseBookModal";
import AntDesign from "react-native-vector-icons/AntDesign";
import { ref, getDownloadURL } from "firebase/storage";
import { storage } from "../firebase-files/firebaseSetup";
import { Entypo } from "@expo/vector-icons";

// BookDetail component to display the details of a book
export default function BookDetail({ route, navigation }) {
  const [bookName, setBookName] = useState("");
  const [author, setAuthor] = useState("");
  const [bookImageURI, setBookImageURI] = useState("");
  const [description, setDescription] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [requestSent, setRequestSent] = useState(false);
  const [bookStatus, setBookStatus] = useState("free");
  const { bookId, ownerId, distance } = route.params;
  const [rating, setRating] = useState(0);
  const [isLoading, setLoading] = useState(false);
  const [bookAvatar, setBookAvatar] = useState(null);

  useEffect(() => {
    let bookData;
    // Fetch the book data from the database by bookId
    const fetchBookData = async () => {
      try {
        setLoading(true);
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

          await fetchOwnerName(bookData.owner);
        } else {
          console.error("No such document!");
        }
      } catch (error) {
        console.error("Error fetching book data:", error);
      }
    };

    // Fetch the owner name from the database by ownerId
    const fetchOwnerName = async () => {
      try {
        const docRef = doc(database, "users", bookData.owner);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const userData = docSnap.data();
          setOwnerName(userData.name);
        } else {
          setOwnerName("Unknown");
        }
      } catch (error) {
        console.error("Error fetching owner name:", error);
        setOwnerName("Unknown");
      }
      setLoading(false);
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

  return (
    <>
      {isLoading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <View style={styles.container}>
          {bookAvatar ? (
            <Image source={{ uri: bookAvatar }} style={styles.image} />
          ) : (
            <AntDesign name="picture" size={50} color="grey" />
          )}
          <Text style={styles.title}>{bookName}</Text>
          <Text style={styles.author}>{author}</Text>
          <Text>{description}</Text>
          <View style={styles.distanceContainer}>
            <Entypo name="location-pin" size={24} color="black" />
            <Text>{distance} km</Text>
          </View>
          <View>
            <CustomButton
              onPress={() =>
                navigation.navigate("Other User Profile", {
                  ownerId: ownerId,
                  ownerName: ownerName,
                  rating: rating,
                })
              }
            >
              <Text>User: {ownerName}</Text>
              {rating > 0 && <Text>Rating: {rating}</Text>}
            </CustomButton>
          </View>
          <View style={styles.goodReads}>
            <CustomButton>
              <Text>See more information from Goodreads</Text>
            </CustomButton>
          </View>
          <View style={styles.buttonContainer}>
            {!requestSent && bookStatus === "free" && (
              <CustomButton onPress={handleSendRequest}>
                <Text>Send Request</Text>
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
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 10,
  },
  title: {
    fontSize: 25,
    marginBottom: 10,
    fontWeight: "bold",
  },
  author: {
    marginBottom: 10,
    fontSize: 20,
  },
  distanceContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  button: {
    backgroundColor: '#ff5a5f', // Airbnb红色
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  goodReads: {
    marginTop: 20,
  },
  buttonContainer: {
    marginTop: 20,
  },
});
