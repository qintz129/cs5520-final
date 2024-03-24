import {
  collection,
  addDoc,
  doc,
  setDoc,
  deleteDoc,
  getDocs,
  updateDoc,
  arrayUnion,
  arrayRemove,
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
    // Add book data to the 'books' collection and get the document reference
    const docRef = await addDoc(collection(database, "books"), {
      ...bookData,
      owner: auth.currentUser.uid,
    });

    // Get the ID of the added book document
    const bookId = docRef.id;

    // Update the book document with its ID in the 'books' collection
    await updateDoc(docRef, { id: bookId });

    // Add the book ID to the 'books' field in the user document
    const userDocRef = doc(database, "users", auth.currentUser.uid);
    await updateDoc(userDocRef, {
      books: arrayUnion(bookId),
    });

    console.log("Book data written successfully");

    return bookId; // Return the document ID of the book
  } catch (err) {
    console.error("Error writing book data:", err);
    throw err;
  }
}

// Function to delete a book from the database
export async function deleteBookFromDB(bookId) {
  try {
    // Ensure the user is logged in
    if (!auth.currentUser) {
      throw new Error("User is not logged in");
    }

    // Delete the book document from the 'books' collection
    const bookDocRef = doc(database, "books", bookId);
    await deleteDoc(bookDocRef);

    // Remove the book ID from the 'books' field in the user document
    const userDocRef = doc(database, "users", auth.currentUser.uid);
    await updateDoc(userDocRef, {
      books: arrayRemove(bookDocRef.id),
    });

    console.log("Book deleted successfully");
  } catch (err) {
    console.error("Error deleting book:", err);
    throw err;
  }
}
