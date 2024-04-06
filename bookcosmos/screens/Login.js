import { signInWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import { View, Text, StyleSheet, Alert } from "react-native";
import { auth } from "../firebase-files/firebaseSetup";
import { CustomInput, CustomPassWordInput} from "../components/InputHelper";
import CustomButton from "../components/CustomButton";

// Login component to allow users to login
export default function Login({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState(""); 
  const [passwordVisible, setPasswordVisible] = useState(false); 
  const [isEmpty, setIsEmpty] = useState(true);

  const signupHandler = () => {
    navigation.replace("Signup");
  };
  const loginHandler = async () => {
    try {
      const userCred = await signInWithEmailAndPassword(auth, email, password);
    } catch (err) { 
      console.log(err.code);
      if (err.code === "auth/invalid-credential") {
        Alert.alert("Wrong email or password, please try again");
      }
    }
  };
  
  const emailHandler = (changedText) => { 
    setEmail(changedText);  
    setIsEmpty(changedText === "" || password === "");
  } 

  const passwordHandler = (changedText) => { 
    setPassword(changedText); 
    setIsEmpty(email === "" || changedText === "");
  }   

  const toggleVisibility = () => {  
    setPasswordVisible(!passwordVisible);
  };
  return (
    <View style={styles.container}>
      <CustomInput
        title="Email"
        onChangeText={emailHandler}
        value={email}
        placeholder="Email"
      />
      <CustomPassWordInput
        title="Password"
        onChangeText={passwordHandler}
        value={password}
        placeholder="Password" 
        secureTextEntry={!passwordVisible} 
        onToggleVisibility={toggleVisibility}
      />
      <CustomButton onPress={loginHandler}>
        <Text style={isEmpty ? styles.disabledText : styles.normalText}>  
          Login 
        </Text>
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
  }, 
  disabledText: {
    color: "grey",
  },
});
