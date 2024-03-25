import { signInWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import { View, Text, StyleSheet, Alert } from "react-native";
import { auth } from "../firebase-files/firebaseSetup"; 
import CustomInput from "../components/CustomInput"; 
import CustomButton from "../components/CustomButton";

export default function Login({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const signupHandler = () => {
    navigation.replace("Signup");
  };
  const loginHandler = async () => {
    try {
      if (!email || !password) {
        Alert.alert("Fields should not be empty");
        return;
      }
      const userCred = await signInWithEmailAndPassword(auth, email, password);
      console.log(userCred);
    } catch (err) {
      console.log(err);
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
      <CustomButton onPress={loginHandler}> 
        <Text>Login</Text>
      </CustomButton>  
      <CustomButton onPress={signupHandler}> 
        <Text>New User? Create An Account</Text>
      </CustomButton> 
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "stretch",
    justifyContent: "center", 
    paddingHorizontal: 20,  
  }
});
