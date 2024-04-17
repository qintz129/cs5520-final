import { signInWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import { View, Text, StyleSheet, Alert } from "react-native";
import { auth } from "../firebase-files/firebaseSetup";
import { CustomInput, CustomPassWordInput } from "../components/InputHelper";
import CustomButton from "../components/CustomButton";
import AuthenticationBackground from "../components/AuthenticationBackground";
import { useCustomFonts } from "../Fonts";

// Login component to allow users to login
export default function Login({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [isEmpty, setIsEmpty] = useState(true);

  const { fontsLoaded } = useCustomFonts();
  if (!fontsLoaded) {
    return <Text>Loading...</Text>;
  }

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
  };

  const passwordHandler = (changedText) => {
    setPassword(changedText);
    setIsEmpty(email === "" || changedText === "");
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
      <CustomButton onPress={loginHandler}>
        <Text style={isEmpty ? styles.disabledText : styles.normalText}>
          Login
        </Text>
      </CustomButton>
      <CustomButton onPress={signupHandler}>
        <Text style={styles.signUpText}>New User? Create An Account</Text>
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
  signUpText: {
    fontFamily: "Molengo_400Regular",
    fontSize: 18,
  },
});
