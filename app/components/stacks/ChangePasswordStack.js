import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import ChangePassword from '../../screens/ChangePasswordScreen';
import StackOption from '../common/StackOption';


const Stack = createStackNavigator();

 const ChangePasswordStack = ({ navigation }) => {
    return(
      <Stack.Navigator initialRouteName="ChangePassword">
      <Stack.Screen name="ChangePassword" component={ChangePassword}
        options = {() => (StackOption(navigation, 'Profile'))
        }>
    </Stack.Screen>
    </Stack.Navigator>
    
    )
}
export default ChangePasswordStack