import React, { useState } from "react";
import { StyleSheet, Text, View, TextInput, Button } from "react-native";
import { writeUserBooksToDB } from "../firebase-files/firestoreHelper";

export default function AddABook({ navigation }) {
  const [bookName, setBookName] = useState("");
  const [author, setAuthor] = useState("");
  const [description, setDescription] = useState("");

  const handleSave = async () => {
    try {
      // Ensure all fields are filled before saving
      if (!bookName || !author || !description) {
        alert("Please fill in all fields");
        return;
      }

      // Construct book data object
      const bookData = {
        bookName,
        author,
        description,
      };

      // Write book data to the database
      await writeUserBooksToDB(bookData);

      // Navigate back to the previous screen
      navigation.goBack();
    } catch (error) {
      console.error("Error saving book:", error);
    }
  };

  const handleClear = () => {
    // Clear all input fields
    setBookName("");
    setAuthor("");
    setDescription("");
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Book Name"
        value={bookName}
        onChangeText={setBookName}
      />
      <TextInput
        style={styles.input}
        placeholder="Author"
        value={author}
        onChangeText={setAuthor}
      />
      <TextInput
        style={styles.input}
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
      />
      <View style={styles.buttonContainer}>
        <Button title="Clear" onPress={handleClear} />
        <Button title="Save" onPress={handleSave} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    width: "100%",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginTop: 20,
  },
});
