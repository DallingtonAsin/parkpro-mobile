import React, {useState, useContext} from 'react';
import {View, TouchableOpacity, Linking} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import styles from '../../../assets/css/styles';
import { AuthContext } from '../../context/context';
import {APP_NAME} from '@env';
import ProfileContext from '../../context/index';
import Rate, { AndroidMarket } from 'react-native-rate';
import {  AirbnbRating } from 'react-native-elements';
import Dialog, { DialogFooter, DialogButton, DialogContent } from 'react-native-popup-dialog';
import Share from "react-native-share";
import {
  useTheme,
  Avatar,
  Drawer,
  Text,
  TouchableRipple,
  Switch
} from 'react-native-paper';
import {
  DrawerContentScrollView,
  DrawerItem
} from '@react-navigation/drawer';
import { color } from 'react-native-reanimated';

const url = "https://parkproug.com/";
const title = "Check this cool app "+APP_NAME+"";
const message = "Hey, I found this cool app "+APP_NAME+" so please check it out.";

const options = {
  title,
  url,
  message,
};


const CustomDrawer = (props) => {
  
  const { signOut } = React.useContext(AuthContext);
  const { profile } = useContext(ProfileContext);
  const [isVisible, setIsVisible] = useState(false);
  
  const {  toggleTheme } = React.useContext(AuthContext);
  const paperTheme = useTheme(); 
  const { colors } = useTheme();

  
  const items = [
    {
      icon: 'home',
      text: 'Home',
      screenToNavigate:'Home',
      
    },
    
    {
      icon: 'user-circle',
      text: 'My Profile',
      screenToNavigate:'Profile',
      
    },
    
    {
      icon: 'parking',
      text: 'Nearby parkings',
      screenToNavigate:'Map',
    },
    
    {
      icon: 'cloud-rain',
      text: 'Weather info',
      screenToNavigate:'Weather',
    },
    
    
  ];
  
  const logout = async() => {
    await signOut();
  }
  
  const share = async (customOptions = options) => {
    try {
      await Share.open(customOptions);
    } catch (err) {
      console.log(err);
    }
  };
  
  const navigateToTerms = () => {
    Linking.openURL("https://www.parkproug.com");
  }
  
  const RateUs = () => {
    const options = {
      AppleAppID:"2193813192",
      GooglePackageName:"com.mywebsite.myapp",
      AmazonPackageName:"com.mywebsite.myapp",
      OtherAndroidURL:"http://www.randomappstore.com/app/47172391",
      preferredAndroidMarket: AndroidMarket.Google,
      preferInApp:false,
      openAppStoreIfInAppFails:true,
      fallbackPlatformURL:"http://www.mywebsite.com/myapp.html",
    }
    Rate.rate(options, (success, errorMessage)=>{
      if (success) {
      }
      if (errorMessage) {
        console.error(`Unable to rate because of error: ${errorMessage}`)
      }
    });
  }
  
  
  return (
    
    <View style={{flex:1, backgroundColor: colors.drawerBackground }}>
    <DrawerContentScrollView {...props}>
    <View style={styles.drawerContent}>
    
    <View style={styles.userInfoSection}>
    {
      profile.image ?
      <Avatar.Image size={120} style={{backgroundColor: styles.colors.white}} 
      source={{uri: profile.image }} />
      : <Avatar.Image size={120} style={{backgroundColor: styles.colors.white}} 
      source={require('../../../assets/default-user.png')} />
    }
    <Text style={{ marginTop:5, fontSize:18,
                   fontWeight: 'bold',
                   color: colors.drawerText,
                   opacity:0.8 }}>
                     { profile.first_name } { profile.last_name }
                </Text>
    <Text style={{ marginBottom:15, fontSize:16, color: colors.drawerText, opacity:0.7 }}>{ `${profile.country_code}${profile.phone_number}`}</Text>
    </View>
    
    
    <View style={styles.sideMenuContainer}>
    
    
    <View style={styles.divider}></View>
    
    <View style={{ width: '100%' }}>
    {items.map((item, key) => {
      return(
        <TouchableOpacity key={key} style={[{
          // backgroundColor: global.currentScreenIndex === key ? '#F7F5F5' : '#fff'
        }, styles.drawerItem]} onPress={ () => {
          global.currentScreenIndex = key;
          props.navigation.navigate(item.screenToNavigate);
        }}>
        <View>
        <Icon name={item.icon} style={styles.drawerIcon} color={colors.drawerText}/>
        </View>
        <Text style={[styles.drawerText, {color: colors.drawerText}]}
        // -style={[{ color: global.currentScreenIndex === key ? '#FFB020' : '#000000' }, styles.drawerText]}
        >
        {item.text}
        </Text>
        </TouchableOpacity>
        )
      })}
      
      </View>
      
      
      
      <View style={styles.divider}></View>
      <View  style={{ width: '100%' }}>
      
      <TouchableOpacity style={styles.drawerItem}
      onPress={() => share()}
      >
      <Icon name="share-alt" style={styles.drawerIcon} color={colors.drawerText}/>
      <Text style={[styles.drawerText, {color: colors.drawerText}]}>Share</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.drawerItem} 
      onPress={() => props.navigation.navigate("About")}>
      <Icon name="info-circle" style={styles.drawerIcon} color={colors.drawerText}/>
      <Text style={[styles.drawerText, {color: colors.drawerText}]}>About us</Text>
      </TouchableOpacity>
      
      
      {/* <TouchableOpacity style={styles.drawerItem}
      onPress={() => navigateToTerms()}>
      <Icon name="file-contract" style={styles.drawerIcon}/>
      <Text style={[styles.drawerText, {color: colors.text}]} 
      >Terms & Conditions</Text>
    </TouchableOpacity> */}
    
    <TouchableOpacity style={styles.drawerItem} onPress={ () => {
      props.navigation.navigate('Settings'); }}>
      <FontAwesome name="cog" style={styles.drawerIcon} color={colors.drawerText}/>
      <Text style={[styles.drawerText, {color: colors.drawerText}]}>Settings</Text>
      </TouchableOpacity>

 
      <View style={styles.divider}></View>
      
      <Drawer.Section title="Preferences"  >
      <View style={{flexDirection: 'row'}}>
      <TouchableRipple onPress={() => {toggleTheme()}}>
      <View style={styles.preference}>
      <Text style={[styles.drawerText, {color: colors.drawerText}]}> Change Theme </Text>
      <View pointerEvents="none">
      <Switch value={paperTheme.dark}/>
      </View>
      </View>
      </TouchableRipple>
      </View>
      </Drawer.Section>
      </View>
      </View>
      
      
      <View style={styles.container}>
      <Dialog
      visible={isVisible}
      width={0.8}
      height={0.2}
      footer={
        <DialogFooter>
        <DialogButton
        text="Later"
        onPress={() => {setIsVisible(false)}}
        />
        <DialogButton
        text="OK"
        onPress={() => RateUs()}
        />
        </DialogFooter>
      }
      >
      <DialogContent>
      <Text style={{ textAlign: 'center', fontSize:16}}>Please take a moment to rate us</Text>
      <AirbnbRating
      showRating={false}
      size={30}
      readonly
      count={5}
      defaultRating={5}
      />
      </DialogContent>
      </Dialog>
      </View>
      
      </View>
      </DrawerContentScrollView>
      
    

      <TouchableOpacity
        style={[
          styles.drawerItem, 
          {
          position: 'absolute',
          right: 0,
          left: 0,
          bottom: 50,
          // padding: 20,
        }]}
        onPress={() => logout() }
      >
         <Icon name="power-off" style={styles.drawerIcon} color={colors.drawerText}/>
        <Text style={[styles.drawerText, {color: colors.drawerText}]}>Log out</Text>
      </TouchableOpacity>
      
      
      </View>
      )
      
    }
    export default CustomDrawer;
    
    
    
    
