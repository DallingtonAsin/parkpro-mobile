import React from 'react';
import { createStackNavigator} from '@react-navigation/stack'
import HomeScreen from '../../screens/HomeScreen'
import { useTheme, DrawerActions } from '@react-navigation/native';
import { TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';


const Stack = createStackNavigator();

const HomeStack = ({ navigation }) => {
  
  const { colors } = useTheme();
  
  return(
    <Stack.Navigator initialRouteName="Home">
    <Stack.Screen name="Home" component={HomeScreen}
    options={{
      headerStyle: {
        backgroundColor: colors.primary,
      },
      headerTintColor: colors.text,
      headerRight: () => (
        <TouchableOpacity style={{ paddingVertical: 12, paddingHorizontal:16 }}  onPress={() => navigation.dispatch(DrawerActions.openDrawer())}>
        <Icon name="bars" size={28} color={colors.text} />
        </TouchableOpacity>
        ),
      }}
      >
      </Stack.Screen>
      </Stack.Navigator>
      )
      
    }
    export default HomeStack;