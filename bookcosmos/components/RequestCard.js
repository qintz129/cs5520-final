import { StyleSheet, Text, View } from 'react-native'
import React from 'react' 
import CustomButton from './CustomButton';

export default function RequestCard({date, requestedBookInfo, offeredBookInfo, navigation}) { 
    const handlePressBook = (bookInfo) => {
          navigation.navigate("Book Detail", {
            bookId: bookInfo.id,
            ownerId: bookInfo.owner,
          });
      };
  return (
    <View style={styles.container}>
      <Text>{date}</Text>
      <View style={styles.books}>
        <View style={styles.bookItem}>
            <Text style={styles.text}>Requested:</Text> 
            {requestedBookInfo ? (
            <CustomButton onPress={() => handlePressBook(requestedBookInfo)}>
            <Text style={styles.text}>{requestedBookInfo.bookName}</Text>
            </CustomButton>
            ) : (
                <Text style={styles.text}>Unavailable</Text>
            )}
        </View>
        <View style={styles.bookItem}>
            <Text style={styles.text}>Offered:</Text> 
           {offeredBookInfo ? (<CustomButton onPress={() => handlePressBook(offeredBookInfo)}> 
                <Text style={styles.text}>{offeredBookInfo.bookName}</Text> 
            </CustomButton> 
            ) : ( 
                <Text style={styles.text}>Unavailable</Text> 
            )}
        </View>
    </View>
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
});