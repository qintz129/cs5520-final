import React from 'react';
import { Pressable, StyleSheet } from 'react-native'; 

// CustomButton component using Pressable to achieve the button for all screens 
export default function CustomButton({onPress, disabled=false, customStyle={}, children}) {
  return (
    <Pressable onPress={onPress}   
      disabled={disabled} 
      hitSlop={10}
      style={  
        ({pressed}) =>[ 
          styles.button,  
          customStyle,
          pressed && styles.pressed
        ]}  
      >
    {children}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: { 
    marginTop: 10, 
    marginBottom: 10, 
    alignItems: 'center', 
    justifyContent: 'center',
  }, 
  pressed: { 
    opacity: 0.5,   
  },
});