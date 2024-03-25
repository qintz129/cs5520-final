import { StyleSheet, Text, View, FlatList} from 'react-native'
import React, {useEffect, useState} from 'react' 
import { collection, onSnapshot, query, where, doc, getDoc} from "firebase/firestore"; 
import { database, auth} from "../firebase-files/firebaseSetup"; 
import { convertTimestamp} from '../Utils'; 
import HistoryCard from '../components/HistoryCard';

export default function History({navigation}) {  
  const [history, setHistory] = useState([]);
  
  useEffect(() => {   
    async function fetchBookName(bookId) {  
      const bookRef = doc(database, "books", bookId);  
      const bookSnap = await getDoc(bookRef);  
      return bookSnap.exists() ? bookSnap.data().bookName : "Unknown Book";
    } 

    const fetchExtra = async (doc) => { 
      const docData = doc.data(); 
        // Fetch additional details 
        const offeredBookName = await fetchBookName(docData.offeredBook); 
        const requestedBookName = await fetchBookName(docData.requestedBook); 
  
        return {
          ...docData,
          id: doc.id,
          offeredBookName,
          requestedBookName,
        }; 
      }; 
    
      const fromQuery = query(collection(database, "history"), where("fromUser", "==", auth.currentUser.uid)); 
      const toQuery = query(collection(database, "history"),  where("toUser", "==", auth.currentUser.uid));  
      let fromArray = []; 
      let toArray = []; 
      const updateCombinedHistory = () => { 
        const historyMap = new Map(); 
        fromArray.forEach((item) => historyMap.set(item.id, item)); 
        toArray.forEach((item) => historyMap.set(item.id, item));  
        const combinedArray = Array.from(historyMap.values());  
        const updatedHistory = combinedArray.map(item => ({
          ...item,
          recordTime: convertTimestamp(item.recordTime)
        }));   
        setHistory(updatedHistory); 
      }  

    const unsubscribeFrom = onSnapshot(
      fromQuery, (querySnapshot) => {
        // Collect all promises
        const promises = querySnapshot.docs.map(doc => fetchExtra(doc));
        Promise.all(promises).then(fetchedDetails => {
          // Once all promises have resolved, update toArray
          fromArray = [...fetchedDetails];
          // Now, call updateCombinedHistory here to ensure it uses the updated toArray
          updateCombinedHistory();
        }).catch(error => {
          console.error("Error fetching details", error);
        });
      },
      (error) => {
        console.error(error.message);
      }
    );

    const unsubscribeTo = onSnapshot(
      toQuery, (querySnapshot) => {
        // Collect all promises
        const promises = querySnapshot.docs.map(doc => fetchExtra(doc));
        Promise.all(promises).then(fetchedDetails => {
          // Once all promises have resolved, update toArray
          toArray = [...fetchedDetails];
          // Now, call updateCombinedHistory here to ensure it uses the updated toArray
          updateCombinedHistory();
        }).catch(error => {
          console.error("Error fetching details", error);
        });
      },
      (error) => {
        console.error(error.message);
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
  <FlatList
    data={history}
    keyExtractor={(item) => item.id}
    renderItem={({ item }) => (
      item.fromUser === auth.currentUser.uid ? (
        <HistoryCard 
          myBook={item.offeredBookName} 
          theirBook={item.requestedBookName} 
          date={item.recordTime}  
          status={item.status} 
          navigation={navigation}   
          reviewee={item.toUser}

        /> 
      ) : item.toUser === auth.currentUser.uid ? (
        <HistoryCard 
          myBook={item.requestedBookName} 
          theirBook={item.offeredBookName} 
          date={item.recordTime}  
          status={item.status} 
          navigation={navigation} 
          reviewee={item.fromUser}
        />
      ) : null // This is needed to handle the case where neither condition is true, though based on your logic this case may never happen.
    )}
  />
</View>
  )
}

const styles = StyleSheet.create({})