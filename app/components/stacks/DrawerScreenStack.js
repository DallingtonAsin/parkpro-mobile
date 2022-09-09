import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import CustomDrawer from '../drawers/DrawerContent';
import { Dimensions } from 'react-native';

import AboutStack from  './AboutStack';
import ParkingAreasStack from  './ParkingAreasStack';
import ProfileStack from  './ProfileStack';
import ParkingInfoStack from  './ParkingInfoStack';

import TransactionsHistoryStack from  './TransactionsHistoryStack';
import TopupStack from  './TopupStack';
import HelpStack from  './ContactUsStack';
import EditProfileStack from  './EditProfileStack';
import NotificationStack from  './NotificationStack';
import OrdersStack from  './OrdersStack';
import OrderDetailsStack from  './OrderDetailsStack';

import SettingsStack from  './SettingsStack';
import ChangePinStack from  './ChangePinStack';
import FeedbackStack from  './FeedbackStack';
import AppTabStack from  './AppTabStack';
import WeatherStack from  './WeatherStack';
import CloseByParkingStack from './CloseByParkingStack';
import ChangePhoneNumberStack from './ChangePhoneNumberStack';
import MapScreen from '../../screens/MapScreen';


const Drawer = createDrawerNavigator();

const DrawerScreenStack = () => {
    return(
        <Drawer.Navigator 
            drawerStyle={{ width:Dimensions.get('window').width - 100, }}
            drawerContent= {(props) => <CustomDrawer {...props} />}
         >

        <Drawer.Screen name="Home" component={AppTabStack}/>
        <Drawer.Screen name="Profile" component={ProfileStack}/>
        <Drawer.Screen name="EditProfile" component={EditProfileStack}/>
        <Drawer.Screen name="PaymentHistory" component={TransactionsHistoryStack}/>
        <Drawer.Screen name="ParkingAreas" component={ParkingAreasStack}/>
        <Drawer.Screen name="NearByParkings" component={CloseByParkingStack}/>
        <Drawer.Screen name="ParkingInfo" component={ParkingInfoStack}/>

        <Drawer.Screen name="Weather" component={WeatherStack}/>
        <Drawer.Screen name="Map" component={MapScreen} options ={{ drawerLabel: 'Map' }}/>
        <Drawer.Screen name="Help" component={HelpStack} options={{ drawerLabel:'Help' }}/>
        <Drawer.Screen name="Notifications" component={NotificationStack} options ={{ drawerLabel: 'Notification' }}/>
        <Drawer.Screen name="Settings" component={SettingsStack} options ={{ drawerLabel: 'Settings' }}/>
        <Drawer.Screen name="ChangePin" component={ChangePinStack}/>

        <Drawer.Screen name="Orders" component={OrdersStack}/>
        <Drawer.Screen name="OrderDetails" component={OrderDetailsStack}/>
        <Drawer.Screen name="Feedback" component={FeedbackStack}/>
        <Drawer.Screen name="TopUp" component={TopupStack}/>
        <Drawer.Screen name="About" component={AboutStack}/>
        <Drawer.Screen name="ChangePhoneNumber" component={ChangePhoneNumberStack}/>


        </Drawer.Navigator>
    )
}
export default DrawerScreenStack