import { Text, View, FlatList, ActivityIndicator } from "react-native";
import React, { useEffect, useState } from "react";
import { collection, onSnapshot, query } from "firebase/firestore";
import { database, auth } from "../firebase-files/firebaseSetup";
import { convertTimestamp } from "../utils/Utils";
import HistoryCard from "../components/HistoryCard";
import { useCustomFonts } from "../hooks/UseFonts";
import { activityIndicatorStyles } from "../styles/CustomStyles";
import { historyStyles } from "../styles/ScreenStyles";

// History component to display the history of exchanges
export default function History({ navigation }) {
  const [history, setHistory] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const styles = historyStyles;
  const { fontsLoaded } = useCustomFonts();
  if (!fontsLoaded) {
    return null;
  }

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

  //console.log(history);

  return (
    <View style={styles.container}>
      {isLoading ? (
        <ActivityIndicator
          size={activityIndicatorStyles.size}
          color={activityIndicatorStyles.color}
          style={activityIndicatorStyles.style}
        />
      ) : history.length === 0 ? (
        <Text style={styles.noHistoryText}>No exchange history</Text>
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
