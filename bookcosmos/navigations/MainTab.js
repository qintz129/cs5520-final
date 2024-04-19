import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Explore from "../screens/Explore";
import Requests from "../screens/Requests";
import History from "../screens/History";
import Profile from "../screens/Profile";
import { Ionicons } from "@expo/vector-icons";
import { Foundation } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";
import { FontAwesome5 } from "@expo/vector-icons";
import CustomButton from "../components/CustomButton";
import { useCustomFonts } from "../hooks/UseFonts";
import { COLORS } from "../styles/Colors";
import { mainTabStyles } from "../styles/MainTabStyles";

const Tab = createBottomTabNavigator();

// MainTab component to create the bottom tab navigation
export default function MainTab({ navigation }) {
  const styles = mainTabStyles;
  const { fontsLoaded } = useCustomFonts();
  if (!fontsLoaded) {
    return null;
  }

  return (
    <Tab.Navigator screenOptions={styles.tabNavigatorOptions}>
      <Tab.Screen
        name="Explore"
        component={Explore}
        options={{
          tabBarIcon: ({ color }) => (
            <Ionicons name="search" size={styles.tabIconSize} color={color} />
          ),
          headerRight: () => (
            <CustomButton
              onPress={() => navigation.navigate("Map")}
              customStyle={styles.headerRightButton}
            >
              <FontAwesome5
                name="map-marked-alt"
                size={styles.mapIconSize}
                color={COLORS.white}
              />
            </CustomButton>
          ),
          ...styles.tabScreenOptions,
        }}
      />
      <Tab.Screen
        name="Requests"
        component={Requests}
        options={{
          tabBarIcon: ({ color }) => (
            <Foundation
              name="book-bookmark"
              size={styles.tabIconSize}
              color={color}
            />
          ),
          ...styles.tabScreenOptions,
        }}
      />
      <Tab.Screen
        name="History"
        component={History}
        options={{
          tabBarIcon: ({ color }) => (
            <FontAwesome
              name="history"
              size={styles.tabIconSize}
              color={color}
            />
          ),
          ...styles.tabScreenOptions,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{
          tabBarIcon: ({ color }) => (
            <Ionicons name="person" size={styles.tabIconSize} color={color} />
          ),
          ...styles.tabScreenOptions,
        }}
      />
    </Tab.Navigator>
  );
}
