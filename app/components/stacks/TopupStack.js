import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import TopUpScreen from '../../screens/TopUpScreen';
import StackOption from '../common/StackOption';

const Stack = createStackNavigator();

const TopupStack = ({ navigation }) => {
    return(
      <Stack.Navigator initialRouteName="Statement">
      <Stack.Screen name="TopUp" component={TopUpScreen}
        options = {() => (StackOption(navigation, 'Top Up'))}/>
      </Stack.Navigator>
    )
}
export default TopupStack