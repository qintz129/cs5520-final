import { View, StyleSheet, Text, Alert, Image } from "react-native";
import React, { useState, useEffect } from "react";
import * as ImagePicker from "expo-image-picker";
import { MaterialIcons } from "@expo/vector-icons";
import CustomButton from "./CustomButton";
import { useActionSheet } from "@expo/react-native-action-sheet";

export default function ImageManager({
  receiveImageUri,
  receiveNewImage,
  initialImageUri,
  mode,
}) {
  const [status, requestPermission] = ImagePicker.useCameraPermissions();
  const [imageUri, setImageUri] = useState(null);
  const { showActionSheetWithOptions } = useActionSheet();
  useEffect(() => {
    setImageUri(initialImageUri);
  }, [initialImageUri]);
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
        <MaterialIcons name="photo-camera" size={150} color="gray" />
      )}
      <CustomButton onPress={showActionSheet} customStyle={styles.button}>
        <Text>Edit</Text>
      </CustomButton>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 10,
  },
  userImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  bookImage: {
    width: 150,
    height: 180,
    borderRadius: 10,
  },
  button: {},
});
