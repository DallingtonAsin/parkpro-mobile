import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import SplashScreen from '../../screens/SplashScreen';

import SigninScreen from '../../screens/SigninScreen';
import SignupScreen from '../../screens/SignupScreen';
import OtpInputScreen from '../../screens/OtpInputScreen';


const Stack = createStackNavigator();

const AppRootStack = () => {
    return(
        <Stack.Navigator screenOptions={{headerShown: false}}>
        <Stack.Screen name="SplashScreen" component={SplashScreen} />
        <Stack.Screen name="Signin" component={SigninScreen} />
        <Stack.Screen name="Otp" component={OtpInputScreen} />
        <Stack.Screen name="Signup" component={SignupScreen} />
        </Stack.Navigator> 
    )
}

export default AppRootStack