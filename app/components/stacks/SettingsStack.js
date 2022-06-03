import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import SettingsScreen from '../../screens/SettingsScreen';
import StackOption from '../common/StackOption';

const Stack = createStackNavigator();

const SettingsStack = ({ navigation }) => {
                                                                    
    return(
      <Stack.Navigator initialRouteName="Settings">
      <Stack.Screen name="Settings" component={SettingsScreen}
      options = {() => (StackOption(navigation, 'Settings'))
    }>
    </Stack.Screen>
    </Stack.Navigator>
    
    )
}
export default SettingsStack