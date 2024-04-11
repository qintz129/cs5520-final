import { StyleSheet, TextInput, View, Text } from "react-native";
import CustomButton from "./CustomButton";
import React from "react";
import { Ionicons } from "@expo/vector-icons"; 
import { MaterialCommunityIcons } from '@expo/vector-icons'; 
import { AntDesign } from '@expo/vector-icons';

// CustomInput component to achieve the input for all screens
export function CustomInput({
  title,
  onChangeText,
  value,
  placeholder = "",
  editable = true,  
  pressable = false,
  fetch = false, 
  fetchFunction
}) {
  return (
    <View style={styles.container}>
      <View style={styles.extraEdit}>
          <Text style={[styles.title, fetch && styles.extraEditTitle]}>{title}</Text> 
          {fetch && ( 
            <CustomButton onPress={fetchFunction} disabled={!pressable} > 
              <MaterialCommunityIcons name="application-import" size={24} color="black" />
            </CustomButton>  
          ) 
          } 
        </View>
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
  onToggleVisibility, 
  editButton = false, 
  editFunction
}) {
  return (
    <View style={styles.container}>
      <View style={styles.extraEdit}>
          <Text style={[styles.title, editButton && styles.extraEditTitle]}>{title}</Text> 
          {editButton && ( 
            <CustomButton onPress={editFunction}> 
              <AntDesign name="edit" size={24} color="black" />
            </CustomButton>  
          ) 
          } 
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          style={[styles.input, !editable && styles.nonEditable]}
          onChangeText={onChangeText}
          value={value}
          placeholder={placeholder}
          editable={editable}
          secureTextEntry={secureTextEntry}
        />
        <CustomButton
          onPress={onToggleVisibility}
          customStyle={styles.viewButton}
        >
          <Ionicons
            name={secureTextEntry ? "eye-off" : "eye"}
            size={24}
            color="grey"
          />
        </CustomButton>
      </View> 
    </View>
  );
}

export function MultilineInput({
  title,
  onChangeText,
  value,
  placeholder = "",
  editable = true, 
  fetch = false,  
  pressable = false,
  fetchFunction
}) {
  return (
    <View style={styles.container}> 
    <View style={styles.extraEdit}>
        <Text style={[styles.title, fetch && styles.extraEditTitle]}>{title}</Text> 
        {fetch && ( 
          <CustomButton onPress={fetchFunction} disabled={!pressable}> 
            <MaterialCommunityIcons name="application-import" size={24} color="black" />
          </CustomButton>  
        ) 
        } 
      </View>
      <TextInput
        style={[styles.multiline, !editable && styles.nonEditable]}
        onChangeText={onChangeText}
        value={value}
        placeholder={placeholder}
        editable={editable}
        multiline={true}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    marginHorizontal: 10,
    marginTop: 10,
  },
  title: {
    fontWeight: "bold", 
  }, 
  extraEditTitle: {
   alignSelf: "center", 
   marginRight: 10,
  },
  input: {
    height: 40,
    fontSize: 16,
    borderWidth: 1.5,
    marginTop: 5,
    borderRadius: 10,
    paddingHorizontal: 10,
    borderColor: "gray",
    width: "100%",
  },
  multiline: {
    borderWidth: 1.5, 
    fontSize: 16,
    borderColor: "gray",
    borderRadius: 10,
    marginBottom: 10,
    marginTop: 5,
    minHeight: 150,  
    paddingHorizontal: 10, 
    width: "100%",
  },
  inputContainer: {
    flexDirection: "row",
    position: "relative",
  },
  viewButton: {
    position: "absolute",
    right: 10,
  },
  nonEditable: {
    borderWidth: 0,
    backgroundColor: "#f0f0f0",
  }, 
  extraEdit: {
    flexDirection: "row",
  },
});
