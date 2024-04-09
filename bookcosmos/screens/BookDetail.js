import { StyleSheet, Text, View } from "react-native";
import React, { useState, useEffect } from "react";
import { doc, getDoc, getDocs, collection} from "firebase/firestore";
import { database, auth} from "../firebase-files/firebaseSetup";
import CustomButton from "../components/CustomButton";
import ChooseBookModal from "../components/ChooseBookModal"; 

// BookDetail component to display the details of a book
export default function BookDetail({ route, navigation }) {
  const [bookName, setBookName] = useState("");
  const [author, setAuthor] = useState("");
  const [description, setDescription] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [requestSent, setRequestSent] = useState(false); 
  const [bookStatus, setBookStatus] = useState("free");
  const { bookId, ownerId } = route.params; 
  const [rating, setRating] = useState(0);

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
          const averageRating = ratings.reduce((acc, curr) => acc + curr, 0) / ratings.length;
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

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{bookName}</Text>
      <Text style={styles.author}>{author}</Text>
      <Text 
        numberOfLines={10} // Display only 10 lines of the description 
        ellipsizeMode="tail" // Add ellipsis at the end of the text if it is truncated
      >  
        {description} 
      </Text>  
      <View>
        <CustomButton
          onPress={() =>
            navigation.navigate("Other User Profile", {
              ownerId: ownerId,
              ownerName: ownerName,
            })
          }
        >
          <Text>User: {ownerName}</Text> 
          {rating > 0 && (<Text>Rating: {rating}</Text>)}
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
      )
      }
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
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 25,
    marginBottom: 10,  
    fontWeight: 'bold',
  }, 
  author: { 
    marginBottom: 10,  
    fontSize: 20
  },
  goodReads: {
    marginTop: 20,
  },
  buttonContainer: {
    marginTop: 20,
  }
});
