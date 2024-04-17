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
import { StyleSheet, Text } from "react-native";
import { useCustomFonts } from "../Fonts";

const Tab = createBottomTabNavigator();

// MainTab component to create the bottom tab navigation
export default function MainTab({ navigation }) {
  const { fontsLoaded } = useCustomFonts();
  if (!fontsLoaded) {
    return <Text>Loading...</Text>;
  }

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: "#55c7aa",
      }}
    >
      <Tab.Screen
        name="Explore"
        component={Explore}
        options={{
          headerStyle: { height: 100 },
          headerTitleStyle: {
            fontSize: 20,
            fontFamily: "SecularOne_400Regular",
            fontWeight: "bold",
          },
          tabBarLabelStyle: {
            fontSize: 12,
            fontFamily: "SecularOne_400Regular",
          },
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="search" size={24} color={color} />
          ),
          headerRight: () => (
            <CustomButton
              onPress={() => navigation.navigate("Map")}
              customStyle={styles.headerRightButton}
            >
              <FontAwesome5 name="map-marked-alt" size={20} color="white" />
            </CustomButton>
          ),
        }}
      />
      <Tab.Screen
        name="Requests"
        component={Requests}
        options={{
          headerStyle: { height: 100 },
          headerTitleStyle: {
            fontSize: 20,
            fontFamily: "SecularOne_400Regular",
          },
          tabBarLabelStyle: {
            fontSize: 12,
            fontFamily: "SecularOne_400Regular",
          },
          tabBarIcon: ({ color, size }) => (
            <Foundation name="book-bookmark" size={24} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="History"
        component={History}
        options={{
          headerStyle: { height: 100 },
          tabBarLabelStyle: {
            fontSize: 12,
          },
          headerTitleStyle: {
            fontSize: 20,
            fontFamily: "SecularOne_400Regular",
          },
          tabBarLabelStyle: {
            fontSize: 12,
            fontFamily: "SecularOne_400Regular",
          },
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="history" size={24} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{
          headerStyle: { height: 100 },
          headerTitleStyle: {
            fontSize: 20,
            fontFamily: "SecularOne_400Regular",
          },
          tabBarLabelStyle: {
            fontSize: 12,
            fontFamily: "SecularOne_400Regular",
          },
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person" size={24} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  headerRightButton: {
    marginRight: 15,
    backgroundColor: "#55c7aa",
    borderRadius: 5,
    padding: 5,
  },
});
