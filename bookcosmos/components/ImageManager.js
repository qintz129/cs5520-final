import { View, Text, Alert, Image } from "react-native";
import React, { useState, useEffect } from "react";
import * as ImagePicker from "expo-image-picker";
import { MaterialIcons } from "@expo/vector-icons";
import CustomButton from "./CustomButton";
import { useActionSheet } from "@expo/react-native-action-sheet";
import { useCustomFonts } from "../hooks/UseFonts";
import { COLORS } from "../styles/Colors";
import { imageManagerStyles } from "../styles/ComponentStyles";

// ImageManager component to manage the image of the book
export default function ImageManager({
  receiveImageUri,
  receiveNewImage,
  initialImageUri,
  mode,
}) {
  const [status, requestPermission] = ImagePicker.useCameraPermissions();
  const [imageUri, setImageUri] = useState(null);
  const { showActionSheetWithOptions } = useActionSheet();
  const styles = imageManagerStyles;
  const { fontsLoaded } = useCustomFonts();
  if (!fontsLoaded) {
    return null;
  }
  
  // Reset the imageUri when the initialImageUri changes
  useEffect(() => {
    setImageUri(initialImageUri);
  }, [initialImageUri]); 

  // Verify the permission to access the camera
  async function verifyPermission() {
    if (status.granted) {
      return true;
    }
    try {
      const permissionResponse = await requestPermission();
      return permissionResponse.granted;
    } catch (err) {
      console.log(err);
    }
  } 
  // Take a photo using the camera
  async function takeImageHandler() {
    try {
      const havePermission = await verifyPermission();
      if (!havePermission) {
        Alert.alert("You need to give permission");
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
      });
      if (result.canceled) {
        return;
      }
      receiveImageUri(result.assets[0].uri);
      setImageUri(result.assets[0].uri);
      receiveNewImage(true);
    } catch (err) {
      console.log(err);
    }
  }
  // Pick an image from the gallery
  async function pickImageHandler() {
    const havePermission = await verifyPermission();
    if (!havePermission) {
      Alert.alert("You need to give permission");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
    });
    if (result.canceled) {
      return;
    }
    receiveImageUri(result.assets[0].uri);
    setImageUri(result.assets[0].uri);
    receiveNewImage(true);
  }
  // Show the ActionSheet to take a photo or choose a photo from the gallery
  const showActionSheet = () => {
    console.log("Attempting to show ActionSheet");
    const options = ["Take Photo", "Choose Photo", "Cancel"];
    const cancelButtonIndex = 2;

    showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
      },
      (buttonIndex) => {
        if (buttonIndex === 0) {
          takeImageHandler();
        } else if (buttonIndex === 1) {
          pickImageHandler();
        }
        // Cancel: do nothing
      }
    );
  };

  return (
    <View style={styles.container}>
      {imageUri ? (
        <Image
          style={mode === "user" ? styles.userImage : styles.bookImage}
          source={{ uri: imageUri }}
        />
      ) : (
        <MaterialIcons
          name="photo-camera"
          size={styles.photoIconSize}
          color={COLORS.grey}
        />
      )}
      <CustomButton onPress={showActionSheet} customStyle={styles.editButton}>
        <MaterialIcons
          name="add-a-photo"
          size={styles.addPhotoIconSize}
          color={COLORS.white}
        />
        <Text style={styles.editText}>Edit Photo</Text>
      </CustomButton>
    </View>
  );
}
