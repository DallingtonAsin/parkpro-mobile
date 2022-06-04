
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import SuggestionsScreen from '../../screens/FeedbackScreen';
import StackOption from '../common/StackOption';

const Stack = createStackNavigator();


 const SuggestionsStack = ({ navigation }) => {
                            
    return(
      <Stack.Navigator initialRouteName="Suggestions">
      <Stack.Screen name="Suggestions" component={SuggestionsScreen}
       options = {() => (StackOption(navigation, 'Feedback'))
      }>
    </Stack.Screen>
    </Stack.Navigator>
    
    )
}
export default SuggestionsStack