import { createUserWithEmailAndPassword } from "firebase/auth";
import { useState, useEffect } from "react";
import { View, Text, StyleSheet, Alert } from "react-native";
import { auth } from "../firebase-files/firebaseSetup";
import { CustomInput, CustomPassWordInput } from "../components/InputHelper";
import CustomButton from "../components/CustomButton";
import { writeToDB } from "../firebase-files/firestoreHelper";
import AuthenticationBackground from "../components/AuthenticationBackground";
import { useCustomFonts } from "../Fonts";

// Signup component to allow users to signup
export default function Signup({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isEmpty, setIsEmpty] = useState(true);
  const [passwordError, setPasswordError] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);

  const { fontsLoaded } = useCustomFonts();
  if (!fontsLoaded) {
    return <Text>Loading...</Text>;
  }

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
        notification: false,
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
      <AuthenticationBackground />
      <Text style={styles.logo}>Book Cosmos</Text>
      <Text style={styles.slogan}>Start a Literary Odyssey </Text>
      <Text style={styles.slogan}>
        Where Every Swap is a New Universe to Explore
      </Text>
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
        <Text style={styles.loginText}>Already Registered? Login</Text>
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
  logo: {
    fontFamily: "PaytoneOne_400Regular",
    fontSize: 45,
    textAlign: "center",
    marginBottom: 20,
  },
  slogan: {
    fontFamily: "Molengo_400Regular",
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
  },
  disabledText: {
    fontFamily: "Molengo_400Regular",
    color: "grey",
    fontSize: 18,
  },
  normalText: {
    fontFamily: "Molengo_400Regular",
    fontSize: 18,
  },
  loginText: {
    fontFamily: "Molengo_400Regular",
    fontSize: 18,
  },
});
