import { StyleSheet, Text, View } from 'react-native'
import React from 'react' 
import CustomButton from './CustomButton'

export default function HistoryCard({myBook, theirBook, date, status}) { 
    const handleReview = () => {
        return;
    }
  return (
    <View style={styles.container}>  
        <View style={styles.status}>
            <Text>{date}</Text>  
            <Text>{status}</Text>  
        </View>
        <View style={styles.books}>  
            <Text>My book: {myBook}</Text>  
            <Text>Their book: {theirBook}</Text>
        </View>  
        {status === "completed" && (<CustomButton onPress={handleReview}>  
            <Text>Review</Text> 
        </CustomButton>)}
    </View>
  )
}

const styles = StyleSheet.create({   
    status: { 
        marginLeft: 35,
    },
    books: {
        flexDirection: 'row',
        justifyContent: 'space-around'
    },  
    container: { 
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: "#ccc",
    }
})