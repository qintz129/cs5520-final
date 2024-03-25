import { StyleSheet, Text, View } from "react-native";
import React, { useState, useEffect } from "react";
import CustomButton from "../components/CustomButton";
import Library from "./Library";
import Reviews from "./Reviews";
import { Ionicons } from "@expo/vector-icons";

export default function OtherUserProfile({ navigation, route }) {
  const [activeTab, setActiveTab] = useState("library");
  const { ownerId, ownerName } = route.params;

  useEffect(() => {
    navigation.setOptions({
      title: ownerName,
    });
  }, [ownerName]);

  return (
    <View>
      <View style={styles.userAvatar}>
        <Ionicons name="person-circle" size={60} color="black" />
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
        <Library navigation={navigation} userId={ownerId} isMyLibrary={false} />
      ) : (
        <Reviews />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  userAvatar: {
    alignItems: "center",
    marginVertical: 10,
  },
  tabs: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 10,
  },
});
