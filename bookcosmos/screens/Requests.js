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
import { convertTimestamp } from "../utils/Utils";
import RequestCard from "../components/RequestCard";
import { useFocusEffect } from "@react-navigation/native";
import CustomButton from "../components/CustomButton";
import { fetchExtra } from "../firebase-files/firestoreHelper";
import { useCustomFonts } from "../hooks/UseFonts";
import { activityIndicatorStyles } from "../styles/CustomStyles";
import { requestsStyles } from "../styles/ScreenStyles";

// Requests component to display the incoming and outgoing requests
export default function Requests({ navigation }) {
  const [activeTab, setActiveTab] = useState("outgoing");
  const [requests, setRequests] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [updateTrigger, setUpdateTrigger] = useState(0);
  const styles = requestsStyles;
  const { fontsLoaded } = useCustomFonts();
  if (!fontsLoaded) {
    return null;
  }

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
          const filteredDocs = querySnapshot.docs.filter((doc) => {
            return doc.data() && doc.data().status !== "completed";
          });
          const promises = filteredDocs.map((doc) => fetchExtra(doc));
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

  // Filter completed requests
  const completedRequests = requests.filter(
    (request) => request.status === "completed"
  );

  return (
    <View style={styles.container}>
      <View style={styles.tabs}>
        <CustomButton
          customStyle={[
            styles.tab,
            activeTab === "outgoing" && styles.activeTab,
          ]}
          onPress={() => setActiveTab("outgoing")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "outgoing" && styles.activeTabText,
            ]}
          >
            Outgoing
          </Text>
        </CustomButton>
        <CustomButton
          customStyle={[
            styles.tab,
            activeTab === "incoming" && styles.activeTab,
          ]}
          onPress={() => setActiveTab("incoming")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "incoming" && styles.activeTabText,
            ]}
          >
            Incoming
          </Text>
        </CustomButton>
      </View>
      {isLoading ? (
        <ActivityIndicator
          size={activityIndicatorStyles.size}
          color={activityIndicatorStyles.color}
          style={activityIndicatorStyles.style}
        />
      ) : completedRequests.length === requests.length ? (
        <Text style={styles.noRequestsText}>No requests</Text>
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
