import React from "react";
import { Pressable, StyleSheet } from "react-native";

// CustomButton component using Pressable to achieve the button for all screens
export default function CustomButton({
  onPress,
  disabled = false,
  customStyle = {},
  children,
}) {
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

const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 10,
  },
  pressed: {
    opacity: 0.5,
  },
  disabled: {
    opacity: 0.5,
  },
});
