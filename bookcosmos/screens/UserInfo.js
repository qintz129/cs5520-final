import { StyleSheet, Text, View, Alert } from "react-native";
import React, { useEffect, useState } from "react";
import { auth, database, storage } from "../firebase-files/firebaseSetup";
import CustomButton from "../components/CustomButton";
import { CustomInput, CustomPassWordInput } from "../components/InputHelper";
import {
  signOut,
  reauthenticateWithCredential,
  EmailAuthProvider,
  updatePassword,
} from "firebase/auth";
import { updateToDB } from "../firebase-files/firestoreHelper";
import ImageManager from "../components/ImageManager";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useUser } from "../hooks/UserContext"; 


// UserInfo component to display the user information
export default function UserInfo({ navigation }) {
  const { userInfo } = useUser();
  const [name, setName] = useState(userInfo.name);
  const [initialPassword, setInitialPassword] = useState(userInfo.password);
  const [email, setEmail] = useState(userInfo.email);
  const [password, setPassword] = useState(userInfo.password);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [imageUri, setImageUri] = useState(userInfo.imageUri);
  const [downloadUri, setDownloadUri] = useState(null);
  const [uploadUri, setUploadUri] = useState(null);
  const [hasNewImage, setHasNewImage] = useState(false); 
  const [location, setLocation] = useState(null); 

  useEffect(() => {
    const fetchImage = async () => {
      const imageRef = ref(storage, imageUri);

      try {
        const url = await getDownloadURL(imageRef);
        setDownloadUri(url);
      } catch (error) {
        console.log(error);
      }
    };

    if (imageUri) {
      fetchImage();
    }
  }, [imageUri]);

  const handleNameChange = (changedText) => {
    setName(changedText);
  };

  const handlePasswordChange = (changedText) => {
    setPassword(changedText);
  };

  const signOutHandler = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.log(err);
    }
  }; 

  const handleSave = () => {
    Alert.alert(
      "Important",
      "Are you sure you want to save these changes?",
      [
        { text: "No", style: "cancel" },
        {
          text: "Yes",
          onPress: () => {
            (async () => {
              if (password.length < 6) {
                Alert.alert("Password should be at least 6 characters");
                return;
              }

              if (initialPassword !== password) {
                const credential = EmailAuthProvider.credential(
                  auth.currentUser.email,
                  initialPassword
                );
                try {
                  await reauthenticateWithCredential(
                    auth.currentUser,
                    credential
                  );
                  await updatePassword(auth.currentUser, password);
                  console.log("Password updated successfully");
                } catch (error) {
                  console.error("Error reauthenticating:", error);
                }
              }

              if (hasNewImage && uploadUri) {
                try {
                  const newImageUri = await getImageData(uploadUri);
                  setImageUri(newImageUri);
                  if (initialPassword === password) {
                    await updateToDB(
                      auth.currentUser.uid,
                      "users",
                      null,
                      null,
                      { name: name, image: newImageUri }
                    );
                  } else {
                    await updateToDB(
                      auth.currentUser.uid,
                      "users",
                      null,
                      null,
                      { name: name, password: password, image: newImageUri }
                    );
                  }
                } catch (error) {
                  console.error(
                    "Error updating user info with new image:",
                    error
                  );
                }
              } else {
                if (initialPassword === password) {
                  await updateToDB(auth.currentUser.uid, "users", null, null, {
                    name: name,
                  });
                } else {
                  await updateToDB(auth.currentUser.uid, "users", null, null, {
                    name: name,
                    password: password,
                  });
                }
              }
              setInitialPassword(password);
              navigation.goBack();
            })();
          },
        },
      ],
      { cancelable: true }
    );
  };

  const toggleVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const receiveImageUri = (takenImageUri) => {
    setUploadUri(takenImageUri);
  };

  const receiveNewImage = (newImage) => {
    setHasNewImage(newImage);
  };
  async function getImageData(uri) {
    try {
      const response = await fetch(uri);
      const imageBlob = await response.blob();
      const imageName = uri.substring(uri.lastIndexOf("/") + 1);
      const imageRef = ref(storage, `userImages/${imageName}`);
      const uploadResult = await uploadBytes(imageRef, imageBlob);
      console.log("uploadResult", uploadResult);
      return uploadResult.metadata.fullPath;
    } catch (err) {
      console.log(err);
    }
  }
  // console.log(userInfo);
  return (
    <View style={styles.container}>
      <ImageManager
        receiveImageUri={receiveImageUri}
        receiveNewImage={receiveNewImage}
        initialImageUri={downloadUri}
        mode="user"
      />
      <CustomInput title="Email" value={email} editable={false} />
      <CustomInput title="Name" onChangeText={handleNameChange} value={name} />
      <CustomPassWordInput
        title="Password"
        value={password}
        onChangeText={handlePasswordChange}
        secureTextEntry={!passwordVisible}
        onToggleVisibility={toggleVisibility}
      />
      <CustomButton onPress={handleSave}>
        <Text>Save</Text>
      </CustomButton>
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
});
