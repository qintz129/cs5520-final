import React, {useState} from 'react';
import { View, Text, StyleSheet, Image} from 'react-native';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import CustomButton from './CustomButton';
import AntDesign from 'react-native-vector-icons/AntDesign'; 
import { database, storage} from "../firebase-files/firebaseSetup"; 
import { ref, getDownloadURL} from "firebase/storage";



export default function BookCard({ item, handlePressBook, handleDeleteItem, isMyLibrary }) { 
  const [bookAvatar, setBookAvatar] = useState(null); 
  if (item.image) {
    const imageRef = ref(storage, item.image);
    getDownloadURL(imageRef).then((url) => {
      setBookAvatar(url);
    }).catch((error) => {
      console.log(error);
    });
  } 
  function BookCardContent(){
    return (
      <View style={styles.itemContent}>
        {bookAvatar ? (
          <Image source={{ uri: bookAvatar }} style={styles.Image} />
        ) : (
          <AntDesign name="picture" size={50} color="grey" />
        ) 
        }
        <View style={styles.textContent}>
          {item.bookName && <Text style={styles.title}>{item.bookName}</Text>}
          {item.author && <Text>{item.author}</Text>}
        </View>
      </View>
    );
  }
  const icon = item.bookStatus === "inExchange" ? "swap" : item.bookStatus === "pending" ? "swapright" : null;
  const content = (
    <View style={styles.item}>
      <CustomButton onPress={() => handlePressBook(item)}> 
        <BookCardContent/>
        {icon && <AntDesign name={icon} size={24} color="red" />}
      </CustomButton>
    </View>
  );
  return item.bookStatus === "free" && isMyLibrary ? (
    <Swipeable
      renderRightActions={() => (
        <CustomButton onPress={() => handleDeleteItem(item)} customStyle={styles.button}>
          <AntDesign name="delete" size={24} color="black" />
        </CustomButton>
      )}
    >
      {content}
    </Swipeable>
  ) : content;
}

const styles = StyleSheet.create({
    item: {
        alignItems: 'center', 
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: "#ccc",
      }, 
    itemContent: {
        flexDirection: "row",
        alignItems: "center",
    }, 
    textContent: { 
        marginLeft: 10
    }, 
    title: {
        fontSize: 18,
        fontWeight: "bold",
    },
    button: {
        padding: 10, 
        marginVertical: 0
    }, 
    Image: {
        width: 50,
        height: 50,
        borderRadius: 10,
    },
});