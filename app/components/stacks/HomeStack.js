import React from 'react';
import { createStackNavigator} from '@react-navigation/stack'
import HomeScreen from '../../screens/HomeScreen'
import StackOption from '../common/StackOption';

const Stack = createStackNavigator();

const HomeStack = ({ navigation }) => {
    return(
      <Stack.Navigator initialRouteName="Home">
      <Stack.Screen name="Home" component={HomeScreen}
      options = {() => (StackOption(navigation, 'Home'))
    }>
      </Stack.Screen>
      </Stack.Navigator>
      )
    
}
export default HomeStack;