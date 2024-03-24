import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'; 
import Explore from '../screens/Explore'; 
import Requests from '../screens/Requests'; 
import History from '../screens/History'; 
import Profile from '../screens/Profile';

const Tab = createBottomTabNavigator();

export default function MainTab() {
  return (
    <Tab.Navigator> 
        <Tab.Screen name="Explore" component={Explore} />
        <Tab.Screen name="Requests" component={Requests} />
        <Tab.Screen name="History" component={History} />
        <Tab.Screen name="Profile" component={Profile} />
    </Tab.Navigator>
  );
}