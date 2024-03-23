import { StyleSheet, Text, View } from 'react-native'
import React, {useState} from "react";
import { signOut } from "firebase/auth";
import { auth } from "../firebase-files/firebaseSetup";
import CustomButton from "../components/CustomButton"; 
import Library  from "./Library"; 
import Reviews from "./Reviews";

export default function Profile() {  
  const [activeTab, setActiveTab] = useState('library');
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
      <View style={styles.tabs}>
        <CustomButton onPress={() => setActiveTab('library')}>  
          <Text>My Library</Text>
        </CustomButton> 
        <CustomButton onPress={() => setActiveTab('reviews')}> 
          <Text>Reviews</Text>
        </CustomButton> 
      </View>

      {/* Conditional Content Rendering */}
      {activeTab === 'library' ? <Library /> : <Reviews />}
    </View>
  );
} 

const styles = StyleSheet.create({ 
  tabs: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 10,
  }
})
