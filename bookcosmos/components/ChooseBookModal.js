import React, { useEffect, useState } from "react";
import {
  Modal,
  View,
  Text,
  FlatList,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from "react-native";
import CustomButton from "./CustomButton";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { database } from "../firebase-files/firebaseSetup";
import {
  updateToDB,
  createExchangeRequest,
} from "../firebase-files/firestoreHelper";
import * as Notifications from "expo-notifications";
import { throttle } from "lodash";
import { useUser } from "../hooks/UserContext";
import { useCustomFonts } from "../hooks/UseFonts";

// ChooseBookModal component to display a modal to choose a book for exchange
export default function ChooseBookModal({
  visible,
  onRequestClose,
  fromUserId,
  requestedBookId,
  toUserId, 
}) {
  const [books, setBooks] = useState([]);
  const [selectedBookId, setSelectedBookId] = useState(null);
  const { userInfo } = useUser();
  const [isLoading, setIsLoading] = useState(false);

  const { fontsLoaded } = useCustomFonts();
  if (!fontsLoaded) {
    return <Text>Loading...</Text>;
  }

  async function scheduleNotification() {
    try {
      if (!userInfo.notification) {
        console.log("User has disabled notifications");
        return;
      }
      const id = await Notifications.scheduleNotificationAsync({
        content: {
          title: "Book Exchange Request",
          body: "Check your book exchange request status!",
          data: { screen: "Requests" },
        },
        // Set the notification to be sent after 3 seconds for testing purposes
        trigger: { seconds: 3 },
      });
    } catch (error) {
      console.log(error);
    }
  }

  const scheduleThrottledNotification = throttle(
    () => {
      console.log("Scheduling notification...");
      scheduleNotification();
    },
    86400000, // 24 hours
    { trailing: false }
  );

  useEffect(() => {
    // Define the query to fetch books for a specific user
    const booksQuery = query(
      collection(database, "books"),
      where("owner", "==", fromUserId),
      where("bookStatus", "==", "free")
    );

    // Subscribe to the query
    const unsubscribe = onSnapshot(booksQuery, (snapshot) => {
      const fetchedBooks = [];
      snapshot.forEach((doc) => {
        fetchedBooks.push({ id: doc.id, ...doc.data() });
      });
      // Update the state variable with the fetched books
      setBooks(fetchedBooks);
    });

    // Clean up the subscription when the component unmounts
    return () => unsubscribe();
  }, [fromUserId]);

  const handleSelectBook = (bookId) => {
    setSelectedBookId(bookId);
  };

  // Function to update book status to indicate it is used to exchange for another book
  async function updateBookStatus(bookId) {
    try {
      await updateToDB(bookId, "books", null, null, { bookStatus: "pending" });
      console.log("Book status updated successfully");
    } catch (error) {
      console.error("Error updating book status:", error);
      throw error;
    }
  }

  const handleConfirm = async () => {
    if (selectedBookId) {
      setIsLoading(true);
      try {
        const newRequest = {
          fromUser: fromUserId,
          offeredBook: selectedBookId,
          requestedTime: new Date().toISOString(),
          requestedBook: requestedBookId,
          toUser: toUserId,
          status: "unaccepted",
        };
        // Write request data to the database
        createExchangeRequest(newRequest)
          .then((requestId) => {
            console.log("Request created with ID:", requestId);
          })
          .catch((error) => {
            console.error("Error creating request:", error);
          });

        // Update book status to indicate it is in exchange
        await updateBookStatus(selectedBookId);

        // Schedule a notification for the user
        scheduleThrottledNotification();

        // Close the modal
        onRequestClose();
        // Alert the user that the request has been sent
        Alert.alert("Your request has been sent!");
      } catch (error) {
        console.error("Error writing request to database:", error);
      } finally {
        setIsLoading(false); // Set loading to false after request processing
      }
    } else {
      Alert.alert("Please select a book!");
    }
  }; 

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onRequestClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Select a book to exchange</Text>
          {books.length === 0 ? ( 
            <Text style={styles.noBooksText}>No books available, add books to your library</Text> 
          ) : (
            <FlatList
              data={books}
              renderItem={({ item }) => (
                <View
                  style={[
                    styles.item,
                    selectedBookId === item.id && styles.selectedItem,
                  ]}
                >
                  <CustomButton onPress={() => handleSelectBook(item.id)}>
                    <Text style={styles.bookNameText}>{item.bookName}</Text>
                  </CustomButton>
                </View>
              )}
              keyExtractor={(item) => item.id.toString()}
            />
          )}
        </View>
        <View style={styles.buttonContainer}>
          <CustomButton
            onPress={onRequestClose}
            customStyle={styles.cancelButtonStyle}
          >
            <Text style={styles.buttonText}>Cancel</Text>
          </CustomButton>
          <CustomButton
            onPress={handleConfirm}
            customStyle={styles.confirmButtonStyle}
          >
            {isLoading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={styles.buttonText}>Confirm</Text>
            )}
          </CustomButton>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "space-evenly",
    alignItems: "center",
    backgroundColor: "white",
    padding: 20,
  },
  modalContent: {
    maxHeight: "60%",
    width: "90%",
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  modalTitle: {
    fontSize: 20,
    marginBottom: 10,
    fontFamily: "SecularOne_400Regular",
  },
  item: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  selectedItem: {
    backgroundColor: "#e0e0e0",
    borderRadius: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginTop: 20,
  },
  bookNameText: {
    fontSize: 18,
    fontFamily: "Molengo_400Regular",
    textAlign: "center",
  },
  cancelButtonStyle: {
    backgroundColor: "#ff5c5c",
    width: "40%",
    height: 50,
    borderRadius: 10,
  },
  confirmButtonStyle: {
    backgroundColor: "#55c7aa",
    width: "40%",
    height: 50,
    borderRadius: 10,
  },
  buttonText: {
    color: "#f5f5f5",
    fontSize: 18,
    fontFamily: "SecularOne_400Regular",
  },
  noBooksText: {
    marginTop: 20,
    fontFamily: "Molengo_400Regular",
    fontSize: 18,
    color: "grey",
  },
});
