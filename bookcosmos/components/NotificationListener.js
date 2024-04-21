import { useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import * as Notifications from "expo-notifications";

// NotificationListener component to listen to the notification response
const NotificationListener = () => {
  const navigation = useNavigation();
  // Listen to the notification response
  useEffect(() => {
    const subscription = Notifications.addNotificationResponseReceivedListener(
      (notificationResponse) => {
        const screen =
          notificationResponse.notification.request.content.data.screen;
        console.log("Navigate to screen:", screen);
        navigation.navigate(screen);
      }
    );

    return () => {
      subscription.remove();
    };
  }, []);

  return null; // This component does not render anything
};

export default NotificationListener;
