import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from "react";
import CustomButton from './CustomButton';  
import { deleteFROMDB, updateToDB} from '../firebase-files/firestoreHelper';  
import { AntDesign } from '@expo/vector-icons'; 
import {auth} from '../firebase-files/firebaseSetup';

export default function RequestCard({date, requestedBookInfo, offeredBookInfo, navigation, tab, requestId, fromUserId, toUserId, initialStatus, initialCompletedUser, setUpdateTrigger}) {   
    const [status, setStatus] = useState(initialStatus);  

    const handlePressBook = ({id, owner}) => {
          navigation.navigate("Book Detail", {
            bookId: id,
            ownerId: owner,
          });
      }; 

      const handleCancelAndReject = async () => {  
        try {
          // Wait for each delete operation to complete
          await deleteFROMDB(requestId, "users", fromUserId, "sentRequests");   
          console.log("Deleted from sentRequests");
          
          await deleteFROMDB(requestId, "users", toUserId, "receivedRequests");
          console.log("Deleted from receivedRequests");
      
          // Check if offeredBookInfo exists and its status before updating
          if (offeredBookInfo && offeredBookInfo.bookStatus !== "inExchange") {
            await updateToDB(offeredBookInfo.id, "books", null, null, {bookStatus: "free"}); 
            console.log("Updated offered book status to free"); 
          }
        } catch (err) {
          console.error("Failed to cancel the exchange request:", err);
          // Handle the error, possibly update UI to show an error message
        }
      }; 

    const handleAccept = async () => {
        try {
          // Wait for each update operation to complete
          await updateToDB(requestId, "users", toUserId, "receivedRequests", {status: "accepted"}); 
          console.log("Updated received request status to accepted"); 
          
          await updateToDB(requestId, "users", fromUserId, "sentRequests", {status: "accepted"});  
          console.log("Updated sent request status to accepted"); 
          
          await updateToDB(offeredBookInfo.id, "books", null, null, {bookStatus: "inExchange"});  
          console.log("Updated offered book status to inExchange", offeredBookInfo.bookName);   
          setUpdateTrigger((prev) => prev + 1);
        
          await updateToDB(requestedBookInfo.id, "books", null, null, {bookStatus: "inExchange"});  
          console.log("Updated requested book status to inExchange", requestedBookInfo.bookName);   
      
          setStatus("accepted"); // Assuming setStatus updates the component state
        } catch (err) {
          console.error("Failed to accept the exchange request:", err);
          // Handle the error, possibly update UI to show an error message
        }
      }; 

      const handleComplete = async () => {  
          try { 
            if (status === "accepted") {
            const updates = { 
              status: "one user completed", 
              completedUser: auth.currentUser.uid
            };
            await updateToDB(requestId, "users", fromUserId, "sentRequests", updates); 
            await updateToDB(requestId, "users", toUserId, "receivedRequests", updates);  
            
            setUpdateTrigger((prev) => prev + 1); 
            setStatus("one user completed");  
             }  else if (status === "one user completed") {  
            const updates = { 
              status: "completed",  
              completedUser: "all", 
              requestedTime: new Date().toISOString(),
             }  
            await updateToDB(requestId, "users", fromUserId, "sentRequests", updates); 
            await updateToDB(requestId, "users", toUserId, "receivedRequests", updates);  
            await updateToDB(requestedBookInfo.id, "books", null, null, {bookStatus: "completed"});  
            await updateToDB(offeredBookInfo.id, "books", null, null, {bookStatus: "completed"});   
            setUpdateTrigger((prev) => prev + 1);
            setStatus("completed");
            }
          } catch (error) {
            console.error("Failed to complete the exchange request:", error);
            // Handle the error appropriately
          }
        }; 
  return ( 
    status === "completed" ? null : (
    <View style={styles.container}>
      <Text>{date}</Text> 
      {
        status === "unaccepted" && (!offeredBookInfo || !requestedBookInfo || offeredBookInfo.bookStatus === "inExchange" || requestedBookInfo.bookStatus === "inExchange") && (
            <Text>One or both books are no longer available</Text> 
        )
         }
      <View style={styles.books}>  
        <View style={styles.bookItem}>
                <Text>Offered:</Text> 
                {
                    offeredBookInfo ? (
                    <View style={styles.bookLabel}> 
                    <CustomButton  
                      onPress={() => handlePressBook({id: offeredBookInfo.id, owner: offeredBookInfo.owner})}  
                      > 
                        <Text style={styles.text}>{offeredBookInfo.bookName}</Text> 
                    </CustomButton>  
                    {offeredBookInfo.bookStatus === "inExchange" && ( 
                        <AntDesign name="swap" size={24} color="red" /> 
                    )}
                    </View>
                    ) : ( 
                        <Text style={styles.text}>Unavailable</Text> 
                    )
                }
        </View>  
        <View style={styles.bookItem}>
            <Text>Requested:</Text> 
            {
                requestedBookInfo ? (
                    <View style={styles.bookLabel}>
                    <CustomButton  
                      onPress={() => handlePressBook({id: requestedBookInfo.id, owner: requestedBookInfo.owner})}  
                    > 
                        <Text>{requestedBookInfo.bookName}</Text> 
                    </CustomButton>  
                    {requestedBookInfo.bookStatus === "inExchange" && ( 
                        <AntDesign name="swap" size={24} color="red" /> 
                    )}
                    </View>
                ) : ( 
                    <Text>Unavailable</Text> 
                )
                }
        </View>  
  </View> 
    {tab === "outgoing" && status === "unaccepted"? (
        <CustomButton onPress={() => handleCancelAndReject()}> 
            <Text style={styles.text}>Cancel</Text> 
        </CustomButton>
        ) : tab === "incoming" && status === "unaccepted" ? ( 
        <View style={styles.buttonView}> 
            {
            offeredBookInfo && requestedBookInfo && offeredBookInfo.bookStatus !== "inExchange" && requestedBookInfo.bookStatus !== "inExchange" && (
                <CustomButton onPress={() => handleAccept()}>
                <Text>Accept</Text>
                </CustomButton>
            )
            }
            <CustomButton onPress={() => handleCancelAndReject()}> 
            <Text>Reject</Text> 
            </CustomButton> 
        </View>  
        ) : status === "accepted"? (
            <CustomButton onPress={() => handleComplete()}> 
            <Text style={styles.text}>Complete</Text> 
            </CustomButton>  
        ) : status === "one user completed" && initialCompletedUser === auth.currentUser.uid? ( 
            <Text style={styles.waiting}>Waiting for the other user to complete</Text> 
        ) : status === "one user completed" && initialCompletedUser !== auth.currentUser.uid? ( 
            <CustomButton onPress={() => handleComplete()}> 
            <Text style={styles.text}>Waiting for you to complete</Text> 
            </CustomButton>  
        )
        :  null}
  </View> 
    )
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
        backgroundColor: '#fff',
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