import {
  StyleSheet,
  Text,
  View,
  FlatList,
  ActivityIndicator,
} from "react-native";
import React, { useState, useEffect } from "react";
import { collection, query, onSnapshot, doc } from "firebase/firestore";
import { database, auth } from "../firebase-files/firebaseSetup";
import { convertTimestamp } from "../Utils";
import RequestCard from "../components/RequestCard";
import { useFocusEffect } from "@react-navigation/native";
import CustomButton from "../components/CustomButton";
import { fetchExtra } from "../firebase-files/firestoreHelper";
import { useCustomFonts } from "../Fonts";

// Requests component to display the incoming and outgoing requests
export default function Requests({ navigation }) {
  const [activeTab, setActiveTab] = useState("outgoing");
  const [requests, setRequests] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [updateTrigger, setUpdateTrigger] = useState(0);
  const { fontsLoaded } = useCustomFonts();
  if (!fontsLoaded) {
    return <Text>Loading...</Text>;
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
          size="large"
          color="#55c7aa"
          style={{ marginTop: 20 }}
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

const styles = StyleSheet.create({
  tabs: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "stretch",
    marginHorizontal: 20,
  },
  tab: {
    flex: 1,
  },
  activeTab: {
    borderBottomWidth: 3,
    borderBottomColor: "#55c7aa",
  },
  activeTabText: {
    color: "black",
    marginBottom: 10,
  },
  tabText: {
    fontFamily: "SecularOne_400Regular",
    fontSize: 18,
    color: "gray",
  },
  container: {
    flex: 1,
  },
  noRequestsText: {
    fontSize: 20,
    textAlign: "center",
    marginTop: 20,
    fontFamily: "Molengo_400Regular",
    color: "grey",
  },
});
