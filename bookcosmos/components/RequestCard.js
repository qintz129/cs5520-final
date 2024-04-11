import { StyleSheet, Text, View, Image } from "react-native";
import React, { useEffect, useState } from "react";
import CustomButton from "./CustomButton";
import {
  deleteFromDB,
  updateToDB,
  writeToDB,
} from "../firebase-files/firestoreHelper";
import { AntDesign } from "@expo/vector-icons";
import { auth } from "../firebase-files/firebaseSetup";
import { storage } from "../firebase-files/firebaseSetup";
import { ref, getDownloadURL } from "firebase/storage";

// RequestCard component to display the exchange requests
export default function RequestCard({
  date,
  requestedBookInfo,
  offeredBookInfo,
  navigation,
  tab,
  requestId,
  fromUserId,
  toUserId,
  initialStatus,
  initialCompletedUser,
  setUpdateTrigger,
}) {
  const [status, setStatus] = useState(initialStatus);
  const [offeredBookAvatar, setOfferedBookAvatar] = useState(null);
  const [requestedBookAvatar, setRequestedBookAvatar] = useState(null);

  useEffect(() => {
    if (offeredBookInfo.image) {
      const imageRef = ref(storage, offeredBookInfo.image);
      getDownloadURL(imageRef)
        .then((url) => {
          setOfferedBookAvatar(url);
        })
        .catch((error) => {
          console.error("Failed to load image:", error);
        });
    }
  }, [offeredBookInfo.image]);

  useEffect(() => {
    if (requestedBookInfo.image) {
      const imageRef = ref(storage, requestedBookInfo.image);
      getDownloadURL(imageRef)
        .then((url) => {
          setRequestedBookAvatar(url);
        })
        .catch((error) => {
          console.error("Failed to load image:", error);
        });
    }
  }, [requestedBookInfo.image]);

  const handlePressBook = ({ id, owner }) => {
    navigation.navigate("Book Detail", {
      bookId: id,
      ownerId: owner,
    });
  };

  // Function to handle the cancel and reject button,
  const handleCancelAndReject = async () => {
    try {
      // Wait for each delete operation to complete
      await deleteFromDB(requestId, "users", fromUserId, "sentRequests");
      console.log("Deleted from sentRequests");

      await deleteFromDB(requestId, "users", toUserId, "receivedRequests");
      console.log("Deleted from receivedRequests");

      // Check if offeredBookInfo exists and its status before updating, update the offered book status to free
      if (offeredBookInfo && offeredBookInfo.bookStatus !== "inExchange") {
        await updateToDB(offeredBookInfo.id, "books", null, null, {
          bookStatus: "free",
        });
        console.log("Updated offered book status to free");
      }
    } catch (err) {
      console.error("Failed to cancel the exchange request:", err);
      // Handle the error, possibly update UI to show an error message
    }
  };

  // Function to handle the accept button
  const handleAccept = async () => {
    try {
      // Wait for each update operation to complete
      await updateToDB(requestId, "users", toUserId, "receivedRequests", {
        status: "accepted",
      });
      console.log("Updated received request status to accepted");

      await updateToDB(requestId, "users", fromUserId, "sentRequests", {
        status: "accepted",
      });
      console.log("Updated sent request status to accepted");
      // Update the book status to inExchange
      await updateToDB(offeredBookInfo.id, "books", null, null, {
        bookStatus: "inExchange",
      });
      console.log(
        "Updated offered book status to inExchange",
        offeredBookInfo.bookName
      );

      await updateToDB(requestedBookInfo.id, "books", null, null, {
        bookStatus: "inExchange",
      });
      console.log(
        "Updated requested book status to inExchange",
        requestedBookInfo.bookName
      );

      setStatus("accepted"); // Assuming setStatus updates the component state
      setUpdateTrigger((prev) => prev + 1);
    } catch (err) {
      console.error("Failed to accept the exchange request:", err);
      // Handle the error, possibly update UI to show an error message
    }
  };

  const handleAcceptAfterCancel = async () => {
    try {
      // Wait for each update operation to complete
      await updateToDB(requestId, "users", toUserId, "receivedRequests", {
        status: "unaccepted",
      });
      console.log("Updated received request status to unaccepted");

      await updateToDB(requestId, "users", fromUserId, "sentRequests", {
        status: "unaccepted",
      });
      console.log("Updated sent request status to accepted");
      // Update the book status to inExchange
      await updateToDB(offeredBookInfo.id, "books", null, null, {
        bookStatus: "free",
      });
      console.log(
        "Updated offered book status to free",
        offeredBookInfo.bookName
      );

      await updateToDB(requestedBookInfo.id, "books", null, null, {
        bookStatus: "free",
      });
      console.log(
        "Updated requested book status to free",
        requestedBookInfo.bookName
      );
      setStatus("unaccepted"); // Assuming setStatus updates the component state
      setUpdateTrigger((prev) => prev + 1);
    } catch (err) {
      console.error("Failed to accept the exchange request:", err);
      // Handle the error, possibly update UI to show an error message
    }
  };

  // Function to handle the complete button
  const handleComplete = async () => {
    try {
      // if the status is accepted, update the status to one user completed
      if (status === "accepted") {
        const updates = {
          status: "one user completed",
          completedUser: auth.currentUser.uid,
        };
        await updateToDB(
          requestId,
          "users",
          fromUserId,
          "sentRequests",
          updates
        );
        await updateToDB(
          requestId,
          "users",
          toUserId,
          "receivedRequests",
          updates
        );

        setUpdateTrigger((prev) => prev + 1);
        setStatus("one user completed");
        // if the status is one user completed, update the status to completed
      } else if (status === "one user completed") {
        const updates = {
          status: "completed",
          completedUser: "all",
        };
        await updateToDB(
          requestId,
          "users",
          fromUserId,
          "sentRequests",
          updates
        );
        await updateToDB(
          requestId,
          "users",
          toUserId,
          "receivedRequests",
          updates
        );
        await updateToDB(requestedBookInfo.id, "books", null, null, {
          bookStatus: "completed",
        });
        await updateToDB(offeredBookInfo.id, "books", null, null, {
          bookStatus: "completed",
        });

        setStatus("completed");
        setUpdateTrigger((prev) => prev + 1);

        // Write exchange history for both users
        const historyEntryFrom = {
          myBook: offeredBookInfo,
          requestedBook: requestedBookInfo,
          fromUser: fromUserId,
          toUser: toUserId,
          isReviewed: false,
          date: new Date().toISOString(),
        };
        const historyEntryTo = {
          myBook: requestedBookInfo,
          requestedBook: offeredBookInfo,
          fromUser: toUserId,
          toUser: fromUserId,
          isReviewed: false,
          date: new Date().toISOString(),
        };
        await writeToDB(historyEntryFrom, "users", fromUserId, "history");
        await writeToDB(historyEntryTo, "users", toUserId, "history");
      }
    } catch (error) {
      console.error("Failed to complete the exchange request:", error);
      // Handle the error appropriately
    }
  };
  return status === "completed" ? null : (
    <View style={styles.container}>
      <Text>{date}</Text>
      {status === "unaccepted" &&
        (!offeredBookInfo ||
          !requestedBookInfo ||
          offeredBookInfo.bookStatus === "inExchange" ||
          requestedBookInfo.bookStatus === "inExchange") && (
          <Text>One or both books are no longer available</Text>
        )}
      <View style={styles.books}>
        <View style={styles.bookItem}>
          <Text>Offered:</Text>
          {offeredBookAvatar ? (
            <Image source={{ uri: offeredBookAvatar }} style={styles.image} />
          ) : (
            <AntDesign name="picture" size={50} color="grey" />
          )}
          {offeredBookInfo ? (
            <View style={styles.bookLabel}>
              <CustomButton
                onPress={() =>
                  handlePressBook({
                    id: offeredBookInfo.id,
                    owner: offeredBookInfo.owner,
                  })
                }
              >
                <Text style={styles.text}>{offeredBookInfo.bookName}</Text>
              </CustomButton>
              {offeredBookInfo.bookStatus === "inExchange" && (
                <AntDesign name="swap" size={24} color="red" />
              )}
            </View>
          ) : (
            <Text style={styles.text}>Unavailable</Text>
          )}
        </View>
        <View style={styles.bookItem}>
          <Text>Requested:</Text>
          {requestedBookAvatar ? (
            <Image source={{ uri: requestedBookAvatar }} style={styles.image} />
          ) : (
            <AntDesign name="picture" size={50} color="grey" />
          )}
          {requestedBookInfo ? (
            <View style={styles.bookLabel}>
              <CustomButton
                onPress={() =>
                  handlePressBook({
                    id: requestedBookInfo.id,
                    owner: requestedBookInfo.owner,
                  })
                }
              >
                <Text>{requestedBookInfo.bookName}</Text>
              </CustomButton>
              {requestedBookInfo.bookStatus === "inExchange" && (
                <AntDesign name="swap" size={24} color="red" />
              )}
            </View>
          ) : (
            <Text>Unavailable</Text>
          )}
        </View>
      </View>
      {tab === "outgoing" && status === "unaccepted" ? (
        <CustomButton onPress={() => handleCancelAndReject()}>
          <Text style={styles.text}>Cancel</Text>
        </CustomButton>
      ) : tab === "incoming" && status === "unaccepted" ? (
        <View style={styles.buttonView}>
          {offeredBookInfo &&
            requestedBookInfo &&
            offeredBookInfo.bookStatus !== "inExchange" &&
            requestedBookInfo.bookStatus !== "inExchange" && (
              <CustomButton onPress={() => handleAccept()}>
                <Text>Accept</Text>
              </CustomButton>
            )}
          <CustomButton onPress={() => handleCancelAndReject()}>
            <Text>Reject</Text>
          </CustomButton>
        </View>
      ) : status === "accepted" ? (
        <View style={styles.buttonView}>
          <CustomButton onPress={() => handleComplete()}>
            <Text style={styles.text}>Complete</Text>
          </CustomButton>
          <CustomButton onPress={() => handleAcceptAfterCancel()}>
            <Text style={styles.text}>Cancel</Text>
          </CustomButton>
        </View>
      ) : status === "one user completed" &&
        initialCompletedUser === auth.currentUser.uid ? (
        <Text style={styles.waiting}>
          Waiting for the other user to complete
        </Text>
      ) : status === "one user completed" &&
        initialCompletedUser !== auth.currentUser.uid ? (
        <CustomButton onPress={() => handleComplete()}>
          <Text style={styles.text}>Waiting for you to complete</Text>
        </CustomButton>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  books: {
    flexDirection: "row",
    justifyContent: "space-around",
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
  bookLabel: {
    alignItems: "center",
  },
  bookItem: {
    width: "45%",
    alignItems: "center",
  },
  image: {
    width: 70,
    height: 70,
    borderRadius: 10,
  },
  buttonView: {
    flexDirection: "row",
    justifyContent: "space-evenly",
  },
  waiting: {
    color: "red",
    alignSelf: "center",
  },
  text: {
    alignSelf: "center",
  },
});
