import React, { useState, useEffect, memo} from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import Swipeable from "react-native-gesture-handler/Swipeable";
import CustomButton from "./CustomButton";
import AntDesign from "react-native-vector-icons/AntDesign";
import { storage } from "../firebase-files/firebaseSetup";
import { ref, getDownloadURL } from "firebase/storage";
import { useCustomFonts } from "../Fonts";

const ExploreBookCard = memo(({ item, isMyLibrary, handlePressBook, handleDeleteItem}) => {   
  console.log(item.bookName, item.bookStatus, isMyLibrary);
  const [bookAvatar, setBookAvatar] = useState(null);
  const { fontsLoaded } = useCustomFonts();
  if (!fontsLoaded) {
    return <Text>Loading...</Text>;
  }

  useEffect(() => {
    if (item.image) {
      const imageRef = ref(storage, item.image);
      getDownloadURL(imageRef)
        .then((url) => {
          setBookAvatar(url);
        })
        .catch((error) => {
          console.error("Failed to load image:", error);
        });
    }
  }, [item.image]); 


  function BookCardContent() {
    return (
      <View style={styles.itemContent}>
        {bookAvatar ? (
          <Image source={{ uri: bookAvatar }} style={styles.Image} />
        ) : (
          <AntDesign name="picture" size={50} color="grey" />
        )}
        <View style={styles.textContent}>
          {item.bookName && (
            <Text style={styles.titleText}>{item.bookName}</Text>
          )}
          {item.author && <Text style={styles.authorText}>{item.author}</Text>}
        </View>
      </View>
    );
  }
  const icon =
    item.bookStatus === "inExchange"
      ? "swap"
      : item.bookStatus === "pending"
      ? "swapright"
      : null;
  const content = (
    <View style={styles.item}>
      <CustomButton
        onPress={() => handlePressBook(item)}
        customStyle={styles.button}
      >
        <View style={styles.itemWithIcon}>
          <BookCardContent />
          {icon && <AntDesign name={icon} size={30} color="red" />}
        </View>
      </CustomButton>
    </View>
  );
  return item.bookStatus === "free" && isMyLibrary ? (
    <Swipeable
      renderRightActions={() => (
        <CustomButton
          onPress={() => handleDeleteItem(item)}
          customStyle={styles.deleteButton}
        >
          <AntDesign name="delete" size={24} color="#f44336" />
        </CustomButton>
      )}
    >
      {content}
    </Swipeable>
  ) : (
    content
  );
} ,  
(prevProps, nextProps) => {
  return prevProps.item.id === nextProps.item.id &&
         prevProps.item.image === nextProps.item.image && 
         prevProps.item.bookStatus === nextProps.item.bookStatus && 
         prevProps.item.bookName === nextProps.item.bookName &&  
         prevProps.item.author === nextProps.item.author &&
         prevProps.isMyLibrary === nextProps.isMyLibrary
}
); 

export default ExploreBookCard;

const styles = StyleSheet.create({
  item: {
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  itemContent: {
    flexDirection: "row",
  },
  textContent: {
    flex: 1,
    marginLeft: 10,
    justifyContent: "center",
    width: 20,
  },
  titleText: {
    fontFamily: "SecularOne_400Regular",
    fontSize: 18,
    fontWeight: "bold",
  },
  authorText: {
    fontFamily: "Molengo_400Regular",
    fontSize: 15,
  },
  button: {
    marginVertical: 0,
    padding: 5,
    width: "80%",
    alignItems: "stretch",
    justifyContent: "flex-start",
  },
  deleteButton: {
    marginVertical: 0,
    padding: 5,
  },
  Image: {
    width: 50,
    height: 50,
    borderRadius: 10,
  },
  itemWithIcon: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});
