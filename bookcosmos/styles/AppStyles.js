import { StyleSheet } from "react-native";
import { COLORS } from "./Colors";

// Styles for App
export const appStyles = StyleSheet.create({
  mainTabOptions: {
    headerShown: false,
  },
  closeIconSize: 24,
  addABookOptions: {
    gestureDirection: "vertical",
    transitionSpec: {
      close: {
        animation: "timing",
        config: { duration: 1000 },
      },
    },
  },
  stackScreenOptions: {
    headerBackTitleVisible: false,
    headerTitleStyle: {
      color: COLORS.black,
      fontSize: 20,
      fontFamily: "SecularOne_400Regular",
    },
    headerTintColor: COLORS.mainTheme,
  },
  stackNavigatorOptions: {
    headerBackTitleVisible: false,
    headerTitleStyle: {
      fontFamily: "SecularOne_400Regular",
      fontSize: 20,
    },
  },
});
