import { Text, View, Alert, ActivityIndicator } from "react-native";
import React, { useEffect, useState } from "react";
import { auth, storage } from "../firebase-files/firebaseSetup";
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
import ChangePasswordModal from "../components/ChangePasswordModal";
import NotificationManager from "../components/NotificationManager";
import { useCustomFonts } from "../hooks/UseFonts";
import { COLORS } from "../styles/Colors";
import { userInfoStyles } from "../styles/ScreenStyles";

// UserInfo component to display the user information
export default function UserInfo({ navigation }) {
  const { userInfo } = useUser();
  const [name, setName] = useState(userInfo.name);
  const [initialPassword, setInitialPassword] = useState(userInfo.password);
  const [email, setEmail] = useState(userInfo.email);
  const [password, setPassword] = useState(userInfo.password);
  const [notification, setNotification] = useState(userInfo.notification);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [imageUri, setImageUri] = useState(userInfo.imageUri);
  const [downloadUri, setDownloadUri] = useState(null);
  const [uploadUri, setUploadUri] = useState(null);
  const [hasNewImage, setHasNewImage] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isSaveLoading, setIsSaveLoading] = useState(false);
  const styles = userInfoStyles;
  const { fontsLoaded } = useCustomFonts();
  if (!fontsLoaded) {
    return null;
  }

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
          onPress: async () => {
            setIsSaveLoading(true);
            try {
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
                      {
                        name: name,
                        notification: notification,
                        image: newImageUri,
                      }
                    );
                  } else {
                    await updateToDB(
                      auth.currentUser.uid,
                      "users",
                      null,
                      null,
                      {
                        name: name,
                        notification: notification,
                        password: password,
                        image: newImageUri,
                      }
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
                    notification: notification,
                  });
                } else {
                  await updateToDB(auth.currentUser.uid, "users", null, null, {
                    name: name,
                    notification: notification,
                    password: password,
                  });
                }
              }
              setInitialPassword(password);
              Alert.alert("Changes saved successfully"); 
              navigation.goBack();
            } catch (error) {
              console.error("Error saving changes:", error);
            } finally {
              setIsSaveLoading(false);
            }
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

  function handlePasswordEdit() {
    setIsModalVisible(true);
  }

  const receiveNotification = (notification) => {
    setNotification(notification);
    console.log("notification", notification);
  };

  return (
    <View style={styles.container}>
      <ImageManager
        receiveImageUri={receiveImageUri}
        receiveNewImage={receiveNewImage}
        initialImageUri={downloadUri}
        mode="user"
      />
      <CustomInput title="Name" onChangeText={handleNameChange} value={name} />
      <CustomInput title="Email" value={email} editable={false} />
      <CustomPassWordInput
        title="Password"
        value={password}
        secureTextEntry={!passwordVisible}
        onToggleVisibility={toggleVisibility}
        editable={false}
        editButton={true}
        editFunction={handlePasswordEdit}
      />
      <ChangePasswordModal
        isVisible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        onSave={(newPassword) => setPassword(newPassword)}
      />
      <NotificationManager
        initialNotification={notification}
        notificationHandler={receiveNotification}
      />
      <View style={styles.buttonContainer}>
        <CustomButton
          customStyle={styles.logOutButton}
          onPress={signOutHandler}
        >
          <Text style={styles.logOutText}>Log out</Text>
        </CustomButton>
        <CustomButton customStyle={styles.saveButton} onPress={handleSave}>
          {isSaveLoading ? (
            <ActivityIndicator color={COLORS.white} />
          ) : (
            <Text style={styles.saveText}>Save</Text>
          )}
        </CustomButton>
      </View>
    </View>
  );
}
