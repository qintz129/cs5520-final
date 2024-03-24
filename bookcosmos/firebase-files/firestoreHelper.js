import {
  collection,
  addDoc,
  doc,
  deleteDoc,
  getDocs,
} from "firebase/firestore";
import { database, auth} from "./firebaseSetup"; 

export async function writeToDB(data, col) {
  try {
      if (col === "books") {   
        data = {...data, owner: auth.currentUser.uid}
      }
      await addDoc(collection(database, col), data);
  } catch (err) {
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

