import { StyleSheet, Text, View, Alert, Switch} from 'react-native'
import {useState, useEffect} from 'react'  
import * as Notifications from 'expo-notifications';

export default function NotificationManager({initialNotification, notificationHandler}) {     
    const [isNotificationsEnabled, setIsNotificationsEnabled] = useState(false);  
    
    useEffect(() => { 
        setIsNotificationsEnabled(initialNotification); 
    }, [initialNotification]); 

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

    const toggleSwitch = async () => {
        const newNotificationEnabled = !isNotificationsEnabled;  
        if (newNotificationEnabled) { 
            try { 
                if (!await verifyPermission()) { 
                    Alert.alert("You need to give permission for notification."); 
                    return;
                } 
                setIsNotificationsEnabled(true); 
                notificationHandler(true);
            } catch (error) { 
                console.log(error);
            }
        } else {  
            await Notifications.cancelAllScheduledNotificationsAsync();
            setIsNotificationsEnabled(false); 
            notificationHandler(false);
        }
    };  

    return (
        <View style={styles.switchContainer}>
        <Text style={styles.text}>Allow Notifications</Text> 
        <View style={styles.switch}>
        <Switch
          onValueChange={toggleSwitch}
          value={isNotificationsEnabled} 
        /> 
        </View>
      </View>
      ) 
    }

const styles = StyleSheet.create({ 
    switchContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",     
        marginVertical: 10,
        width: "100%",
      },  
      text: { 
        fontWeight: "bold", 
        marginLeft: 10,
      },
}) 