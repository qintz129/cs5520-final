import {
  StyleSheet,
  Text,
  View,
  FlatList,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import { collection, onSnapshot, query } from "firebase/firestore";
import { database, auth } from "../firebase-files/firebaseSetup";
import { convertTimestamp } from "../Utils";
import HistoryCard from "../components/HistoryCard";

// History component to display the history of exchanges
export default function History({ navigation }) {
  const [history, setHistory] = useState([]);
  const [isLoading, setLoading] = useState(false);
  // useEffect to fetch the history of exchanges
  useEffect(() => {
    const fetchHistory = () => {
      try {
        setLoading(true);
        const q = query(
          collection(database, "users", auth.currentUser.uid, "history")
        );

        const unsubscribe = onSnapshot(q, (querySnapshot) => {
          const fetchedHistories = [];
          querySnapshot.forEach((doc) => {
            fetchedHistories.push({
              ...doc.data(),
              id: doc.id,
            });
          });
          // Sort the fetchedHistories by date
          fetchedHistories.sort((a, b) => {
            // Convert string timestamps to numerical timestamps and compare
            return Date.parse(b.date) - Date.parse(a.date);
          });
          setHistory(fetchedHistories);
          setLoading(false);
        });
        return unsubscribe;
      } catch (error) {
        console.log(error);
      }
    };
    const unsubscribe = fetchHistory();
    return () => unsubscribe();
  }, [auth.currentUser.uid]);

  console.log(history);

  return (
    <View style={styles.container}>
      {isLoading ? (
        <ActivityIndicator
          size="large"
          color="#55c7aa"
          style={{ marginTop: 20 }}
        />
      ) : (
        <FlatList
          data={history}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) =>
            item.fromUser === auth.currentUser.uid ? (
              <HistoryCard
                myBook={item.myBook}
                theirBook={item.requestedBook}
                date={convertTimestamp(item.date)}
                navigation={navigation}
                reviewee={item.toUser}
                reviewer={auth.currentUser.uid}
                exchangeId={item.id}
                isReviewed={item.isReviewed}
                status={item.status}
              />
            ) : item.toUser === auth.currentUser.uid ? (
              <HistoryCard
                myBook={item.requestedBook}
                theirBook={item.myBook}
                date={convertTimestamp(item.date)}
                navigation={navigation}
                reviewee={auth.currentUser.uid}
                reviewer={item.toUser}
                exchangeId={item.id}
                isReviewed={item.isReviewed}
                status={item.status}
              />
            ) : null
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
