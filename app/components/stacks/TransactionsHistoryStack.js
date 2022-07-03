import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import TransactionsHistoryScreen from '../../screens/TransactionsHistoryScreen';
import StackOption from '../common/StackOption';

const Stack = createStackNavigator();

const TransactionsHistoryStack = ({ navigation }) => {
    return(
      <Stack.Navigator initialRouteName="Statement">
      <Stack.Screen name="Statement" component={TransactionsHistoryScreen}
     options = {() => (StackOption(navigation, 'Transaction History'))
    }>
    </Stack.Screen>
    </Stack.Navigator>
    )
}
export default TransactionsHistoryStack