import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import ZoomScreen from '../../screens/ZoomScreen';
import StackOption from '../common/StackOption';

const Stack = createStackNavigator();


const ZoomStack = ({ navigation }) => {
    return(
      <Stack.Navigator initialRouteName="Zoom">
      <Stack.Screen name="Zoom" component={ZoomScreen}
         options = {() => (StackOption(navigation, 'Meeting'))}/>
      </Stack.Navigator>
    )
}
export default ZoomStack