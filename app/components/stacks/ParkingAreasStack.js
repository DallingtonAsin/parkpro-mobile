import React from 'react';
import { createStackNavigator, HeaderBackButton} from '@react-navigation/stack'
import ParkingAreasScreen from '../../screens/ParkingAreasScreen'

const Stack = createStackNavigator();

 const ParkingAreasStack = ({ navigation }) => {
    return(
      <Stack.Navigator initialRouteName="ParkingAreas"  
      screenOptions={{
        headerShown: false
      }}>
      <Stack.Screen name="ParkingAreas" component={ ParkingAreasScreen }>
    </Stack.Screen>
    </Stack.Navigator>
    )
}

export default ParkingAreasStack;