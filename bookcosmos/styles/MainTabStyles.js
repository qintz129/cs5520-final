import { StyleSheet, Platform } from "react-native";
import { COLORS } from "./Colors";

export const mainTabStyles = StyleSheet.create({
  tabIconSize: 24,
  mapIconSize: 20,
  tabNavigatorOptions: {
    tabBarActiveTintColor: COLORS.mainTheme,
  },
  tabScreenOptions: {
    headerStyle: {
      height: Platform.OS === "ios" ? 110 : 80,
    },
    headerTitleStyle: {
      fontSize: 20,
      fontFamily: "SecularOne_400Regular",
      fontWeight: "bold",
    },
    tabBarLabelStyle: {
      fontSize: 12,
      fontFamily: "SecularOne_400Regular",
    },
  },
  headerRightButton: {
    marginRight: 15,
    backgroundColor: COLORS.mainTheme,
    borderRadius: 5,
    padding: 5,
  },
});
