import {
  StyleSheet,
  Text,
  View,
  Image,
  Alert,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import CustomButton from "./CustomButton";
import {
  deleteFromDB,
  updateToDB,
  writeToDB,
} from "../firebase-files/firestoreHelper";
import { AntDesign } from "@expo/vector-icons";
import { auth, database } from "../firebase-files/firebaseSetup";
import { storage } from "../firebase-files/firebaseSetup";
import { ref, getDownloadURL } from "firebase/storage";
import { useCustomFonts } from "../hooks/UseFonts";
import { onSnapshot, doc } from "firebase/firestore";
import { COLORS } from "../styles/Colors";
import { requestCardStyles } from "../styles/ComponentStyles";

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
  const [isCancelAndRejectLoading, setIsCancelAndRejectLoading] =
    useState(false);
  const [isAcceptLoading, setIsAcceptLoading] = useState(false);
  const [isCancelAfterAcceptLoading, setIsCancelAfterAcceptLoading] =
    useState(false);
  const [isCompleteLoading, setIsCompleteLoading] = useState(false);
  const styles = requestCardStyles;
  const { fontsLoaded } = useCustomFonts();
  if (!fontsLoaded) {
    return null;
  }

  useEffect(() => {
    if (offeredBookInfo && offeredBookInfo.image) {
      const imageRef = ref(storage, offeredBookInfo.image);
      getDownloadURL(imageRef)
        .then((url) => {
          setOfferedBookAvatar(url);
        })
        .catch((error) => {
          console.error("Failed to load image:", error);
        });
    }
  }, [offeredBookInfo]);

  useEffect(() => {
    if (requestedBookInfo && requestedBookInfo.image) {
      const imageRef = ref(storage, requestedBookInfo.image);
      getDownloadURL(imageRef)
        .then((url) => {
          setRequestedBookAvatar(url);
        })
        .catch((error) => {
          console.error("Failed to load image:", error);
        });
    }
  }, [requestedBookInfo]);

  useEffect(() => {
    let subcollectionName =
      tab === "incoming" ? "receivedRequests" : "sentRequests";
    const docRef = doc(
      database,
      "users",
      auth.currentUser.uid,
      subcollectionName,
      requestId
    );

    const unsubscribe = onSnapshot(
      docRef,
      (docSnapshot) => {
        if (docSnapshot.exists()) {
          const requestData = docSnapshot.data();
          setStatus(requestData.status);
        } else {
          console.log("No such document!");
        }
      },
      (error) => {
        console.error("Failed to fetch data: ", error);
      }
    );

    return () => {
      unsubscribe();
    };
  }, [tab, requestId, offeredBookInfo, requestedBookInfo]);

  const handlePressBook = ({ id, owner }) => {
    navigation.navigate("Book Detail", {
      bookId: id,
      ownerId: owner,
    });
  };

  // Function to handle the cancel and reject button,
  const handleCancelAndReject = async (action) => {
    try {
      // Show a confirmation dialog before proceeding
      const confirmationText =
        action === "cancel"
          ? "Are you sure you want to cancel this request?"
          : "Are you sure you want to reject this request?";

      // Show an alert dialog to confirm the action
      Alert.alert("Confirm", confirmationText, [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Confirm",
          onPress: async () => {
            setIsCancelAndRejectLoading(true);
            // Wait for each delete operation to complete
            await deleteFromDB(requestId, "users", fromUserId, "sentRequests");
            console.log("Deleted from sentRequests");

            await deleteFromDB(
              requestId,
              "users",
              toUserId,
              "receivedRequests"
            );
            console.log("Deleted from receivedRequests");

            // Check if offeredBookInfo exists and its status before updating, update the offered book status to free
            if (
              offeredBookInfo &&
              offeredBookInfo.bookStatus !== "inExchange"
            ) {
              await updateToDB(offeredBookInfo.id, "books", null, null, {
                bookStatus: "free",
              });
              console.log("Updated offered book status to free");
            }

            if (action === "cancel") {
              Alert.alert(
                "Request Cancelled",
                "The request has been cancelled"
              );
            } else if (action === "reject") { 
              // Write the rejected request to the history
              const historyEntryForm = {
                myBook: offeredBookInfo.id,
                requestedBook: requestedBookInfo.id,
                fromUser: fromUserId,
                toUser: toUserId,
                isReviewed: false,
                date: new Date().toISOString(),
                status: "rejected",
              };
              await writeToDB(historyEntryForm, "users", fromUserId, "history");
              await writeToDB(historyEntryForm, "users", toUserId, "history");
              Alert.alert("The request has been rejected");
            }
          },
        },
      ]);
    } catch (err) {
      console.error("Failed to cancel the exchange request:", err);
      // Handle the error, possibly update UI to show an error message
    } finally {
      setIsCancelAndRejectLoading(false);
    }
  };

  // Function to handle the accept button
  const handleAccept = async () => {
    try {
      Alert.alert("Confirm", "Are you sure you want to accept this request?", [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Confirm",
          onPress: async () => {
            setIsAcceptLoading(true);
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
            Alert.alert("The request has been accepted");
          },
        },
      ]);
    } catch (err) {
      console.error("Failed to accept the exchange request:", err);
      // Handle the error, possibly update UI to show an error message
    } finally {
      setIsAcceptLoading(false);
    }
  };
  // Function to handle the cancel after accept button
  const handleCancelAfterAccept = async () => {
    try {
      Alert.alert("Confirm", "Are you sure you want to cancel this request?", [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Confirm",
          onPress: async () => {
            setIsCancelAfterAcceptLoading(true);
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
            Alert.alert("The request has been cancelled");
          },
        },
      ]);
    } catch (err) {
      console.error("Failed to accept the exchange request:", err);
      // Handle the error, possibly update UI to show an error message
    } finally {
      setIsCancelAfterAcceptLoading(false);
    }
  };

  // Function to handle the complete button
  const handleComplete = async () => {
    try {
      Alert.alert(
        "Confirm",
        "Are you sure you want to complete this request?",
        [
          {
            text: "Cancel",
            style: "cancel",
          },
          {
            text: "Confirm",
            onPress: async () => {
              setIsCompleteLoading(true);
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
                Alert.alert("The exchange has been completed");
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
                // Write the completed request to the history
                const historyEntryForm = {
                  myBook: requestedBookInfo.id,
                  requestedBook: offeredBookInfo.id,
                  fromUser: toUserId,
                  toUser: fromUserId,
                  isReviewed: false,
                  date: new Date().toISOString(),
                  status: "completed",
                };
                await writeToDB(historyEntryForm, "users",fromUserId,"history");
                await writeToDB(historyEntryForm, "users", toUserId, "history");
                Alert.alert("The exchange has been completed");
              }
            },
          },
        ]
      );
    } catch (error) {
      console.error("Failed to complete the exchange request:", error);
      // Handle the error appropriately
    } finally {
      setIsCompleteLoading(false);
    }
  };
  return status === "completed" ? null : (
    <View style={styles.container}>
      <View style={styles.dateContainer}>
        <Text style={styles.dateText}>{date}</Text>
      </View>
      {status === "unaccepted" &&
        (!offeredBookInfo ||
          !requestedBookInfo ||
          offeredBookInfo.bookStatus === "inExchange" ||
          requestedBookInfo.bookStatus === "inExchange") && (
          <Text style={styles.noLongerAvailableText}>
            One or both books are no longer available
          </Text>
        )}
      <View style={styles.books}>
        <View style={styles.bookItem}>
          <Text style={styles.offeredText}>Offered</Text>
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
                {offeredBookAvatar ? (
                  <Image
                    source={{ uri: offeredBookAvatar }}
                    style={styles.image}
                  />
                ) : (
                  <AntDesign
                    name="picture"
                    size={styles.pictureIconSize}
                    color={COLORS.grey}
                  />
                )}
                <Text style={styles.requestCardText}>
                  {offeredBookInfo.bookName}
                </Text>
              </CustomButton>
              {offeredBookInfo.bookStatus === "inExchange" && (
                <AntDesign
                  name="swap"
                  size={styles.swapIconSize}
                  color={COLORS.red}
                />
              )}
            </View>
          ) : (
            <Text style={styles.requestCardText}>Unavailable</Text>
          )}
        </View>
        <View style={styles.bookItem}>
          <Text style={styles.requestedText}>Requested</Text>
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
                {requestedBookAvatar ? (
                  <Image
                    source={{ uri: requestedBookAvatar }}
                    style={styles.image}
                  />
                ) : (
                  <AntDesign
                    name="picture"
                    size={styles.pictureIconSize}
                    color={COLORS.grey}
                  />
                )}
                <Text style={styles.requestCardText}>
                  {requestedBookInfo.bookName}
                </Text>
              </CustomButton>
              {requestedBookInfo.bookStatus === "inExchange" && (
                <AntDesign
                  name="swap"
                  size={styles.swapIconSize}
                  color={COLORS.red}
                />
              )}
            </View>
          ) : (
            <Text style={styles.requestCardText}>Unavailable</Text>
          )}
        </View>
      </View>
      {tab === "outgoing" && status === "unaccepted" ? (
        <CustomButton
          customStyle={styles.outgoingCancelButton}
          onPress={() => handleCancelAndReject("cancel")}
        >
          {isCancelAndRejectLoading ? (
            <ActivityIndicator color={COLORS.white} />
          ) : (
            <Text style={styles.buttonText}>Cancel</Text>
          )}
        </CustomButton>
      ) : tab === "incoming" && status === "unaccepted" ? (
        <View style={styles.buttonView}>
          <CustomButton
            customStyle={styles.rejectButton}
            onPress={() => handleCancelAndReject("reject")}
          >
            {isCancelAndRejectLoading ? (
              <ActivityIndicator color={COLORS.white} />
            ) : (
              <Text style={styles.buttonText}>Reject</Text>
            )}
          </CustomButton>
          {offeredBookInfo &&
            requestedBookInfo &&
            offeredBookInfo.bookStatus !== "inExchange" &&
            requestedBookInfo.bookStatus !== "inExchange" && (
              <CustomButton
                customStyle={styles.acceptButton}
                onPress={() => handleAccept()}
              >
                {isAcceptLoading ? (
                  <ActivityIndicator color={COLORS.white} />
                ) : (
                  <Text style={styles.buttonText}>Accept</Text>
                )}
              </CustomButton>
            )}
        </View>
      ) : status === "accepted" ? (
        <>
          {offeredBookInfo.owner !== auth.currentUser.uid ? (
            <Text style={styles.addressText}>
              Shipping Address: {"\n"}
              {offeredBookInfo.address}{" "}
            </Text>
          ) : (
            <Text style={styles.addressText}>
              Shipping Address: {"\n"}
              {requestedBookInfo.address}{" "}
            </Text>
          )}
          <View style={styles.buttonView}>
            <CustomButton
              customStyle={styles.cancelButton}
              onPress={() => handleCancelAfterAccept()}
            >
              {isCancelAfterAcceptLoading ? (
                <ActivityIndicator color={COLORS.white} />
              ) : (
                <Text style={styles.buttonText}>Cancel</Text>
              )}
            </CustomButton>
            <CustomButton
              customStyle={styles.completeButton}
              onPress={() => handleComplete()}
            >
              {isCompleteLoading ? (
                <ActivityIndicator color={COLORS.white} />
              ) : (
                <Text style={styles.buttonText}>Complete</Text>
              )}
            </CustomButton>
          </View>
        </>
      ) : status === "one user completed" &&
        initialCompletedUser === auth.currentUser.uid ? (
        <Text style={styles.waitingText}>
          Waiting for the other user to complete
        </Text>
      ) : status === "one user completed" &&
        initialCompletedUser !== auth.currentUser.uid ? (
        <CustomButton
          customStyle={styles.waitingButton}
          onPress={() => handleComplete()}
        >
          {isCompleteLoading ? (
            <ActivityIndicator color={COLORS.white} />
          ) : (
            <Text style={styles.buttonText}>Waiting for you to complete</Text>
          )}
        </CustomButton>
      ) : null}
    </View>
  );
}
