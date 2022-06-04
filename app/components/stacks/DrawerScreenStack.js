import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import CustomDrawer from '../drawers/DrawerContent';
import { Dimensions } from 'react-native';

import AboutStack from  './AboutStack';
import ParkingAreasStack from  './ParkingAreasStack';
import ProfileStack from  './ProfileStack';
import ParkingFeesStack from  './ParkingFeesStack';

import TransactionsHistoryStack from  './TransactionsHistoryStack';
import TopupStack from  './TopupStack';
import HelpStack from  './ContactUsStack';
import EditProfileStack from  './EditProfileStack';
import NotificationStack from  './NotificationStack';
import OrdersStack from  './OrdersStack';
import OrderDetailsStack from  './OrderDetailsStack';

import SettingsStack from  './SettingsStack';
import ChangePasswordStack from  './ChangePasswordStack';
import FeedbackStack from  './FeedbackStack';
import AppTabStack from  './AppTabStack';
import WeatherStack from  './WeatherStack';
import MapScreen from '../../screens/MapScreen';



const Drawer = createDrawerNavigator();
const DrawerScreenStack = () => {
    return(
        <Drawer.Navigator 
        drawerStyle={{ width:Dimensions.get('window').width - 100, }}
        drawerContent= {(props) => <CustomDrawer {...props} />
        }>
        <Drawer.Screen name="Home" component={AppTabStack} />
        <Drawer.Screen name="Profile" component={ProfileStack}/>
        <Drawer.Screen name="EditProfile" component={EditProfileStack}/>
        <Drawer.Screen name="PaymentHistory" component={TransactionsHistoryStack}/>
        <Drawer.Screen name="ParkingAreas" component={ParkingAreasStack}/>
        <Drawer.Screen name="ParkingFees" component={ParkingFeesStack}/>
        <Drawer.Screen name="Weather" component={WeatherStack}/>

        
        <Drawer.Screen name="Map" options ={{ drawerLabel: 'Map' }} component={MapScreen}/>
        <Drawer.Screen name="Help" options ={{ drawerLabel:'Help' }} component={HelpStack}/>
        <Drawer.Screen name="Notifications" options ={{ drawerLabel: 'Notification' }} component={NotificationStack}/>
        <Drawer.Screen name="Settings" options ={{ drawerLabel: 'Settings' }} component={SettingsStack}/>
        <Drawer.Screen name="ChangePassword" component={ChangePasswordStack}/>
        <Drawer.Screen name="Orders" component={OrdersStack}/>
        <Drawer.Screen name="OrderDetails" component={OrderDetailsStack}/>

        <Drawer.Screen name="Feedback" component={FeedbackStack}/>


        <Drawer.Screen name="TopUp" component={TopupStack}/>
        <Drawer.Screen name="About" component={AboutStack}/>
        </Drawer.Navigator>
    )
}
export default DrawerScreenStack