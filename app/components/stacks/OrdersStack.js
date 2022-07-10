import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import OrdersScreen from '../../screens/OrdersScreen';
import StackOption from '../common/StackOption';

const Stack = createStackNavigator();

 const OrdersStack = ({ navigation }) => {
                                                                
    return(
      <Stack.Navigator initialRouteName="Orders">
      <Stack.Screen name="Orders" component={OrdersScreen}
         options = {() => (StackOption(navigation, 'Orders'))}/>
      </Stack.Navigator>
    )
}
export default OrdersStack