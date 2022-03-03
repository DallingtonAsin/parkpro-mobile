import React, {useState, useEffect, useContext} from 'react';
import {View, Text,ScrollView, TouchableOpacity, Linking} from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome5';
import styles from '../../assets/css/styles';
import { Avatar } from 'react-native-paper';
import FontAwesome from 'react-native-vector-icons/FontAwesome5';
import { AuthContext } from '../context/context';
import {APP_NAME} from '@env';
import ProfileContext from '../context/index';
import Rate, { AndroidMarket } from 'react-native-rate';
import {  AirbnbRating } from 'react-native-elements';
import Dialog, { DialogFooter, DialogButton, DialogContent } from 'react-native-popup-dialog';
import Share from "react-native-share";


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
  const {profile, setProfile} = useContext(ProfileContext);
  const [isVisible, setIsVisible] = useState(false);
  
  const items = [
    {
      navOptionThumb: 'home',
      navOptionName: 'Home',
      screenToNavigate:'Home',
      
    },
    
    {
      navOptionThumb: 'user-circle',
      navOptionName: 'My Profile',
      screenToNavigate:'Profile',
      
    },
    
    {
      navOptionThumb: 'parking',
      navOptionName: 'Nearby parkings',
      screenToNavigate:'Map',
    },
    
    {
      navOptionThumb: 'cloud-rain',
      navOptionName: 'Weather info',
      screenToNavigate:'Weather',
    },
    
    
  ];
  
  const logout = async() => {
    await signOut();
  }
  
  
  const LoadPage = (page) => {
    props.navigation.navigate(page);
  };
  
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
        console.error(`Example page Rate.rate() error: ${errorMessage}`)
      }
    });
  }
  
  
  return (
    
    <ScrollView>
    
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
    
    <View style={styles.sideMenuContainer}>
    
    {
      profile.image ?
      <Avatar.Image size={120} style={{backgroundColor: styles.colors.white}} 
      source={{uri: profile.image }} />
      : <Avatar.Image size={120} style={{backgroundColor: styles.colors.white}} 
      source={require('../../assets/default-user.png')} />
    }
    
    
    <Text style={{ marginTop:5, color:'#000', fontSize:16  }}>{ profile.first_name }</Text>
    <Text style={{ marginBottom:15, color:'#000', fontSize:16 }}>{ profile.phone_number}</Text>
    
    <View style={styles.divider}></View>
    <View style={{ width: '100%' }}>
    {items.map((item, key) => {
      return(
        <TouchableOpacity key={key} style={[{
          backgroundColor: global.currentScreenIndex === key ? '#F7F5F5' : '#fff'
        }, styles.sideMenuItems]} onPress={ () => {
          global.currentScreenIndex = key;
          props.navigation.navigate(item.screenToNavigate);
        }}>
        <View>
        <FontAwesome name={item.navOptionThumb} style={styles.navOptionThumb}/>
        </View>
        <Text
        style={[{ color: global.currentScreenIndex === key ? '#FFB020' : '#000000' }, styles.sideMenuText]}
        >
        {item.navOptionName}
        </Text>
        </TouchableOpacity>
        )
      })}
      
      </View>
      
      
      
      <View style={styles.divider}></View>
      <View  style={{ width: '100%' }}>
      
      <TouchableOpacity style={styles.sideMenuItems}
      onPress={() => share()}
      >
      <Icon name="share-alt" style={styles.navOptionThumb}/>
      <Text style={styles.sideMenuText}>Share</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.sideMenuItems} 
      onPress={() => LoadPage("About")}>
      <FontAwesome name="info-circle" style={styles.navOptionThumb}/>
      <Text style={styles.sideMenuText}>About Us</Text>
      </TouchableOpacity>
      
      
      <TouchableOpacity style={styles.sideMenuItems}
      onPress={() => navigateToTerms()}>
      <FontAwesome name="file-contract" style={styles.navOptionThumb}/>
      <Text style={styles.sideMenuText} 
      >Terms & Conditions</Text>
      </TouchableOpacity>
      
      
      <View style={styles.divider}></View>
      
      <TouchableOpacity style={styles.sideMenuItems} onPress={ () => {
        LoadPage('Settings'); }}>
        <Icon name="cog" style={styles.navOptionThumb}/>
        <Text style={styles.sideMenuText}>Settings</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.sideMenuItems}
        onPress={logout}>
        <Icon name="power-off" style={styles.navOptionThumb}/>
        <Text style={styles.sideMenuText} 
        >Log out</Text>
        </TouchableOpacity>
        
        
        </View>
        </View>
        </ScrollView>
        
        )
        
      }
      export default CustomDrawer;
      
      
      
      
