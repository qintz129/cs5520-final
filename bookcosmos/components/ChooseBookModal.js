import React, { useEffect, useState } from "react";
import { Modal, View, Text, FlatList, StyleSheet, Alert } from "react-native";
import CustomButton from "./CustomButton";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { database } from "../firebase-files/firebaseSetup";
import { writeToDB, updateToDB } from "../firebase-files/firestoreHelper";

export default function ChooseBookModal({
  visible,
  onRequestClose,
  fromUserId,
  requestedBookId,
  toUserId,
}) {
  const [books, setBooks] = useState([]);
  const [selectedBookId, setSelectedBookId] = useState(null);

  useEffect(() => {
    // Define the query to fetch books for a specific user
    const booksQuery = query(
      collection(database, "books"),
      where("owner", "==", fromUserId),
      where("isBookInExchange", "==", false)
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

  // Function to update book status to indicate it is in exchange
  async function updateBookStatusInExchange(bookId) {
    try {
      await updateToDB(bookId, "books", { isBookInExchange: true });
      console.log("Book status updated successfully");
    } catch (error) {
      console.error("Error updating book status:", error);
      throw error;
    }
  }

  const handleConfirm = async () => {
    if (selectedBookId) {
      try {
        const newRequest = {
          fromUser: fromUserId,
          offeredBook: selectedBookId,
          requestTime: new Date().toISOString(),
          requestedBook: requestedBookId,
          toUser: toUserId,
          status: "unaccepted",
        };
        // Write request data to the database
        await writeToDB(newRequest, "users", toUserId, "receivedRequests");
        await writeToDB(newRequest, "users", fromUserId, "sentRequests");

        // Update book status to indicate it is in exchange
        await updateBookStatusInExchange(selectedBookId);
        await updateBookStatusInExchange(requestedBookId);

        // Close the modal
        onRequestClose();

        // Alert the user that the request has been sent
        Alert.alert("Your request has been sent!");
      } catch (error) {
        console.error("Error writing request to database:", error);
      }
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
          <Text style={styles.modalTitle}>Select a book to exchange:</Text>
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
                  <Text>{item.bookName}</Text>
                </CustomButton>
              </View>
            )}
            keyExtractor={(item) => item.id.toString()}
          />
          <View style={styles.buttonContainer}>
            <CustomButton onPress={onRequestClose}>
              <Text>Cancel</Text>
            </CustomButton>
            <CustomButton onPress={handleConfirm}>
              <Text>Confirm</Text>
            </CustomButton>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    padding: 20,
  },
  modalContent: {
    width: "80%",
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    marginBottom: 10,
  },
  item: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  selectedItem: {
    backgroundColor: "#e0e0e0",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginTop: 20,
  },
});