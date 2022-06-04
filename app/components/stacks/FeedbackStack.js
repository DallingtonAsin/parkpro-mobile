
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import FeedbackScreen from '../../screens/FeedbackScreen';
import StackOption from '../common/StackOption';

const Stack = createStackNavigator();


 const FeedbackStack = ({ navigation }) => {
                            
    return(
      <Stack.Navigator initialRouteName="Feedback">
      <Stack.Screen name="Feedback" component={FeedbackScreen}
       options = {() => (StackOption(navigation, 'Feedback'))
      }>
    </Stack.Screen>
    </Stack.Navigator>
    
    )
}
export default FeedbackStack