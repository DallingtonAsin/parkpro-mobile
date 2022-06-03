import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import NotificationScreen from '../../screens/NotificationScreen';
import StackOption from '../common/StackOption';

const Stack = createStackNavigator();

 const NotificationStack = ({ navigation }) => {
                                                                
    return(
      <Stack.Navigator initialRouteName="Notification">
      <Stack.Screen name="Notifications" component={NotificationScreen}
      options = {() => (StackOption(navigation, 'Notifications'))
    }>
    </Stack.Screen>
    </Stack.Navigator>
    
    )
}
export default NotificationStack