import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Signup from "./screens/Signup";
import Login from "./screens/Login";
import MainTab from "./navigations/MainTab";
import UserInfo from "./screens/UserInfo";
import AddABook from "./screens/AddABook";
import BookDetail from "./screens/BookDetail";
import OtherUserProfile from "./screens/OtherUserProfile";
import AddReview from "./screens/AddReview";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase-files/firebaseSetup";
import { AntDesign } from "@expo/vector-icons";
import CustomButton from "./components/CustomButton";
import { ActionSheetProvider } from "@expo/react-native-action-sheet";
import { UserProvider } from "./hooks/UserContext";
import Map from "./screens/Map";
import * as Notifications from "expo-notifications";
import NotificationListener from "./components/NotificationListener";
import { useCustomFonts } from "./hooks/UseFonts";
import Chat from "./screens/Chat";
import { COLORS } from "./styles/Colors";
import { appStyles } from "./styles/AppStyles";

// Notification handler to show notifications
Notifications.setNotificationHandler({
  handleNotification: async function (notification) {
    return {
      shouldShowAlert: true,
      shouldPlaySound: true,
    };
  },
});

const Stack = createNativeStackNavigator();

export default function App() {
  const [userLoggedIn, setUserLoggedIn] = useState(false);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/auth.user
        // const uid = user.uid;
        setUserLoggedIn(true);
        // ...
      } else {
        // User is signed out
        // ...
        setUserLoggedIn(false);
      }
    });
  }, []);

  const styles = appStyles;
  const { fontsLoaded } = useCustomFonts();
  if (!fontsLoaded) {
    return null;
  }

  const AuthStack = (
    <>
      <Stack.Screen name="Signup" component={Signup} />
      <Stack.Screen name="Login" component={Login} />
    </>
  );
  const AppStack = (
    <>
      <Stack.Screen
        name="MainTab"
        component={MainTab}
        options={styles.mainTabOptions}
      />
      <Stack.Screen
        name="User Info"
        component={UserInfo}
        options={styles.stackScreenOptions}
      />
      <Stack.Screen
        name="Add A Book"
        component={AddABook}
        options={({ navigation }) => ({
          headerLeft: () => (
            <CustomButton onPress={() => navigation.goBack()}>
              <AntDesign
                name="close"
                size={styles.closeIconSize}
                color={COLORS.red}
              />
            </CustomButton>
          ),
          ...styles.addABookOptions,
        })}
      />
      <Stack.Screen
        name="Book Detail"
        component={BookDetail}
        options={styles.stackScreenOptions}
      />
      <Stack.Screen
        name="Other User Profile"
        component={OtherUserProfile}
        options={styles.stackScreenOptions}
      />
      <Stack.Screen
        name="Add A Review"
        component={AddReview}
        options={styles.stackScreenOptions}
      />
      <Stack.Screen
        name="Map"
        component={Map}
        options={styles.stackScreenOptions}
      />
      <Stack.Screen
        name="Chat"
        component={Chat}
        options={styles.stackScreenOptions}
      />
    </>
  );

  return (
    <UserProvider>
      <ActionSheetProvider>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <NavigationContainer>
            <NotificationListener />
            <Stack.Navigator
              initialRouteName="Signup"
              screenOptions={styles.stackNavigatorOptions}
            >
              {userLoggedIn ? AppStack : AuthStack}
            </Stack.Navigator>
          </NavigationContainer>
        </GestureHandlerRootView>
      </ActionSheetProvider>
    </UserProvider>
  );
}
