import React from "react";
import { Pressable } from "react-native";
import { customButtonStyles } from "../styles/ComponentStyles";

// CustomButton component using Pressable to achieve the button for all screens
export default function CustomButton({
  onPress,
  disabled = false,
  customStyle = {},
  children,
}) {
  const styles = customButtonStyles;
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      hitSlop={10}
      style={({ pressed }) => [
        styles.button,
        customStyle,
        pressed && styles.pressed,
        disabled && styles.disabled,
      ]}
    >
      {children}
    </Pressable>
  );
}
