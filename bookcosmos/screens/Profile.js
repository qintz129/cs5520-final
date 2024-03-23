import { View, Text } from "react-native";
import React from "react";
import { auth } from "../firebase-files/firebaseSetup";

export default function Profile() {
  return (
    <View>
      <Text>{auth.currentUser.uid}</Text>
      <Text>{auth.currentUser.email}</Text>
    </View>
  );
}
