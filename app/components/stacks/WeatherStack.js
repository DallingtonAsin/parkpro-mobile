import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import WeatherScreen from '../../screens/WeatherScreen';
import StackOption from '../common/StackOption';

const Stack = createStackNavigator();


const WeatherStack = ({ navigation }) => {
    return(
      <Stack.Navigator initialRouteName="Weather">
      <Stack.Screen name="Weather" component={WeatherScreen}
       options = {() => (StackOption(navigation, 'Weather'))
      }>
    </Stack.Screen>
    </Stack.Navigator>
    )
}
export default WeatherStack