import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import ChangePhoneNumberScreen from '../../screens/ChangePhoneNumberScreen';
import StackOption from '../common/StackOption';

const Stack = createStackNavigator();


  const ChangePhoneNumberStack = ({ navigation }) => {
                                                              
    return(
      <Stack.Navigator>
      <Stack.Screen name="ChangePhoneNumberScreen" component={ChangePhoneNumberScreen}
         options = {() => (StackOption(navigation, 'Change Phone Number'))}/>
      </Stack.Navigator>
    )
}
export default ChangePhoneNumberStack