import React from 'react';
import { createStackNavigator, HeaderBackButton} from '@react-navigation/stack'
import CloseByParkingsScreen from '../../screens/CloseByParkingsScreen'
import StackOption from '../common/StackOption';

const Stack = createStackNavigator();

 const CloseByParkingStack = ({ navigation }) => {
    return(
      <Stack.Navigator initialRouteName="NearBy Parkings"  
        screenOptions={{
        headerShown: true}}
        >
      <Stack.Screen name="CloseByParkings"
        component={ CloseByParkingsScreen }
        options = {() => (StackOption(navigation, 'Nearby Parkings'))}/>
      </Stack.Navigator>
    )
}

export default CloseByParkingStack;