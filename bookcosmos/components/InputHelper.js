import { StyleSheet, TextInput, View, Text } from "react-native"; 
import CustomButton from "./CustomButton";
import React from "react";
import { Ionicons } from '@expo/vector-icons';

// CustomInput component to achieve the input for all screens
export function CustomInput({
  title,
  onChangeText,
  value,
  placeholder = "",
  editable = true, 
}) {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{title}</Text>
      <TextInput
        style={[styles.input, !editable && styles.nonEditable]}
        onChangeText={onChangeText}
        value={value}
        placeholder={placeholder}
        editable={editable} 
      />
    </View>
  );
} 

// CustomPassWordInput component to achieve the password input for all screens
export function CustomPassWordInput({
  title,
  onChangeText,
  value,
  placeholder = "",
  editable = true,  
  secureTextEntry,
  onToggleVisibility
}) {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{title}</Text> 
      <View style={styles.inputContainer}>
        <TextInput
          style={[styles.input, !editable && styles.nonEditable]}
          onChangeText={onChangeText}
          value={value}
          placeholder={placeholder}
          editable={editable} 
          secureTextEntry={secureTextEntry}
        />  
        <CustomButton onPress={onToggleVisibility} customStyle={styles.viewButton}> 
          <Ionicons name={secureTextEntry ? 'eye' : 'eye-off'} size={24} color="grey" />
        </CustomButton>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    marginHorizontal: 20,
    alignSelf: "center", 
    marginTop: 10,
  },
  text: {
    fontWeight: "bold",
  },
  input: {
    height: 40,
    fontSize: 16,
    borderWidth: 1.5,
    marginTop: 5,
    borderRadius: 10,
    paddingHorizontal: 10, 
    width: "100%",
  }, 
  inputContainer: {
    flexDirection: 'row', 
    position: 'relative', 
  }, 
  viewButton: {
    position: 'absolute', 
    right: 10, 
  },
  nonEditable: {
    borderWidth: 0,
    backgroundColor: "#f0f0f0",
  },
});
