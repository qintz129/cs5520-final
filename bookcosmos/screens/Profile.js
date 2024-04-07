import { StyleSheet, Text, View, Image } from "react-native";
import React, { useState, useEffect} from "react";
import CustomButton from "../components/CustomButton";
import Library from "./Library";
import Reviews from "./Reviews";
import { Ionicons } from "@expo/vector-icons"; 
import { useUser } from "../hooks/UserContext"; 
import { ref, uploadBytes, getDownloadURL} from "firebase/storage";   
import { auth, database, storage} from "../firebase-files/firebaseSetup";

// Profile component to display the profile of the user
export default function Profile({ navigation }) { 
  const {userInfo} = useUser();
  const [activeTab, setActiveTab] = useState("library"); 
  const [imageUri, setImageUri] = useState(null);  
  const [downloadUri, setDownloadUri] = useState(null);  

  useEffect(() => {
    setImageUri(userInfo.imageUri);
  }, [userInfo.imageUri]);

  useEffect(() => {
    const fetchImage = async () => {
      const imageRef = ref(storage, imageUri);

      try {
        const url = await getDownloadURL(imageRef); 
        setDownloadUri(url);
      } catch (error) {
        console.log(error);
      }
    };

    if (imageUri) {
      fetchImage();
    }
  }, [imageUri]);  
  console.log(userInfo);  
  console.log("imageUri", imageUri); 
  console.log("downloadUri", downloadUri);
  return (
    <View style={styles.container}>
      <CustomButton onPress={() => navigation.navigate("User Info")}> 
        <View style={styles.userAvatar}>
        {downloadUri? (  
          <Image source={{ uri: downloadUri }} style={styles.image} />
        ): ( 
        <Ionicons name="person-circle" size={100} color="black" /> 
          )} 
        </View>
      </CustomButton>
      <View style={styles.addABook}>
        <CustomButton
          onPress={() => navigation.navigate("Add A Book", { editMode: false })}
        >
          <Text>Add A Book</Text>
        </CustomButton>
      </View>
      <View style={styles.tabs}>
        <CustomButton onPress={() => setActiveTab("library")}>
          <Text>My Library</Text>
        </CustomButton>
        <CustomButton onPress={() => setActiveTab("reviews")}>
          <Text>Reviews</Text>
        </CustomButton>
      </View>
      {activeTab === "library" ? (
        <Library
          navigation={navigation}
          userId={auth.currentUser.uid}
          isMyLibrary={true}
        />
      ) : (
        <Reviews userId={auth.currentUser.uid} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  addABook: {
    alignItems: "flex-start",
    marginVertical: 10,
    marginLeft: 65,
  },
  tabs: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 10,
  }, 
  image: { 
    width: 100,
    height: 100,
    borderRadius: 50, 
  }, 
  container: {
    flex: 1,
  }, 
  userAvatar: {
    alignItems: "center",
    marginVertical: 5,
  },
});
