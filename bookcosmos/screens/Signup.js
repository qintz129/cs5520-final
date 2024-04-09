import { createUserWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import { View, Text, StyleSheet, Alert } from "react-native";
import { auth } from "../firebase-files/firebaseSetup";
import { CustomInput, CustomPassWordInput } from "../components/InputHelper";
import CustomButton from "../components/CustomButton";
import { writeToDB } from "../firebase-files/firestoreHelper";

// Signup component to allow users to signup
export default function Signup({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isEmpty, setIsEmpty] = useState(true);
  const [passwordError, setPasswordError] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);

  const loginHandler = () => {
    navigation.replace("Login");
  };

  const signupHandler = async () => {
    if (password !== confirmPassword) {
      setPasswordError(true);
      return;
    }
    try {
      const userCred = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const newUser = {
        uid: userCred.user.uid,
        name: email,
        email: email,
        password: password,
      };
      writeToDB(newUser, "users");
    } catch (err) {
      console.log(err.code);
      if (err.code === "auth/email-already-in-use") {
        Alert.alert("This email is already signed up");
      } else if (err.code === "auth/weak-password") {
        Alert.alert("Weak password, password should be at least 6 characters");
      }
    }
  };

  const emailHandler = (changedText) => {
    setEmail(changedText);
    setIsEmpty(changedText === "" || password === "" || confirmPassword === "");
  };

  const passwordHandler = (changedText) => {
    setPassword(changedText);
    setPasswordError(false);
    setIsEmpty(email === "" || changedText === "" || confirmPassword === "");
  };

  const confirmPasswordHandler = (changedText) => {
    setConfirmPassword(changedText);
    setPasswordError(false);
    setIsEmpty(email === "" || password === "" || changedText === "");
  };

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
      {passwordError && <Text>Passwords do not match</Text>}
      <CustomPassWordInput
        title="Confirm Password"
        onChangeText={confirmPasswordHandler}
        value={confirmPassword}
        placeholder="Password"
        secureTextEntry={!passwordVisible}
        onToggleVisibility={toggleVisibility}
      />
      {passwordError && <Text>Passwords do not match</Text>}
      <CustomButton onPress={signupHandler} disabled={isEmpty}>
        <Text style={isEmpty ? styles.disabledText : styles.normalText}>
          Register
        </Text>
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
    paddingHorizontal: 20,
    justifyContent: "center",
  },
  disabledText: {
    color: "grey",
  },
});
