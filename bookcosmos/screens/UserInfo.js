import { StyleSheet, Text, View, Alert } from "react-native";
import React, { useEffect, useState } from "react";
import { auth, database } from "../firebase-files/firebaseSetup";
import { getDoc, doc } from "firebase/firestore";
import CustomButton from "../components/CustomButton";
import { CustomInput, CustomPassWordInput} from "../components/InputHelper";
import { signOut, reauthenticateWithCredential, EmailAuthProvider, updatePassword} from "firebase/auth";
import { updateToDB } from "../firebase-files/firestoreHelper"; 
import {MaterialIcons} from "@expo/vector-icons";

// UserInfo component to display the user information
export default function UserInfo() {
  const [name, setName] = useState("");
  const [initialName, setInitialName] = useState(""); 
  const [initialPassword, setInitialPassword] = useState("");
  const [email, setEmail] = useState("");   
  const [password, setPassword] = useState(""); 
  const [passwordVisible, setPasswordVisible] = useState(false); 
  const [imageUri, setImageUri] = useState(null);

  useEffect(() => {
    const getUserInfo = async () => {
      try {
        const docRef = doc(database, "users", auth.currentUser.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setName(docSnap.data().name);
          setInitialName(docSnap.data().name);
          setEmail(docSnap.data().email); 
          setPassword(docSnap.data().password); 
          setInitialPassword(docSnap.data().password);
        } else {
          console.log("No such document!");
        }
      } catch (err) {
        console.log(err);
      }
    };
    getUserInfo();
  }, []);

  const handleNameChange = (changedText) => {
    setName(changedText);
  }; 

  const handlePasswordChange = (changedText) => { 
    setPassword(changedText); 
  }

  const signOutHandler = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.log(err);
    }
  };

  const handleCancel = () => {
    setName(initialName); 
    setPassword(initialPassword);
  };
 
  const handleSave = () => {
    Alert.alert(
      "Important",
      "Are you sure you want to save these changes?",
      [
        {
          text: "No",
          style: "cancel",
        },
        {
          text: "Yes",
          onPress: () => { 
            if (password.length < 6) {
              Alert.alert("Password should be at least 6 characters"); 
              return;
            }   
            if (initialPassword !== password) {
            const credential = EmailAuthProvider.credential(auth.currentUser.email, initialPassword);  
            // Re-authenticate user 
            const reAuth = async (user, credential) => { 
              try {
                await reauthenticateWithCredential(user, credential);  
                await updatePassword(user, password); 
                console.log("Password updated successfully");
              } catch (error) {
                console.error("Error reauthenticating:", error);
              }
            }  
            reAuth(auth.currentUser, credential);  
          }
            updateToDB(auth.currentUser.uid, "users", null, null, { name: name, password: password}); 
            setInitialName(name); 
            setInitialPassword(password);
          },
        },
      ],
      { cancelable: true }
    );
  }; 

  const toggleVisibility = () => {  
    setPasswordVisible(!passwordVisible);
  };

  return (
    <View style={styles.container}> 
      <MaterialIcons name="photo-camera" size={150} color="gray" />
      <CustomInput title="Name" onChangeText={handleNameChange} value={name}/>
      <CustomInput title="Email" value={email} editable={false} /> 
      <CustomPassWordInput
        title="Password"
        value={password} 
        onChangeText={handlePasswordChange}
        secureTextEntry={!passwordVisible} 
        onToggleVisibility={toggleVisibility} 
        />
      <View style={styles.buttonView}>
        <CustomButton onPress={handleCancel}>
          <Text>Cancel</Text>
        </CustomButton>
        <CustomButton onPress={handleSave}>
          <Text>Save</Text>
        </CustomButton>
      </View>
      <CustomButton onPress={signOutHandler}>
        <Text>Log out</Text>
      </CustomButton>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  buttonView: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 30
  },
});
