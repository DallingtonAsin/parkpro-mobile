import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import OrderDetailsScreen from '../../screens/OrderDetailsScreen';
import StackOption from '../common/StackOption';

const Stack = createStackNavigator();

 const OrderDetailsStack = ({ navigation }) => {
                                                                
    return(
      <Stack.Navigator initialRouteName="OrderDetails">
      <Stack.Screen name="OrderDetails" component={OrderDetailsScreen}
         options = {() => (StackOption(navigation, 'Order Details'))}/>
      </Stack.Navigator>
    )
}
export default OrderDetailsStack