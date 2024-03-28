import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from "react";
import CustomButton from './CustomButton';  
import { deleteFROMDB, updateToDB} from '../firebase-files/firestoreHelper';  
import { auth } from '../firebase-files/firebaseSetup';

export default function RequestCard({date, requestedBookInfo, offeredBookInfo, navigation, tab, requestId}) {  

    const handlePressBook = ({id, owner}) => {
          navigation.navigate("Book Detail", {
            bookId: id,
            ownerId: owner,
          });
      }; 

    const handleCancel = () => {  
        deleteFROMDB(requestId, "users", auth.currentUser.uid, "sentRequests");   
        if (offeredBookInfo){
        updateToDB(offeredBookInfo.id, "books", {bookStatus: "free"}); 
        }
    }  

    const handleAccept = () => {  
        console.log("Accepting request");
    } 

    const handleReject = () => {  
        console.log("Rejecting request");
    } 
  return (
    <View style={styles.container}>
      <Text>{date}</Text>
      <View style={styles.books}>
        <View style={styles.bookItem}>
            <Text style={styles.text}>Requested:</Text> 
            {requestedBookInfo ? (
            <CustomButton onPress={() => handlePressBook({id: requestedBookInfo.id, owner: requestedBookInfo.owner})}>
            <Text style={styles.text}>{requestedBookInfo.bookName}</Text>
            </CustomButton>
            ) : (
                <Text style={styles.text}>Unavailable</Text>
            )}
        </View>
        <View style={styles.bookItem}>
            <Text style={styles.text}>Offered:</Text> 
           {offeredBookInfo ? (<CustomButton onPress={() => handlePressBook({id: offeredBookInfo.id, owner: offeredBookInfo.owner})}> 
                <Text style={styles.text}>{offeredBookInfo.bookName}</Text> 
            </CustomButton> 
            ) : ( 
                <Text style={styles.text}>Unavailable</Text> 
            )}
        </View>    
    </View> 
    {tab === "outgoing" ? (
            <CustomButton onPress={() => handleCancel()}> 
                <Text style={styles.text}>Cancel</Text> 
            </CustomButton>
        ) : (  
            <View style={styles.buttonView}> 
                {offeredBookInfo && requestedBookInfo && (
                <CustomButton onPress={() => handleAccept()}> 
                    <Text style={styles.text}>Accept</Text> 
                </CustomButton>  
                )
                }
                <CustomButton onPress={() => handleReject()}> 
                    <Text style={styles.text}>Reject</Text> 
                </CustomButton> 
            </View>
        )
    } 
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
    text: {
       alignSelf: "center",
    }, 
    bookItem: {
        width: "45%",
        padding: 10,
    }, 
    buttonView: {
        flexDirection: "row",
        justifyContent: "space-evenly",
      },
});