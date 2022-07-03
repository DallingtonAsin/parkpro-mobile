import React from 'react';
import { createStackNavigator } from '@react-navigation/stack'
import ProfileScreen from '../../screens/ProfileScreen'
import StackOption from '../common/StackOption';

const Stack = createStackNavigator();

const ProfileStack = ({ navigation }) => {
    return(
      <Stack.Navigator initialRouteName="Profile">
      <Stack.Screen name="Profile" component={ ProfileScreen }
         options = {() => (StackOption(navigation, 'Profile'))}/>
      </Stack.Navigator>
    )
}

export default ProfileStack