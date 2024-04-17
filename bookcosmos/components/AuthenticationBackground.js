import React from "react";
import { ImageBackground } from "react-native";

import backgroundImage from "../assets/authentication-background.jpg";
import styles from "../Styles";

export default function AuthenticationBackground() {
  return (
    <ImageBackground
      resizeMode="repeat"
      style={styles.background}
      source={backgroundImage}
    />
  );
}
