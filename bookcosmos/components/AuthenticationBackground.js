import React from "react";
import { ImageBackground } from "react-native";
import backgroundImage from "../assets/background.jpg";
import { authenticationBackgroundStyles } from "../styles/ComponentStyles";

export default function AuthenticationBackground() {
  return (
    <ImageBackground
      resizeMode="cover"
      style={authenticationBackgroundStyles.background}
      source={backgroundImage}
    />
  );
}
