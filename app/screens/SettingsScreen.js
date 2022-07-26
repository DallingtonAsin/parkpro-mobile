import React, {useState} from 'react';
import { TouchableOpacity, View, FlatList, Linking, StyleSheet} from 'react-native';
import Toast from 'react-native-simple-toast';
import Dialog, { DialogFooter, DialogButton, DialogContent } from 'react-native-popup-dialog';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Rate, { AndroidMarket } from 'react-native-rate';
import {  AirbnbRating } from 'react-native-elements';
import { getAppVersionName } from '../components/sharedHelper/AppUtils';
import FocusAwareStatusBar  from '../components/common/FocusAwareStatusBar';
import { AuthContext } from '../context/context';
import design from '../../assets/css/styles';
import {useTheme, TouchableRipple, Drawer, Switch, Text } from 'react-native-paper';

const version  = getAppVersionName();

const set2 = [
  {
    key: 5,
    item: "Version",
    link: "Version",
    data: "",
    icon: "info-circle",
  },
  
  {
    key: 8,
    item: "Copyrights",
    link: "Copyrights",
    data: "",
    icon: "copyright",
    
  },
  {
    key: 6,
    item: "Legal Policies",
    link: "LegalPolicies",
    data: "",
    icon: "gavel",
    
  },
  
  
  
];

const set3 = [
  {
    key: 10,
    item: "Rate Us",
    link: "RateUs",
    data: "",
    icon: "star",
    
  },

  
];


const Settings = ({ navigation }) => {
  
  const [isVisible, setIsVisible] = useState(false);   
  
  const { toggleTheme, signOut } = React.useContext(AuthContext);
  const paperTheme = useTheme(); 
  
  const { colors } = useTheme();
  const styles = makeStyles(colors);
  const iconSize = 25;

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

  const logout = async() => {
    await signOut();
  }
  
  const Navigate = (link) =>{
    switch(link){
      case "Version":
      Toast.show(`version ${version}`);
      break;
      case "ClearCache": 
      showAlert();
      break;
      case "Languages":
      navigation.navigate(link);
      break;
      case "Notifications":
      navigation.navigate(link);
      break;
      case "Suggestions":
      navigation.navigate(link);
      break;
      case "ChangePin":
      navigation.navigate(link);
      break;
      case "RateUs":
      Linking.openURL(`https://play.google.com/store/apps/details?id=com.twitter.android&hl=en&gl=US`);
      break;
      case "Copyrights":
      Linking.openURL(`https://parkproug.com`);
      break;
      case "LegalPolicies":
      Linking.openURL(`https://parkproug.com`);
      break;Suggestions
      default:
      Toast.show("coming up soon");
    }
  };
  
  
  return(
    <View style={styles.container}>
    <FocusAwareStatusBar barStyle="light-content" backgroundColor={colors.primary} />
    
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
    <DialogContent style={{ margin:0 }}>
    <Text style={{ textAlign: 'center', fontSize:16, margin:5 }}>Please take a moment to rate us</Text>
    <AirbnbRating
    showRating={false}
    size={30}
    readonly
    count={5}
    defaultRating={5}
    />
    </DialogContent>
    </Dialog>
    

    <View style={styles.body}>
    
    <Text style={styles.title}>Information</Text>
    <View style={{ borderBottomColor: '#f1f1f1', borderBottomWidth: 1, }}/>
    
    <FlatList 
    data={set2}
    renderItem={({ item }) =>
    <TouchableOpacity key={item.key} onPress={() =>{Navigate(item.link)}}
    style={styles.preferencesOpacity}>
      <FontAwesome name={item.icon} size={iconSize} color={design.colors.gray} />
      <Text style={styles.preferenceText}> {item.item} </Text>
    {
      (item.data)
      ? <Text style={{ opacity:0.4, bottom:10, color: colors.dark }}>{item.data}</Text> 
      : <Text></Text>
    }
    </TouchableOpacity>}/>
    
    <Drawer.Section title={
      <Text style={styles.title}>Preferences</Text>
    }>
    
    <TouchableOpacity onPress={() => { navigation.navigate("ChangePin") }} style={styles.preferencesOpacity}>
       <FontAwesome name={'key'} size={iconSize} color={design.colors.gray} />
        <Text style={styles.preferenceText}> Change Wallet PIN</Text>
    </TouchableOpacity>

    <TouchableOpacity onPress={() =>{ navigation.navigate("ChangePhoneNumber") }} style={styles.preferencesOpacity}>
        <FontAwesome name={'phone'} size={iconSize} color={design.colors.gray}/>
        <Text style={styles.preferenceText}>  Change Phone Number</Text>
    </TouchableOpacity>
    
    
    {/* <TouchableRipple onPress={() => {toggleTheme()}}>
       <View style={styles.preference}>
         <View style={{ flexDirection: 'row' }}>
           <FontAwesome name={'refresh'} size={iconSize} color={design.colors.gray} />
           <Text style={styles.preferenceText}> Change Theme</Text>
         </View>

         <View pointerEvents="none">
           <Switch value={paperTheme.dark}/>
         </View>
      </View>
    </TouchableRipple> */}


    </Drawer.Section>
    
    <Text style={styles.title}>More</Text>
    
    <FlatList
    data={set3}
    renderItem={({ item }) =>
    <TouchableOpacity key={item.key} onPress={() =>{Navigate(item.link)}}
    style={styles.preferencesOpacity}>
     <FontAwesome name={item.icon} size={iconSize}  color={design.colors.gray}/>
     <Text style={styles.preferenceText}>
     {item.item}</Text>
    {
      (item.data)
      ? <Text style={{ opacity:0.4, bottom:10, color: colors.dark  }}>{item.data}</Text> 
      : null
    }
    </TouchableOpacity>}/>
    
    <View style={{ borderBottomColor: '#f1f1f1', borderBottomWidth: 1, }}/>
    <TouchableOpacity onPress={() => logout() } style={styles.preferencesOpacity}>
        <FontAwesome name={'power-off'} size={iconSize} color={design.colors.gray}/>
        <Text style={styles.preferenceText}>  Sign Out</Text>
    </TouchableOpacity>
    

    </View>
    
    </View>
    );
    
    
  }
  export default Settings;
  
  const makeStyles = (colors) => StyleSheet.create({
    container:{
      flex:1,
      backgroundColor: colors.body,
    },
    body:{
      top: 20,
    },
    title:{
      left:15,
      fontWeight:'bold',
      fontSize:16,
      color: colors.primary
    },
    
    preference: {
      flexDirection: 'row',
      paddingVertical: 12,
      paddingHorizontal: 16,
      justifyContent: 'space-between'
    },

    preferencesOpacity: { 
      padding:16,
      flexDirection:'row'
    },

    preferenceText:{ 
      fontSize:17,
      color: colors.dark,
      left:15
    },

  })
  
