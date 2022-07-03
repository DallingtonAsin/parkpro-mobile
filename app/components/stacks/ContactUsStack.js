import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import HelpScreen from '../../screens/ContactUsScreen';
import StackOption from '../common/StackOption';

const Stack = createStackNavigator();

 const ContactUsStack = ({ navigation }) => {
    return(
      <Stack.Navigator initialRouteName="Help">
      <Stack.Screen name="Help" component={HelpScreen}
        options = {() => (StackOption(navigation, 'Contact Us'))}/>
      </Stack.Navigator>
    )
}
export default ContactUsStack