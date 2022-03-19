import React, {useState} from 'react';
import { Text,TouchableOpacity, View, FlatList, Linking, StyleSheet} from 'react-native';
import styles from '../../assets/css/styles';
import Toast from 'react-native-simple-toast';
import AwesomeAlert from 'react-native-awesome-alerts';
import { Cache } from 'react-native-cache';
import Dialog, { DialogFooter, DialogButton, DialogContent } from 'react-native-popup-dialog';
import Rate, { AndroidMarket } from 'react-native-rate';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {  AirbnbRating } from 'react-native-elements';
import {getAppVersionName} from '../components/SharedCommons';

const version  = getAppVersionName();

const cache = new Cache({
  namespace: "myapp",
  policy: {
    maxEntries: 50000
  },
  backend: AsyncStorage
});



const set2 = [
  {
    "key": 5,
    "item": "Version",
    "link": "Version",
    "data": version,
  },

  {
    "key": 8,
    "item": "Copyrights",
    "link": "Copyrights",
    "data": "",
  },
  {
    "key": 6,
    "item": "Legal Policies",
    "link": "LegalPolicies",
    "data": "",
  },
  

  
];

const set3 = [
  {
    "key": 10,
    "item": "Rate the App",
    "link": "RateUs",
    "data": "",
  },
  {
    "key": 11,
    "item": "Clear app cache",
    "link": "ClearCache",
    "data": "",
  },
];

const initialState = {
  showAlert:false,
  cacheSize:"",
  IsDialogVisible:false,
  unit:"",
};

 const Settings = ({ navigation }) => {
    
    const [state, setState] = useState(initialState); 
    const [isVisible, setIsVisible] = useState(false);   

    
    const handlerClearAppCache = () => {
      (async () => {
        cache.clearAll();
      })();
      hideAlert();
      Toast.show('Successfully cleared app cache');
    };
    
    
    const showAlert = () =>{
      setState({ 
        ...state,
        showAlert:true,
      });
    };
    
    const hideAlert = () =>{
      setState({ 
        ...state,
        showAlert:false,
      });
    };

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
        case "RateUs":
          setIsVisible(true);
          break;
        case "Copyrights":
          Linking.openURL(`https://parkproug.com`);
          break;
        case "LegalPolicies":
          Linking.openURL(`https://parkproug.com`);
          break;
        default:
        Toast.show("coming up soon");
      }
    };
    
    
      return(
        <View style={css.container}>

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
</View>
        
        <AwesomeAlert
        show={state.showAlert}
        showProgress={false}
        title="Clear app cache"
        progressSize={50}
        message="Are you sure you want to clear cache?"
        closeOnTouchOutside={true}
        useNativeDriver={true}
        closeOnHardwareBackPress={false}
        showCancelButton={true}
        showConfirmButton={true}
        cancelText="No"
        confirmText="Yes"
        cancelButtonColor="#696969"
        confirmButtonColor="#DD6B55"
        onCancelPressed={() => {
          hideAlert();
        }}
        onConfirmPressed={() => {
          handlerClearAppCache();
        }}
        />
        
     
        <View style={css.body}>

      
        
        <Text style={css.title}>Information</Text>
        <View style={{ borderBottomColor: '#f1f1f1', borderBottomWidth: 1, }}/>
        
        <FlatList 
        data={set2}
        renderItem={({ item }) =>
        <TouchableOpacity key={item.key} onPress={() =>{Navigate(item.link)}}
        style={{ padding:15, flexDirection:'row', justifyContent:'space-between'}}>
        <Text style={{ fontSize:17 }}>{item.item}</Text>
        {
          (item.data)
          ? <Text style={{ opacity:0.4, bottom:10 }}>{item.data}</Text> 
          : <Text></Text>
        }
        </TouchableOpacity>}/>
        
        
        <Text style={css.title}>More</Text>
        <View style={{ borderBottomColor: '#e2e2e2', borderBottomWidth: 1, }}/>

        <FlatList style= {{ backgroundColor: styles.colors.white }}
        data={set3}
        renderItem={({ item }) =>
        <TouchableOpacity key={item.key} onPress={() =>{Navigate(item.link)}}
        style={{ padding:15, flexDirection:'row', justifyContent:'space-between'}}>
        <Text style={{ fontSize:17 }}>{item.item}</Text>
        {
          (item.data)
          ? <Text style={{ opacity:0.4, bottom:10 }}>{item.data}</Text> 
          : <Text></Text>
        }
        </TouchableOpacity>}/>
        
        </View>
        
        </View>
        );
        
        
      }
export default Settings;

const css = StyleSheet.create({
  container:{
    flex:1,
    backgroundColor:'#fff',
  },
  body:{
    top:0,
  },
  title:{
    left:15,
    color:styles.colors.orange, 
    fontWeight:'bold',
    fontSize:16
  },
})
    
