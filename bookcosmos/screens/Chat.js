import { SafeAreaView } from "react-native";
import React, {
  useState,
  useLayoutEffect,
  useCallback,
  useEffect,
} from "react";
import { GiftedChat } from "react-native-gifted-chat";
import {
  collection,
  addDoc,
  orderBy,
  query,
  onSnapshot,
} from "firebase/firestore";
import { auth, database } from "../firebase-files/firebaseSetup";
import { chatStyles } from "../styles/ScreenStyles";

// Chat screen to display messages between users
export default function Chat({ route, navigation }) {
  const { otherId, otherName } = route.params;
  const [messages, setMessages] = useState([]);
  const styles = chatStyles;

  useEffect(() => {
    navigation.setOptions({
      title: otherName,
    });
  }, [otherName]);

  function generateChatRoomId(userId1, userId2) {
    const ids = [userId1, userId2].sort();
    return `chat_${ids[0]}_${ids[1]}`;
  }

  const chatRoomId = generateChatRoomId(auth.currentUser.uid, otherId);
  console.log(chatRoomId);
  
  // Fetch messages from the database
  useLayoutEffect(() => {
    const messagesRef = collection(database, "chats", chatRoomId, "messages");
    const q = query(messagesRef, orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      if (querySnapshot.empty) {
        console.log("The chat room is empty.");
      } else {
        setMessages(
          querySnapshot.docs.map((doc) => ({
            _id: doc.id,
            createdAt: doc.data().createdAt.toDate(),
            text: doc.data().text,
            user: doc.data().user,
          }))
        );
      }
    });

    return () => unsubscribe();
  }, [chatRoomId]);

  // Send messages to the database
  const onSend = useCallback((messages = []) => {
    setMessages((previousMessages) =>
      GiftedChat.append(previousMessages, messages)
    );
    const { _id, createdAt, text, user } = messages[0];

    addDoc(collection(database, "chats", chatRoomId, "messages"), {
      _id,
      createdAt,
      text,
      user,
      to: otherId,
    });
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <GiftedChat
        messages={messages}
        showAvatarForEveryMessage={false}
        showUserAvatar={false}
        onSend={(messages) => onSend(messages)}
        renderAvatar={null}
        messagesContainerStyle={styles.messagesContainerStyle}
        textInputStyle={styles.textInputStyle}
        user={{
          _id: auth.currentUser.uid,
        }}
      />
    </SafeAreaView>
  );
}
