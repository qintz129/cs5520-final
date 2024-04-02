import {
  StyleSheet,
  Text,
  View,
  FlatList,
  ActivityIndicator,
} from "react-native";
import React, { useState } from "react";
import { collection, query, onSnapshot } from "firebase/firestore";
import { database, auth } from "../firebase-files/firebaseSetup";
import { convertTimestamp } from "../Utils";
import RequestCard from "../components/RequestCard";
import { useFocusEffect } from "@react-navigation/native";
import CustomButton from "../components/CustomButton";
import { fetchExtra } from "../firebase-files/firestoreHelper";

// Requests component to display the incoming and outgoing requests
export default function Requests({ navigation }) {
  const [activeTab, setActiveTab] = useState("incoming");
  const [requests, setRequests] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [updateTrigger, setUpdateTrigger] = useState(0);
 
  // useFocusEffect hook to fetch the incoming and outgoing requests. 
  // Similar to useEffect, but it specifically runs when the screen comes into focus or goes out of focus.  
  // It is useful when you delete a book and come back to the screen, the book should not be there anymore.
  useFocusEffect( 
    // Fetch the incoming and outgoing requests
    React.useCallback(() => {
      setLoading(true);
      let subcollectionName =
        activeTab === "incoming" ? "receivedRequests" : "sentRequests";
      const q = query(
        collection(database, "users", auth.currentUser.uid, subcollectionName)
      );
      const unsubscribe = onSnapshot(
        q,
        async (querySnapshot) => {
          const promises = querySnapshot.docs.map((doc) => fetchExtra(doc));
          const newArray = await Promise.all(promises);
          const updatedArray = newArray.map((item) => ({
            ...item,
            date: convertTimestamp(item.requestedTime),
          }));
          setRequests(updatedArray);
          setLoading(false);
        },
        (err) => {
          console.log(err);
        }
      );
      return () => unsubscribe();
    }, [activeTab, updateTrigger]) // updateTrigger is triggered when any info in the request is updated
  );

  return (
    <View style={styles.container}>
      <View style={styles.tabs}>
        <CustomButton onPress={() => setActiveTab("incoming")}>
          <Text>Incoming</Text>
        </CustomButton>
        <CustomButton onPress={() => setActiveTab("outgoing")}>
          <Text>Outgoing</Text>
        </CustomButton>
      </View>
      {isLoading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <FlatList
          data={requests}
          renderItem={({ item }) => (
            <RequestCard
              date={item.date}
              requestedBookInfo={item.requestedBookInfo}
              offeredBookInfo={item.offeredBookInfo}
              navigation={navigation}
              requestId={item.id}
              tab={activeTab}
              fromUserId={item.fromUser}
              toUserId={item.toUser}
              initialStatus={item.status}
              initialCompletedUser={
                item.completedUser ? item.completedUser : null
              }
              setUpdateTrigger={setUpdateTrigger}
            />
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  tabs: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 10,
  },
  container: {
    flex: 1,
  },
});
