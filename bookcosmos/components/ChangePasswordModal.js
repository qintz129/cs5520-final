import { StyleSheet, Text, View, Modal} from 'react-native'
import { useState } from "react"; 
import { CustomPassWordInput } from './InputHelper'; 
import CustomButton from './CustomButton';

export default function ChangePassword({ isVisible, onClose, onSave }){
  const [newPassword, setNewPassword] = useState(''); 
  const [passwordVisible, setPasswordVisible] = useState(false); 
  const [confirmPassword, setConfirmPassword] = useState(""); 
  const [passwordError, setPasswordError] = useState(false);

  const handleConfirm = () => { 
    if (newPassword !== confirmPassword) { 
      setPasswordError(true);  
      return; 
    }
    onSave(newPassword);  
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
          {passwordError && <Text style={styles.reminder}>Passwords do not match</Text>}
          <CustomPassWordInput
            title="Confirm Password"
            onChangeText={confirmPasswordHandler}
            value={confirmPassword}
            placeholder="Confirm Password"
            secureTextEntry={!passwordVisible}
            onToggleVisibility={toggleVisibility}
          />
          {passwordError && <Text style={styles.reminder}>Passwords do not match</Text>}
          <CustomButton onPress={handleConfirm}> 
            <Text>Confirm</Text> 
          </CustomButton> 
          <CustomButton onPress={handleClose}> 
            <Text>Cancel</Text> 
          </CustomButton>
        </View>
      </View>
    </Modal>
  );
};


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
    width: '95%'
  }, 
  reminder: {
    marginLeft: 10,
  },
});