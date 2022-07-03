import React from 'react';
import { createStackNavigator } from '@react-navigation/stack'
import ParkingFeesScreen from '../../screens/ParkingFeesScreen'
import StackOption from '../common/StackOption';

const Stack = createStackNavigator();

  const ParkingFeesStack = ({ navigation }) => {
    return(
      <Stack.Navigator initialRouteName="ParkingFees">
      <Stack.Screen name="ParkingFees" component={ ParkingFeesScreen }
        options = {() => (StackOption(navigation, 'Parking Fees'))}/>
       </Stack.Navigator>
    )
}
export default ParkingFeesStack;