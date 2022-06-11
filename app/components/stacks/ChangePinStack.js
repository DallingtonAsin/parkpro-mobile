import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import ChangePinScreen from '../../screens/ChangePinScreen';
import StackOption from '../common/StackOption';


const Stack = createStackNavigator();

 const ChangePinStack = ({ navigation }) => {
    return(
      <Stack.Navigator initialRouteName="ChangePin">
      <Stack.Screen name="ChangePin" component={ChangePinScreen}
        options = {() => (StackOption(navigation, 'Change PIN'))
        }>
    </Stack.Screen>
    </Stack.Navigator>
    
    )
}
export default ChangePinStack