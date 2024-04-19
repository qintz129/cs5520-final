import { StyleSheet, Text, View, Modal, Alert } from "react-native";
import { useState } from "react";
import { CustomPassWordInput } from "./InputHelper";
import CustomButton from "./CustomButton";
import { useCustomFonts } from "../Fonts";

export default function ChangePassword({ isVisible, onClose, onSave }) {
  const [newPassword, setNewPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState(false);

  const { fontsLoaded } = useCustomFonts();
  if (!fontsLoaded) {
    return <Text>Loading...</Text>;
  }

  const handleConfirm = () => {
    if (newPassword !== confirmPassword) {
      setPasswordError(true);
      return;
    }
    if (newPassword === "") {
      Alert.alert("Password cannot be empty");
      return;
    }
    if (newPassword.length < 6) {
      Alert.alert("Password should be at least 6 characters");
      return;
    }
    onSave(newPassword);
    Alert.alert("Password changed successfully");
    setNewPassword("");
    setConfirmPassword("");
    onClose();
  };

  const handleClose = () => {
    setNewPassword("");
    setConfirmPassword("");
    setPasswordError(false);
    onClose();
  };

  const newPasswordHandler = (changedText) => {
    setNewPassword(changedText);
    setPasswordError(false);
  };

  const confirmPasswordHandler = (changedText) => {
    setConfirmPassword(changedText);
    setPasswordError(false);
  };

  const toggleVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <CustomPassWordInput
            title="New Password"
            onChangeText={newPasswordHandler}
            value={newPassword}
            placeholder="New Password"
            secureTextEntry={!passwordVisible}
            onToggleVisibility={toggleVisibility}
          />
          {passwordError && (
            <Text style={styles.reminder}>Passwords do not match</Text>
          )}
          <CustomPassWordInput
            title="Confirm Password"
            onChangeText={confirmPasswordHandler}
            value={confirmPassword}
            placeholder="Confirm Password"
            secureTextEntry={!passwordVisible}
            onToggleVisibility={toggleVisibility}
          />
          {passwordError && (
            <Text style={styles.reminder}>Passwords do not match</Text>
          )}
          <View style={styles.buttonContainer}>
            <CustomButton
              customStyle={styles.cancelButton}
              onPress={handleClose}
            >
              <Text style={styles.cancelText}>Cancel</Text>
            </CustomButton>
            <CustomButton
              customStyle={styles.confirmButton}
              onPress={handleConfirm}
            >
              <Text style={styles.confirmText}>Confirm</Text>
            </CustomButton>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  modalView: {
    margin: 15,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 30,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    width: "95%",
  },
  reminder: {
    marginLeft: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 20,
  },
  cancelButton: {
    backgroundColor: "#f44336",
    height: 40,
    borderRadius: 10,
    width: "40%",
  },
  cancelText: {
    color: "white",
    fontSize: 18,
    fontFamily: "SecularOne_400Regular",
  },
  confirmButton: {
    backgroundColor: "#55c7aa",
    height: 40,
    borderRadius: 10,
    width: "40%",
  },
  confirmText: {
    color: "white",
    fontSize: 18,
    fontFamily: "SecularOne_400Regular",
  },
});
