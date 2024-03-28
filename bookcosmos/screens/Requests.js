import { StyleSheet, Text, View, FlatList} from "react-native";
import React, { useState, useEffect } from 'react';
import { collection, getDoc, query, onSnapshot, doc} from 'firebase/firestore'; 
import { database, auth} from "../firebase-files/firebaseSetup";  
import { convertTimestamp } from "../Utils";
import CustomButton from "../components/CustomButton"; 
import RequestCard from "../components/RequestCard";

export default function Requests({navigation}) { 
  const [activeTab, setActiveTab] = useState("incoming"); 
  const [requests, setRequests] = useState([]); 
  useEffect(() => {
    let subcollectionName = activeTab === "incoming" ? "receivedRequests" : "sentRequests"; 
  
    async function fetchBookInfo(bookId) {
      const bookRef = doc(database, "books", bookId);
      const bookSnap = await getDoc(bookRef);
      return bookSnap.exists() ? bookSnap.data(): null;
    }
  
    const fetchExtra = async (doc) => {
      const docData = doc.data();
      // Fetch additional details
      const offeredBookInfo = await fetchBookInfo(docData.offeredBook); 
      const requestedBookInfo = await fetchBookInfo(docData.requestedBook);
      return {
        ...docData,
        id: doc.id,
        offeredBookInfo,
        requestedBookInfo,
      };
    };
  
    const q = query(collection(database, "users", auth.currentUser.uid, subcollectionName));  
    const unsubscribe = onSnapshot(q, async (querySnapshot) => {
      const promises = querySnapshot.docs.map(doc => fetchExtra(doc));
      const newArray = await Promise.all(promises); 
      const updatedArray = newArray.map((item) => ({ 
        ...item, 
        date: convertTimestamp(item.requestedTime), 
      }));
      setRequests(updatedArray);
    }, (err) => { console.log(err); }
    );  
    return () => unsubscribe(); 
  }, [activeTab]);  

  console.log(requests);
  return ( 
  <View>
    <View style={styles.tabs}>
    <CustomButton onPress={() => setActiveTab("incoming")}>
      <Text>Incoming</Text>
    </CustomButton>
    <CustomButton onPress={() => setActiveTab("outgoing")}>
      <Text>Outgoing</Text>
    </CustomButton> 
    </View> 
    <FlatList  
      data={requests}   
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => ( 
        <RequestCard
          date={item.date}
          requestedBookInfo={ item.requestedBookInfo}
          offeredBookInfo={item.offeredBookInfo} 
          navigation={navigation}
        />    
      ) 
    } 
    /> 
  </View>
  );
}

const styles = StyleSheet.create({ 
  tabs: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 10,
  },
});
