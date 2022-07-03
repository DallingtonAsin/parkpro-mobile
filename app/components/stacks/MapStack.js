import React from 'react';
import { createStackNavigator, HeaderBackButton} from '@react-navigation/stack';
import MapScreen from '../../screens/MapScreen';
import styles from '../../../assets/css/styles';

const Stack = createStackNavigator();

const MapStack = ({ navigation }) => {
                              
    return(
      <Stack.Navigator initialRouteName="Map">
      <Stack.Screen name="Map" component={MapScreen}
         options={{headerShown: false}}/>
      </Stack.Navigator>
    )
}
export default MapStack