import { StyleSheet, Text, View } from 'react-native'
import React from 'react' 
import { auth } from "../firebase-files/firebaseSetup"; 
import CustomButton from '../components/CustomButton';

export default function UserInfo() { 
    const signOutHandler = async () => {
        try {
            await signOut(auth);
        } catch (err) {
            console.log(err);
        }
        };
    return (
        <View>
            <Text>{auth.currentUser.uid}</Text>
            <Text>{auth.currentUser.email}</Text>  
            <CustomButton onPress={signOutHandler}> 
                <Text>Log out</Text>
            </CustomButton> 
        </View>
    )
}

const styles = StyleSheet.create({})