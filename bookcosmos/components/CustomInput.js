import { StyleSheet, TextInput, View, Text } from 'react-native' 
import React from 'react'  

// CustomInput component to achieve the input for all screens 
// Customized the input style and reminder message for invalid input
export default function CustomInput({title, onChangeText, keyboardType="default", value, placeholder='', editable=true}){  
    return (
        <View style={styles.container}>
            <Text style={styles.text}>{title}</Text>
            <TextInput  
                style={[styles.input, !editable && styles.nonEditable]} 
                onChangeText={onChangeText}  
                keyboardType={keyboardType}  
                value = {value} 
                placeholder={placeholder} 
                editable = {editable}
            /> 
        </View>
    )
}


const styles = StyleSheet.create({  
    container:{ 
        marginBottom: 20, 
        width: '100%',  
        marginHorizontal: 20, 
        alignSelf: 'center',
    }, 
    text: { 
        fontWeight: 'bold', 
    },
    input: { 
        height: 40, 
        fontSize: 16, 
        borderWidth: 1.5, 
        marginTop: 5, 
        borderRadius: 10, 
        paddingHorizontal: 10,
    },  
    nonEditable: {
        borderWidth: 0, 
        backgroundColor: '#f0f0f0', 
      },
})