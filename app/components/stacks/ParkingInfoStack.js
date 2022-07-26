import React from 'react';
import { createStackNavigator } from '@react-navigation/stack'
import ParkingInfoScreen from '../../screens/ParkingInfoScreen'
import StackOption from '../common/StackOption';

const Stack = createStackNavigator();

  const ParkingInfoStack = ({ navigation }) => {
    return(
      <Stack.Navigator initialRouteName="ParkingInfo">
      <Stack.Screen name="ParkingInfo" component={ ParkingInfoScreen }
        options = {() => (StackOption(navigation, 'Parking Info'))}/>
       </Stack.Navigator>
    )
}
export default ParkingInfoStack;