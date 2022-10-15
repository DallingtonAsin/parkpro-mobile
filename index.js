/**
* @format
*/

import {AppRegistry} from 'react-native';
import React from 'react';
import App from './App';
import {name as appName} from './app.json';
import { appConstants } from './app/constants';
import PushNotification, { Importance } from "react-native-push-notification";

const channel_id = appConstants.NOTIFICATION_CHANNEL;

PushNotification.configure({
    
    onRegister: function (token) {
        console.log("TOKEN:", token);
    },
    
    onNotification: function (notification) {
        Toast.show(`Received a push notification for payment`, Toast.LONG)
        console.log('LOCAL NOTIFICATION ==>', notification);
    },
    
    onAction: function (notification) {
        
        console.log("ACTION:", notification.action);
        console.log("NOTIFICATION:", notification);
        
        // process the action
    },
    requestPermissions: Platform.OS === 'ios',
});

PushNotification.createChannel({
    channelId: channel_id, 
    channelName: "app-notifications", 
    importance: Importance.HIGH,
},
(created) => {
    // console.log(`Channel created?`, created);
}
);

const MyApp = () => (
    <App/>
    )
    
    AppRegistry.registerComponent(appName, () => MyApp);
    
    
