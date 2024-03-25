import { StyleSheet, Text, View } from 'react-native'
import React, {useEffect, useState} from 'react' 
import { collection, onSnapshot, query, where, getDocs} from "firebase/firestore"; 
import { database, auth} from "../firebase-files/firebaseSetup";

export default function History() {  
  const [history, setHistory] = useState([]);
  useEffect(() => { 
    const fromQuery = query(collection(database, "history"), where("fromUser", "==", auth.currentUser.uid)); 
    const toQuery = query(collection(database, "history"),  where("toUser", "==", auth.currentUser.uid));  
    let fromArray = []; 
    let toArray = []; 
    const updateCombinedHistory = () => { 
      const historyMap = new Map(); 
      fromArray.forEach((item) => historyMap.set(item.id, item)); 
      toArray.forEach((item) => historyMap.set(item.id, item)); 
      const combinedArray = Array.from(historyMap.values()); 
      setHistory(combinedArray); 
    }
    // set up a listener to get realtime data from firestore - only after the first render
    const unsubscribeFrom = onSnapshot(
      fromQuery, (querySnapshot) => {
        querySnapshot.forEach((doc) => {
          fromArray.push({ ...doc.data(), id: doc.id });
        }); 
        updateCombinedHistory();
      },  
      (error) => { 
        Alert.alert(error.message); 
      }
    ); 

  const unsubscribeTo = onSnapshot(
    toQuery, (querySnapshot) => {
      querySnapshot.forEach((doc) => {
        toArray.push({ ...doc.data(), id: doc.id });
      }); 
      updateCombinedHistory();
    }, 
    (error) => { 
      Alert.alert(error.message); 
    }
  );
    return () => {
      unsubscribeFrom(); 
      unsubscribeTo();
    };
  }, []); 
  
  console.log(history);

  return (
    <View>
      <Text>History</Text>
    </View>
  )
}

const styles = StyleSheet.create({})