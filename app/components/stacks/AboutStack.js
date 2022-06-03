import React from 'react';
import { createStackNavigator } from '@react-navigation/stack'
import AboutScreen from '../../screens/AboutScreen'
import StackOption from '../common/StackOption';

const Stack = createStackNavigator();

 const AboutStack = ({ navigation }) => {
    return(
      <Stack.Navigator initialRouteName="About">
      <Stack.Screen name="About" component={AboutScreen}
     options = {() => (StackOption(navigation, 'About'))
    }>
      </Stack.Screen>
      </Stack.Navigator>
      )
    
    }
export default AboutStack;