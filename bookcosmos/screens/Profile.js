import { StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import CustomButton from "../components/CustomButton";
import Library from "./Library";
import Reviews from "./Reviews";
import { Ionicons } from "@expo/vector-icons";

export default function Profile({ navigation }) {
  const [activeTab, setActiveTab] = useState("library");
  return (
    <View>
      <CustomButton onPress={() => navigation.navigate("UserInfo")}>
        <Ionicons name="person-circle" size={60} color="black" />
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
        <Library navigation={navigation} />
      ) : (
        <Reviews />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  addABook: {
    alignItems: "left",
    marginVertical: 10,
    marginLeft: 65,
  },
  tabs: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 10,
  },
});
