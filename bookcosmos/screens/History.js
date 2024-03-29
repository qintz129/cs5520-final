import {
  StyleSheet,
  Text,
  View,
  FlatList,
  ActivityIndicator,
} from "react-native";
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

export default function History({ navigation }) {
  const [history, setHistory] = useState([]);
  const [isLoading, setLoading] = useState(false);

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
            fetchedHistories.push({ ...doc.data(), id: doc.id });
          });
          // Sort the fetchedHistories by date
          fetchedHistories.sort((a, b) => b.date - a.date);
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
        <ActivityIndicator size="large" color="#0000ff" />
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
              />
            ) : item.toUser === auth.currentUser.uid ? (
              <HistoryCard
                myBook={item.requestedBook.bookName}
                theirBook={item.myBook.bookName}
                date={item.date}
                navigation={navigation}
                reviewee={auth.currentUser.uid}
                reviewer={item.toUser}
                exchangeId={item.id}
                isReviewed={item.isReviewed}
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
