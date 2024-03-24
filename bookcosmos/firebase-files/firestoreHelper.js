import {
  collection,
  addDoc,
  doc,
  setDoc,
  deleteDoc,
  getDocs,
  updateDoc,
  arrayUnion,
} from "firebase/firestore";
import { database, auth } from "./firebaseSetup";

// Function to write data to the database
export async function writeToDB(data, col) {
  try {
    let docRef;
    if (col === "users" && data.uid) {
      docRef = doc(database, col, data.uid);
      await setDoc(docRef, data);
    } else if (col === "books") {
      data = { ...data, owner: auth.currentUser.uid };
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
export async function updateToDB(id, col, updates) {
  try {
    const docRef = doc(database, col, id);
    await updateDoc(docRef, updates);
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

// Function to write book data to the database
export async function writeUserBooksToDB(bookData) {
  try {
    // Ensure the user is logged in
    if (!auth.currentUser) {
      throw new Error("User is not logged in");
    }

    // Add book data to the 'books' collection
    const docRef = await addDoc(collection(database, "books"), {
      ...bookData,
      owner: auth.currentUser.uid,
    });

    // Add the book ID to the 'books' field in the user document
    const userDocRef = doc(database, "users", auth.currentUser.uid);
    await updateDoc(userDocRef, {
      books: arrayUnion(docRef.id),
    });

    return docRef.id; // Return the document ID of the book
  } catch (err) {
    console.error("Error writing book data:", err);
    throw err;
  }
}
