import { StyleSheet, Text, View, Alert } from "react-native";
import React, { useEffect, useState } from "react";
import { auth, database } from "../firebase-files/firebaseSetup";
import { getDoc, doc } from "firebase/firestore";
import CustomButton from "../components/CustomButton";
import CustomInput from "../components/CustomInput";
import { signOut } from "firebase/auth";
import { updateToDB } from "../firebase-files/firestoreHelper";

// UserInfo component to display the user information
export default function UserInfo() {
  const [name, setName] = useState("");
  const [initialName, setInitialName] = useState("");
  const [email, setEmail] = useState(""); 
  useEffect(() => {
    const getUserInfo = async () => {
      try {
        const docRef = doc(database, "users", auth.currentUser.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setName(docSnap.data().name);
          setInitialName(docSnap.data().name);
          setEmail(docSnap.data().email);
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

  const signOutHandler = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.log(err);
    }
  };

  const handleCancel = () => {
    setName(initialName);
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
            updateToDB(auth.currentUser.uid, "users", { name: name });
          },
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <View style={styles.container}>
      <CustomInput title="Name" onChangeText={handleNameChange} value={name} />
      <CustomInput title="Email" value={email} editable={false} />
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
    marginVertical: 10,
  },
});
