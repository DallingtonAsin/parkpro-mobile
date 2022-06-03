import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import EditProfileScreen from '../../screens/EditProfileScreen';
import StackOption from '../common/StackOption';

const Stack = createStackNavigator();


  const EditProfileStack = ({ navigation }) => {
                                                              
    return(
      <Stack.Navigator>
      <Stack.Screen name="EditProfileScreen" component={EditProfileScreen}
     options = {() => (StackOption(navigation, 'Edit Profile'))
    }>
    </Stack.Screen>
    </Stack.Navigator>
    
    )
}
export default EditProfileStack