import React, { createContext, useState, useContext, useEffect } from "react";
import { auth, database } from "../firebase-files/firebaseSetup";
import { onSnapshot, doc } from "firebase/firestore";
// UserContext to store user information
const UserContext = createContext();

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const [userInfo, setUserInfo] = useState({
    name: "",
    email: "",
    imageUri: null,
    password: "",
    notification: false,
  }); 
  // Fetch user data from the database
  useEffect(() => {
    if (auth.currentUser) {
      const unsubscribe = onSnapshot(
        doc(database, "users", auth.currentUser.uid),
        (doc) => {
          if (doc.exists()) {
            const userData = doc.data();
            setUserInfo({
              name: userData.name,
              email: userData.email,
              password: userData.password,
              imageUri: userData.image ? userData.image : null,
              notification: userData.notification
                ? userData.notification
                : false,
            });
          } else {
            console.log("No such document!");
          }
        },
        (err) => {
          console.log(err);
        }
      );

      return () => unsubscribe();
    } else {  
      // Reset user info if user is not logged in
      setUserInfo({
        name: "",
        email: "",
        imageUri: null,
        password: "",
        notification: false,
      });
    }
  }, [auth.currentUser]);

  // Not in use
  updateUserInfo = (newName, newPassword, newImageUri) => {
    setUserInfo((prevState) => ({
      ...prevState,
      name: newName,
      password: newPassword,
      imageUri: newImageUri,
    }));
  };
  console.log(userInfo);
  return (
    <UserContext.Provider value={{ userInfo, updateUserInfo }}>
      {children}
    </UserContext.Provider>
  );
};
