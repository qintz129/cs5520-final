import { createUserWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import { View, Text, StyleSheet, Alert } from "react-native";
import { auth } from "../firebase-files/firebaseSetup"; 
import CustomInput from "../components/CustomInput"; 
import CustomButton from "../components/CustomButton"; 
import { writeToDB } from "../firebase-files/firestoreHelper";

export default function Signup({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const loginHandler = () => {
    navigation.replace("Login");
  };
  const signupHandler = async () => {
    if (!email || !password || !confirmPassword) {
      Alert.alert("Fields should not be empty");
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert("passwords don't match");
      return;
    }
    try {
      const userCred = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      ); 
      const newUser = {uid: userCred.user.uid, name: email, email: email}; 
      writeToDB(newUser , "users");
      console.log(userCred);
    } catch (err) {
      console.log(err.code);
      if (err.code === "auth/email-already-in-use") {
        Alert.alert("this email is already signed up");
      } else if (err.code === "auth/weak-password") {
        Alert.alert("your password is weak");
      }
    }
  };
  return (
    <View style={styles.container}>
      <CustomInput  
        title="Email"  
        onChangeText={(changedText) => setEmail(changedText)}  
        value={email}  
        placeholder="Email" /> 
      <CustomInput  
        title="Password"  
        onChangeText={(changedText) => setPassword(changedText)}  
        value={password}  
        placeholder="Password" />   
      <CustomInput  
        title="Confirm Password"  
        onChangeText={(changedText) => setConfirmPassword(changedText)}  
        value={confirmPassword}  
        placeholder="Password" />   
      <CustomButton onPress={signupHandler}> 
        <Text>Register</Text>
      </CustomButton>  
      <CustomButton onPress={loginHandler}> 
        <Text>Already Registered? Login</Text>
      </CustomButton> 
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    // alignItems: "stretch",
    paddingHorizontal: 20, 
    justifyContent: "center",

  },
});
