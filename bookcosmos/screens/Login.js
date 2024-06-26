import { signInWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import { View, Text, Alert} from "react-native";
import { auth } from "../firebase-files/firebaseSetup";
import { CustomInput, CustomPassWordInput } from "../components/InputHelper";
import CustomButton from "../components/CustomButton";
import AuthenticationBackground from "../components/AuthenticationBackground";
import { useCustomFonts } from "../hooks/UseFonts";
import { authenticationStyles } from "../styles/ScreenStyles";

// Login component to allow users to login
export default function Login({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [isEmpty, setIsEmpty] = useState(true);
  const styles = authenticationStyles;
  const { fontsLoaded } = useCustomFonts();
  if (!fontsLoaded) {
    return null;
  }

  const signupHandler = () => {
    navigation.replace("Signup");
  };
  const loginHandler = async () => {
    try {
      const userCred = await signInWithEmailAndPassword(auth, email, password); 
      console.log("User logged in", userCred.user.uid);
    } catch (err) {
      //console.log(err.code);
      if (err.code === "auth/invalid-credential") {
        Alert.alert("Wrong email or password, please try again");
      } else if (err.code === "auth/user-not-found") {
        Alert.alert("User not found, please try again");
      } else if (err.code === "auth/wrong-password") {
        Alert.alert("Wrong password, please try again");
      } else if (err.code == "auth/invalid-email") {
        Alert.alert("Invalid email, please try again");
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
      <Text style={styles.logo}>
        Book <Text style={styles.coloredLetter}>C</Text>osmos
      </Text>
      <Text style={styles.slogan}>Start a Literary Odyssey </Text>
      <Text style={styles.slogan}>
        Where Every <Text style={styles.coloredWord}>Swap</Text> is a New
        Universe to Explore
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
      <CustomButton onPress={loginHandler} disabled={isEmpty}>
        <Text style={isEmpty ? styles.disabledText : styles.normalText}>
          Login
        </Text>
      </CustomButton>
      <CustomButton onPress={signupHandler}>
        <Text style={styles.normalText}>New User? Create An Account</Text>
      </CustomButton> 
    </View>
  );
}
