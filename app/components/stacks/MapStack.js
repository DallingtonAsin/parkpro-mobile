import React from 'react';
import { createStackNavigator, HeaderBackButton} from '@react-navigation/stack';
import MapDirectionsScreen from '../../screens/MapDirectionsScreen';
import styles from '../../../assets/css/styles';

const Stack = createStackNavigator();

const MapStack = ({ navigation }) => {
                              
    return(
      <Stack.Navigator initialRouteName="Map">
      <Stack.Screen name="Map" component={MapDirectionsScreen}
         options={{headerShown: false}}/>
      </Stack.Navigator>
    )
}
export default MapStack