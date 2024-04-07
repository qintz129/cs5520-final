import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import CustomButton from './CustomButton';
import AntDesign from 'react-native-vector-icons/AntDesign';

export default function BookCard({ item, handlePressBook, handleDeleteItem, isMyLibrary }) { 
  if (item.bookStatus === "inExchange") {
    return (
      <View style={styles.item}>
        <CustomButton onPress={() => handlePressBook(item)}>
        <View style={styles.itemContent}>  
            <AntDesign name="picture" size={50} color="grey" />
            <View style={styles.textContent}>
              {item.bookName && <Text style={styles.title}>{item.bookName}</Text>}
              {item.author && <Text>{item.author}</Text>}     
            </View>
          </View>
          <AntDesign name="swap" size={24} color="red" />
        </CustomButton>
      </View>
    );
  } else if (item.bookStatus === "pending") {
    return (
      <View style={styles.item}>
        <CustomButton onPress={() => handlePressBook(item)}> 
        <View style={styles.itemContent}>  
            <AntDesign name="picture" size={50} color="grey" />
            <View style={styles.textContent}>
              {item.bookName && <Text style={styles.title}>{item.bookName}</Text>}
              {item.author && <Text>{item.author}</Text>}     
            </View>
          </View>
          <AntDesign name="swapright" size={24} color="red" />
        </CustomButton>
      </View>
    );
  } else if (item.bookStatus === "free") {
    const content = (
      <View style={styles.item}>
        <CustomButton onPress={() => handlePressBook(item)}> 
          <View style={styles.itemContent}>  
            <AntDesign name="picture" size={50} color="grey" />
            <View style={styles.textContent}>
              {item.bookName && <Text style={styles.title}>{item.bookName}</Text>}
              {item.author && <Text>{item.author}</Text>}     
            </View>
          </View>
        </CustomButton>
      </View>
    );
    return isMyLibrary ? (
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
};

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
    }
});