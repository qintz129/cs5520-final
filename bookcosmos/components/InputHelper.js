import { TextInput, View, Text } from "react-native";
import CustomButton from "./CustomButton";
import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import { COLORS } from "../styles/Colors";
import { useCustomFonts } from "../hooks/UseFonts";
import { inputHelperStyles } from "../styles/ComponentStyles";

// CustomInput component to achieve the input for all screens
export function CustomInput({
  title,
  onChangeText,
  value,
  placeholder = "",
  editable = true,
  pressable = false,
  fetch = false,
  fetchFunction,
}) {
  const { fontsLoaded } = useCustomFonts();
  const styles = inputHelperStyles;
  if (!fontsLoaded) {
    return null;
  }
  return (
    <View style={styles.container}>
      <View style={styles.extraEdit}>
        <Text style={[styles.title, fetch && styles.extraEditTitle]}>
          {title}
        </Text>
        {fetch && (
          <CustomButton onPress={fetchFunction} disabled={!pressable}>
            <MaterialCommunityIcons
              name="application-import"
              size={styles.iconSize}
              color={COLORS.black}
            />
          </CustomButton>
        )}
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
  editFunction,
}) {
  const { fontsLoaded } = useCustomFonts();
  const styles = inputHelperStyles;
  if (!fontsLoaded) {
    return null;
  }
  return (
    <View style={styles.container}>
      <View style={styles.extraEdit}>
        <Text style={[styles.title, editButton && styles.extraEditTitle]}>
          {title}
        </Text>
        {editButton && (
          <CustomButton onPress={editFunction}>
            <AntDesign
              name="edit"
              size={styles.iconSize}
              color={COLORS.black}
            />
          </CustomButton>
        )}
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
            size={styles.iconSize}
            color={COLORS.grey}
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
  fetchFunction,
}) {
  const { fontsLoaded } = useCustomFonts();
  const styles = inputHelperStyles;
  if (!fontsLoaded) {
    return null;
  }
  return (
    <View style={styles.container}>
      <View style={styles.extraEdit}>
        <Text style={[styles.title, fetch && styles.extraEditTitle]}>
          {title}
        </Text>
        {fetch && (
          <CustomButton onPress={fetchFunction} disabled={!pressable}>
            <MaterialCommunityIcons
              name="application-import"
              size={styles.iconSize}
              color={COLORS.black}
            />
          </CustomButton>
        )}
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
