import {
  collection,
  addDoc,
  doc, 
  setDoc,
  deleteDoc,
  getDocs, 
  updateDoc
} from "firebase/firestore";
import { database, auth} from "./firebaseSetup"; 

// Function to write data to the database
export async function writeToDB(data, col) {
  try {  
      let docRef;
      if (col === "users" && data.uid) { 
        docRef = doc(database, col, data.uid); 
        await setDoc(docRef, data);
      }
      else if (col === "books") {   
        data = {...data, owner: auth.currentUser.uid};
        await addDoc(collection(database, col), data);
      } else { 
        docRef = doc(database, col); 
        await addDoc(collection(database, col), data);
      }
      
  } catch (err) {
    console.log(err);
  }
} 

// Function to update data in the database
export async function updateToDB(id, col, updates) 
{   
    try { 

        const docRef = doc(database, col ,id);
        await updateDoc(docRef, updates);
    } 
    catch (err){ 
        console.log(err);
    }
}

export async function getAllDocs(path) {
  try {
    const querySnapshot = await getDocs(collection(database, path));
    let newArray = [];
    querySnapshot.forEach((doc) => {
      newArray.push(doc.data());
      console.log(doc.data());
    });
    return newArray;
  } catch (err) {
    console.log(err);
  }
} 



