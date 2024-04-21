import { Text, View, Alert, Switch } from "react-native";
import { useState, useEffect } from "react";
import * as Notifications from "expo-notifications";
import { notificationManagerStyles } from "../styles/ComponentStyles";

// NotificationManager component to manage the notification settings
export default function NotificationManager({
  initialNotification,
  notificationHandler,
}) {
  const [isNotificationsEnabled, setIsNotificationsEnabled] = useState(false);
  const styles = notificationManagerStyles;
 // Set the initial notification setting
  useEffect(() => {
    setIsNotificationsEnabled(initialNotification);
  }, [initialNotification]);
  // Verify the permission to send notifications
  async function verifyPermission() {
    try {
      const status = await Notifications.getPermissionsAsync();
      if (status.granted) {
        return true;
      }
      const permission = await Notifications.requestPermissionsAsync();
      return permission.granted;
    } catch (error) {
      console.log(error);
    }
  }
  // Toggle the notification setting
  const toggleSwitch = async () => {
    const newNotificationEnabled = !isNotificationsEnabled; 
    // Enable or disable the notification
    if (newNotificationEnabled) {
      try {
        if (!(await verifyPermission())) {
          Alert.alert("You need to give permission for notification.");
          return;
        }
        setIsNotificationsEnabled(true);
        notificationHandler(true);
      } catch (error) {
        console.log(error);
      }
    } else { 
      // After disabling the notification settings, Cancel all scheduled notifications
      await Notifications.cancelAllScheduledNotificationsAsync();
      setIsNotificationsEnabled(false);
      notificationHandler(false);
    }
  };

  return (
    <View style={styles.switchContainer}>
      <Text style={styles.text}>Allow Notifications</Text>
      <View style={styles.switch}>
        <Switch onValueChange={toggleSwitch} value={isNotificationsEnabled} />
      </View>
    </View>
  );
}
