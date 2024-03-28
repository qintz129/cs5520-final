import { StyleSheet, Text, View, FlatList, ActivityIndicator} from "react-native";
import React, { useEffect, useState } from "react";
import {
  collection,
  onSnapshot,
  query,
  where,
  doc,
  getDocs,
} from "firebase/firestore";
import { database, auth } from "../firebase-files/firebaseSetup";
import { convertTimestamp } from "../Utils";
import HistoryCard from "../components/HistoryCard";  
import { fetchExtra } from "../firebase-files/firestoreHelper";

export default function History({ navigation }) {
  const [history, setHistory] = useState([]); 
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    const fetchHistory = async () => {
      setLoading(true); 
      const userId = auth.currentUser.uid; // Assuming auth.currentUser.uid is available
      const sentRequestsQuery = query(
        collection(database, "users", userId, "sentRequests"),
        where("status", "==", "completed")
      );
      const receivedRequestsQuery = query(
        collection(database, "users", userId, "receivedRequests"),
        where("status", "==", "completed")
      );
  
      try {
        // Fetch and process sentRequests
        const sentRequestsSnapshot = await getDocs(sentRequestsQuery);
        const sentPromises = sentRequestsSnapshot.docs.map(fetchExtra);
        const sentResults = await Promise.all(sentPromises);
  
        // Fetch and process receivedRequests
        const receivedRequestsSnapshot = await getDocs(receivedRequestsQuery);
        const receivedPromises = receivedRequestsSnapshot.docs.map(fetchExtra);
        const receivedResults = await Promise.all(receivedPromises);
  
        // Combine and set the history state with both sent and received completed requests
        const combinedHistory = [...sentResults, ...receivedResults]; 
        const updatedHistory = combinedHistory.map((item) => ({  
          ...item,
          date: convertTimestamp(item.requestedTime),
        }));
        setHistory(updatedHistory);
      } catch (error) {
        console.error("Error fetching history:", error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchHistory(); 
  }, [auth.currentUser.uid]); 

  console.log(history);

  return (
    <View style={styles.container}> 
      {isLoading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
      <FlatList
        data={history}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) =>
          item.fromUser === auth.currentUser.uid ? (
            <HistoryCard
              myBook={item.offeredBookInfo.bookName}
              theirBook={item.requestedBookInfo.bookName}
              date={item.date}
              navigation={navigation}
              reviewee={item.toUser}
              reviewer={item.fromUser} 
              exchangeId={item.id}
            />
          ) : item.toUser === auth.currentUser.uid ? (
            <HistoryCard
              myBook={item.requestedBookInfo.bookName}
              theirBook={item.offeredBookInfo.bookName}
              date={item.date}
              navigation={navigation}
              reviewee={item.fromUser}
              reviewer={item.toUser} 
              exchangeId={item.id}
            />
          ) : null // This is needed to handle the case where neither condition is true, though based on your logic this case may never happen.
        }
      /> 
      )}
    </View> 
  );
}

const styles = StyleSheet.create({  
  container: {
    flex: 1,
  },

});
