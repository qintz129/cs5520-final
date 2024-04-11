import { StyleSheet, Text, View } from "react-native";
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
import * as Notifications from 'expo-notifications'  
import NotificationListener from "./components/NotificationListener";

Notifications.setNotificationHandler({ 
  handleNotification:async function(notification){ 
  return { 
    shouldShowAlert:true, 
    shouldPlaySound:true,
  }; 
} 
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
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="User Info"
        component={UserInfo}
        options={{ headerBackTitleVisible: false }}
      />
      <Stack.Screen
        name="Add A Book"
        component={AddABook}
        options={({ navigation }) => ({
          headerLeft: () => (
            <CustomButton onPress={() => navigation.goBack()}>
              <AntDesign name="close" size={24} color="black" />
            </CustomButton>
          ),
          gestureDirection: "vertical",
          transitionSpec: {
            close: {
              animation: "timing",
              config: { duration: 1000 },
            },
          },
        })}
      />
      <Stack.Screen
        name="Book Detail"
        component={BookDetail}
        options={{ headerBackTitleVisible: false }}
      />
      <Stack.Screen
        name="Other User Profile"
        component={OtherUserProfile}
        options={{ headerBackTitleVisible: false }}
      />
      <Stack.Screen name="Add A Review" component={AddReview} />
      <Stack.Screen name="Map" component={Map} />  
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
              screenOptions={{
                headerBackTitleVisible: false,
              }}
            >
              {userLoggedIn ? AppStack : AuthStack}
            </Stack.Navigator>
          </NavigationContainer>
        </GestureHandlerRootView>
      </ActionSheetProvider>
    </UserProvider>
  );
}

const styles = StyleSheet.create({});
