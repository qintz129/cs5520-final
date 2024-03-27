import { StyleSheet, Text, View } from "react-native";
import React, { useState, useEffect } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore'; 
import { database, auth} from "../firebase-files/firebaseSetup"; 
import CustomButton from "../components/CustomButton";

export default function Requests() { 
  const [activeTab, setActiveTab] = useState("incoming"); 
  const [requests, setRequests] = useState([]); 
  useEffect(() => {
    const fetchRequests = async () => {
      let subcollectionName = activeTab === "incoming" ? "receivedRequests" : "sentRequests";
      const q = query(collection(database, "users", auth.currentUser.uid, subcollectionName));
      const querySnapshot = await getDocs(q);
      const fetchedRequests = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setRequests(fetchedRequests);
    };

    fetchRequests();
  }, [activeTab]); 

  console.log(requests);
  return (
    <View style={styles.tabs}>
    <CustomButton onPress={() => setActiveTab("incoming")}>
      <Text>Incoming</Text>
    </CustomButton>
    <CustomButton onPress={() => setActiveTab("outgoing")}>
      <Text>Outgoing</Text>
    </CustomButton>
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
