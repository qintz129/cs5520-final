import { StyleSheet, Text, View, Image } from "react-native";
import React, { useState, useEffect } from "react";
import CustomButton from "./CustomButton";
import { storage, database, auth } from "../firebase-files/firebaseSetup";
import { ref, getDownloadURL } from "firebase/storage";
import { AntDesign } from "@expo/vector-icons";
import { useCustomFonts } from "../Fonts";
import { doc, getDoc } from "firebase/firestore";

// HistoryCard component to display the history of exchanges
export default function HistoryCard({
  myBook,
  theirBook,
  date,
  navigation,
  reviewee,
  reviewer,
  exchangeId,
  isReviewed,
  status,
}) {
  const [myBookData, setMyBookData] = useState([]);
  const [theirBookData, setTheirBookData] = useState([]);
  const [myBookAvatar, setMyBookAvatar] = useState(null);
  const [theirBookAvatar, setTheirBookAvatar] = useState(null);
  const { fontsLoaded } = useCustomFonts();

  if (!fontsLoaded) {
    return <Text>Loading...</Text>;
  }

  // Fetch books data from the database
  useEffect(() => {
    const fetchBooksData = async () => {
      try {
        const myBookDocRef = doc(database, "books", myBook);
        const theirBookDocRef = doc(database, "books", theirBook);

        const myBookSnapshot = await getDoc(myBookDocRef);
        const theirBookSnapshot = await getDoc(theirBookDocRef);

        if (myBookSnapshot.exists()) {
          setMyBookData(myBookSnapshot.data());
        }

        if (theirBookSnapshot.exists()) {
          setTheirBookData(theirBookSnapshot.data());
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchBooksData();
  }, [myBook, theirBook]);

  useEffect(() => {
    if (myBookData.image) {
      const imageRef = ref(storage, myBookData.image);
      getDownloadURL(imageRef)
        .then((url) => {
          setMyBookAvatar(url);
        })
        .catch((error) => {
          console.error("Failed to load image:", error);
        });
    }
  }, [myBookData.image]);

  useEffect(() => {
    if (theirBookData.image) {
      const imageRef = ref(storage, theirBookData.image);
      getDownloadURL(imageRef)
        .then((url) => {
          setTheirBookAvatar(url);
        })
        .catch((error) => {
          console.error("Failed to load image:", error);
        });
    }
  }, [theirBookData.image]);

  // Function to handle the review button
  const handleReview = () => {
    navigation.navigate("Add A Review", {
      reviewee: reviewee,
      exchangeId: exchangeId,
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.dateContainer}>
        <Text style={styles.dateText}>{date}</Text>
      </View>
      <View style={styles.books}>
        <View style={styles.bookItem}>
          <Text style={styles.myBookText}>My book</Text>
          {myBookAvatar ? (
            <Image source={{ uri: myBookAvatar }} style={styles.image} />
          ) : (
            <AntDesign name="picture" size={100} color="grey" />
          )}
          <Text style={styles.bookNameText}>{myBookData.bookName}</Text>
        </View>
        <View style={styles.bookItem}>
          <Text style={styles.theirBookText}>Their book</Text>
          {theirBookAvatar ? (
            <Image source={{ uri: theirBookAvatar }} style={styles.image} />
          ) : (
            <AntDesign name="picture" size={100} color="grey" />
          )}
          <Text style={styles.bookNameText}>{theirBookData.bookName}</Text>
        </View>
      </View>
      <View style={styles.bottomView}>
        {status === "completed" ? (
          <CustomButton
            customStyle={styles.reviewButton}
            onPress={handleReview}
            disabled={isReviewed}
          >
            <Text style={isReviewed ? styles.reviewedText : styles.reviewText}>
              {isReviewed ? "Reviewed" : "Review"}
            </Text>
          </CustomButton>
        ) : (
          <Text style={styles.rejectedText}>Rejected</Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  dateContainer: {
    borderBottomColor: "#ccc",
    borderBottomWidth: 1,
  },
  dateText: {
    color: "black",
    fontSize: 16,
    fontFamily: "SecularOne_400Regular",
  },
  myBookText: {
    color: "#ff9529",
    fontSize: 18,
    fontFamily: "SecularOne_400Regular",
    marginTop: 10,
    textAlign: "center",
  },
  theirBookText: {
    color: "#55aacc",
    fontSize: 18,
    fontFamily: "SecularOne_400Regular",
    marginTop: 10,
    textAlign: "center",
  },
  bookNameText: {
    fontFamily: "SecularOne_400Regular",
    fontSize: 16,
    textAlign: "center",
    marginTop: 10,
  },
  books: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  bookItem: {
    width: "45%",
    alignItems: "center",
  },
  image: {
    width: 90,
    height: 90,
    borderRadius: 10,
    marginVertical: 5,
  },
  container: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    backgroundColor: "#fff",
    borderRadius: 8,
    margin: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 1.41,
    elevation: 2,
  },
  bottomView: {
    marginTop: 10,
  },
  rejectedText: {
    color: "grey",
    alignSelf: "center",
    fontFamily: "Molengo_400Regular",
    fontSize: 18,
    marginBottom: 10,
  },
  reviewedText: {
    alignSelf: "center",
    fontFamily: "Molengo_400Regular",
    fontSize: 18,
  },
  reviewButton: {
    backgroundColor: "#55c7aa",
    borderRadius: 10,
    height: 40,
    width: "30%",
    alignSelf: "center",
  },
  reviewText: {
    color: "white",
    fontFamily: "SecularOne_400Regular",
    fontSize: 18,
    textAlign: "center",
  },
});
