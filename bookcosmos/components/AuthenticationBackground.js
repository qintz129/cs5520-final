import React from "react";
import { ImageBackground } from "react-native";

import backgroundImage from "../assets/background.jpg";
import styles from "../Styles";

export default function AuthenticationBackground() {
  return (
    <ImageBackground
      resizeMode="cover"
      style={styles.background}
      source={backgroundImage}
    />
  );
}
