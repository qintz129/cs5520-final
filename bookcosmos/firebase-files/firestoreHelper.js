import {
  collection,
  addDoc,
  doc,
  setDoc,
  deleteDoc,
  getDocs,
  updateDoc,
  getDoc,
} from "firebase/firestore";
import { database, auth } from "./firebaseSetup";

// Function to write data to the database
export async function writeToDB(data, col, docId, subCol) {
  try {
    if (docId) {
      await addDoc(collection(database, col, docId, subCol), data);
    } else {
      let docRef;
      if (col === "users" && data.uid) {
        docRef = doc(database, col, data.uid);
        await setDoc(docRef, data);
      } else if (col === "books") {
        const docRef = await addDoc(collection(database, "books"), {
          ...data,
          owner: auth.currentUser.uid,
          bookNameLower: data.bookName.toLowerCase(),
        });
        const bookId = docRef.id;
        await updateDoc(docRef, { id: bookId });
        await updateUserBooks(bookId, auth.currentUser.uid);
        console.log("Book data written successfully");
      } else {
        docRef = doc(database, col);
        await addDoc(collection(database, col), data);
      }
    }
  } catch (err) {
    console.log(err);
  }
}

async function updateUserBooks(bookId, userId) {
  const userDocRef = doc(database, "users", userId);
  const userDoc = await getDoc(userDocRef);

  if (userDoc.exists()) {
    const userData = userDoc.data();
    const books = userData.books ? [...userData.books, bookId] : [bookId];
    await updateDoc(userDocRef, {
      books: books,
    });
    console.log("User data updated successfully with new book ID");
  } else {
    console.error("User not found");
  }
}

// Function to update data in the database
export async function updateToDB(
  id,
  col,
  docId = null,
  subCol = null,
  updates
) {
  try {
    if (docId) {
      const docRef = doc(database, col, docId, subCol, id);
      await updateDoc(docRef, updates);
    } else {
      const docRef = doc(database, col, id);
      await updateDoc(docRef, updates);
    }
    console.log("Data updated successfully");
  } catch (err) {
    console.log(err);
  }
}

// Function to get all documents from a collection
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

// Function to get a document from the database
export async function getDocFromDB(col, docId) {
  try {
    const docSnap = await getDoc(doc(database, col, docId));
    if (docSnap.exists()) {
      return docSnap.data();
    }
  } catch (err) {
    console.log(err);
  }
}

// Function to delete data from the database
export async function deleteFromDB(id, col, docId = null, subCol = null) {
  try {
    if (docId) {
      await deleteDoc(doc(database, col, docId, subCol, id));
    } else {
      if (col === "books") {
        const bookDocRef = doc(database, col, id);
        const bookDoc = await getDoc(bookDocRef);
        if (bookDoc.exists()) {
          const bookData = bookDoc.data();
          await deleteDoc(bookDocRef);
          console.log("Book deleted successfully");
          await removeBookFromUser(bookData.owner, id);
        } else {
          console.error("Book not found");
        }
      } else {
        await deleteDoc(doc(database, col, id));
      }
    }
    console.log("Data deleted successfully");
  } catch (err) {
    console.error("Error deleting from DB:", err);
  }
}

async function removeBookFromUser(userId, bookId) {
  const userDocRef = doc(database, "users", userId);
  const userDoc = await getDoc(userDocRef);
  if (userDoc.exists()) {
    const userData = userDoc.data();
    const books = userData.books
      ? userData.books.filter((bId) => bId !== bookId)
      : [];
    await updateDoc(userDocRef, {
      books: books,
    });
    console.log("Book ID removed from user successfully");
  } else {
    console.error("User not found");
  }
}

// Function to create requests with the same request id in both sender and receiver's collections
export async function createExchangeRequest(newRequest) {
  const sentRequestRef = doc(
    collection(database, "users", newRequest.fromUser, "sentRequests")
  );

  const requestId = sentRequestRef.id;

  const receivedRequestRef = doc(
    database,
    "users",
    newRequest.toUser,
    "receivedRequests",
    requestId
  );
  await setDoc(receivedRequestRef, newRequest);
  await setDoc(sentRequestRef, newRequest);

  return requestId;
}

// Fetch book info using the book id
async function fetchBookInfo(bookId) {
  const bookRef = doc(database, "books", bookId);
  const bookSnap = await getDoc(bookRef);
  return bookSnap.exists() ? bookSnap.data() : null;
}

// Combine the request data with book information
export async function fetchExtra(doc) {
  const docData = doc.data();
  const offeredBookInfo = await fetchBookInfo(docData.offeredBook);
  const requestedBookInfo = await fetchBookInfo(docData.requestedBook);
  return {
    ...docData,
    id: doc.id,
    offeredBookInfo,
    requestedBookInfo,
  };
}
