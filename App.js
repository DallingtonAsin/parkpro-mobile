import React, {useEffect, useState, useMemo} from 'react';
import { Image, RefreshControl,  Text, StyleSheet, SafeAreaView, ScrollView, Platform, NativeModules} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { Provider as PaperProvider } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthContext } from './app/context/context';
import AppRootStack from  './app/components/stacks/AppRootStack';
import DrawerScreenStack from './app/components/stacks/DrawerScreenStack';
import loginReducer from './app/redux/reducers/loginReducer';
import NetInfo from "@react-native-community/netinfo";
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { ProfileProvider } from './app/context/index';
import SplashScreen from 'react-native-splash-screen'
import {  icons} from './constants';
import GlobalFont from 'react-native-global-font';
const Services = require("./app/services");
import AppLoaderAnimation from './app/components/loaders/AppLoaderAnimation';
import { customDefaultTheme,  customDarkTheme} from './assets/themes';
import { ApiKeys } from './app/network/ApiKeys';
import messaging from '@react-native-firebase/messaging';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';


const initialLoginState = {
  isLoading: true,
  userName: null,
  userToken: null,
  data: null,
}

const wait = (timeout) => {
  return new Promise(resolve => setTimeout(resolve, timeout));
}

const requestUserPermission = async() => {
  const authStatus = await messaging().requestPermission();
  const enabled =
  authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
  authStatus === messaging.AuthorizationStatus.PROVISIONAL;
  
  if (enabled) {
    console.log('Authorization status:', authStatus);
  }
}

async function saveTokenToDatabase(token) {
  // Assume user is already signed in
  const userId = auth().currentUser.uid;
  // await AsyncStorage.setItem("userProfile");
  
  if(userId){
    // Add the token to the users datastore
    await firestore()
    .collection('users')
    .doc(userId)
    .update({
      tokens: firestore.FieldValue.arrayUnion(token),
    });
  }
}

const App = ()  => {
  
  
  const [profile, setProfile] = useState(null);
  const providerValue = useMemo(() => ({profile, setProfile}), [profile, setProfile]); 
  const [loginState, dispatch] = React.useReducer(loginReducer, initialLoginState);
  const [isConnected, setIsConnected] = React.useState(false);
  const [isDarkTheme, setIsDarkTheme] = React.useState(false);
  
  const theme = isDarkTheme ? customDarkTheme : customDefaultTheme;
  
  
  const OfflineScreen = () => {
    const [refreshing, setRefreshing] = React.useState(false);
    const onRefresh = React.useCallback(() => {
      setRefreshing(true);
      wait(2000).then(() =>{
        NetInfo.fetch().then(state => {
          setIsConnected(state.isConnected);
          setRefreshing(false);
        });
        
      });
    });
    
    return (
      <SafeAreaView  style={styles.container}>
      <ScrollView
      contentContainerStyle={styles.scrollView}
      refreshControl={
        <RefreshControl
        refreshing={refreshing}
        onRefresh={onRefresh}
        />
      }
      >
      
      <Image
      source={icons.noInternet}
      resizeMode="contain"
      style={{
        tintColor: '#808080',
        width: 120,
        height: 120,
      }}
      />
      
      <Text style={[styles.title, {
        color: '#fd5e53',
      }]}>No internet connection...</Text>
      <Text style={{fontSize: 16, color: '#808080', padding:15}}>
      Ops...it seems you are not connected on internet. Check your internet connection
      and try again.
      </Text>
      <FontAwesome 
      name={"refresh"}
      color={'#C0C0C0'}
      size={50}
      style={styles.refresh}
      onPress={onRefresh}
      /><Text style={{color: '#808080', fontSize: 14}}>Pull down to refresh</Text>
      </ScrollView>
      
      </SafeAreaView >
      );
    };
    
    const getLocale = () => {
      const deviceLanguage =
      Platform.OS === 'ios'
      ? NativeModules.SettingsManager.settings.AppleLocale ||
      NativeModules.SettingsManager.settings.AppleLanguages[0] //iOS 13
      : NativeModules.I18nManager.localeIdentifier;
      return deviceLanguage;
    }
    
    const deviceInformation = () => {
      var language = getLocale();

      messaging()
      .getToken()
      .then(token => {
        if (token) {
          onChangeToken(token, language)
        } else {
          console.log("User does not have device token");
        } 
      });

      messaging().onTokenRefresh(token => {
        if (token) {
          onChangeToken(token, language)
        } else {
          console.log("User does not have device token");
        } 
      });
      
    }
    
    const onChangeToken = (token, language) => {
      
      var data = {};
      data[`${ApiKeys.DEVICE_TOKEN}`] = token;
      data[`${ApiKeys.DEVICE_TYPE}`] = Platform.OS;
      data[`${ApiKeys.DEVICE_LANGUAGE}`] = language;
      loadDeviceInfo(data).done();

    }
    
    const loadDeviceInfo = async (deviceData) => {
      var value = JSON.stringify(deviceData);
      try {
        await AsyncStorage.setItem(ApiKeys.DEVICE_INFO, value);
      } catch (error) {
        console.log(error);
      }
    }; 
    
    const authContext = React.useMemo(() => ({
      
      
      sendSmsVerification: async(data) => {
        try{
          const result = await Services.CustomerService.sendOTP(data);
          return result;
        }catch(e){
          return {"message": e.message, "statusCode": 0};
        }
      },
      
      verifyOTP: async(data) => {
        try{
          const result = await Services.CustomerService.verifyOneTimePassword(data);
          return result;
        }catch(e){
          return {"message": e.message, "statusCode": 0};
        }
      },
      
      
      goToHomeScreen: async(user) => {
        let userToken = null;
        try{
          userToken = user.access_token;
          setProfile(user);
          await AsyncStorage.setItem("userToken", userToken);
          await AsyncStorage.setItem("userProfile", JSON.stringify(user));
          dispatch({ type: 'LOGIN', id: user.phone_number, userToken: userToken})
          return {"message": message, "statusCode": statusCode, "userName": user.phone_number, "userToken": userToken};
        }catch(e){
          console.log("Got exception on async storage", e);
          return {"message": e.message, "statusCode": 0};
        } 
      },
      
      signOut: async() => {
        try{
          await AsyncStorage.removeItem("userToken");
          await AsyncStorage.removeItem("userProfile");
          dispatch({ type: 'LOGOUT' });
        }catch(e){
          return {"message": e.message, "statusCode": 0};
        }
        
      },
      
      
      createProfile: async(data) => {
        try{
          return await Services.CustomerService.createProfile(data);
        }catch(e){
          return {"message": e.message, "statusCode": 0};
        }
      },
      
      
      
      updateProfile: async(data) => {
        try{
          return await Services.CustomerService.updateProfile(data).then(async(res) => {
            const statusCode = res.statusCode;
            const message = res.message;
            if(statusCode == 1){
              const respData = res.data;
              await AsyncStorage.setItem("userProfile", JSON.stringify(respData));
              return {"message": message, "statusCode": statusCode, "data": respData};
            }else{
              return {"message": message, "statusCode": statusCode};
            }
          });
        }catch(e){
          return {"message": e.message, "statusCode": 0};
        }
      },
      
      UpdateProfileImage: async(data) => {
        try{
          return await Services.CustomerService.uploadProfilePicture(data)
          .then( async(res) => {
            const statusCode = res.statusCode;
            const message = res.message;
            if(statusCode == 1){
              const respData = res.data;
              return {"message": message, "statusCode": statusCode, "data": respData};
            }else{
              return {"message": message, "statusCode": statusCode};
            }
          });
        }catch(e){
          return {"message": e.message, "statusCode": 0};
        }
      },
      
      deleteProfilePicture: async(data) => {
        try{
          return await Services.CustomerService.removeProfilePicture(data);
        }catch(e){
          return {"message": e.message, "statusCode": 0};
        }
      },
      
      
      asyncCustomerProfile: async(id) => {
        
        try{
          return await Services.CustomerService.getCustomerData(id).then(async(res) => {
            const statusCode = res.statusCode;
            const message = res.message;
            if(statusCode == 1){
              const result = res.data;
              let userName = result.phone_number;
              await AsyncStorage.setItem("userProfile", JSON.stringify(result));
              return {"message": message, "statusCode": statusCode, "userName": userName};
            }else{
              return {"message": message, "statusCode": statusCode};
            }
          });
        }catch(e){
          return {"message": e.message, "statusCode": 0};
        }
      },
      
      getCustomerNotifications: async(id) => {
        try{
          return await Services.CustomerService.getNotifications(id);
        }catch(e){
          throw e;
        }
      },
      
      getCustomerTransactions: async(id) => {
        try{
          return await Services.TransactionService.getTransactionHistory(id);
        }catch(e){
          return {"message": e.message, "statusCode": 0};
        }
      },
      
      getParkingAreas: async() => {
        try{
          return await Services.ParkingService.fetchParkingAreas();
        }catch(e){
          return {"message": e.message, "statusCode": 0};
        }
      },
      
      getVehicleCategories: async() => {
        try{
          return await Services.ParkingService.getCarTypes().then(async(res) => {
            const statusCode = res.statusCode;
            let data;
            if(statusCode == 1){
              data = res.data;
            }else{
              data = [];
            }
            return data;
          });
        }catch(e){
          return {"message": e.message, "statusCode": 0};
        }
      },
      
      
      
      updatePassword: async(data) => {
        try{
          let userToken;
          userToken = null;
          return await Services.CustomerService.changePassword(data).then(async(res) => {
            const statusCode = res.statusCode;
            const message = res.message;
            return {"message": message, "statusCode": statusCode};
          });
        }catch(e){
          return {"message": e.message, "statusCode": 0};
        }
      },
      
      
      postSuggestion: async(data) => {
        try{
          const result = await Services.CustomerService.postSuggestion(data);
          return result;
        }catch(e){
          return {"message": e.message, "statusCode": 0};
        }
      },
      
      loadAirtimeCredit: async(data) => {
        try{
          const result = await Services.TransactionService.loadAirtime(data);
          return result;
        }catch(e){
          return {"message": e.message, "statusCode": 0};
        }
      },
      
      
      depositMoney: async(data) => {
        try{
          const result = await Services.CustomerService.topUp(data);
          return result;
        }catch(e){
          return {"message": e.message, "statusCode": 0};
        }
      },
      
      filterParkingAreas: async(data) => {
        try{
          const result = await Services.ParkingService.filterParkingAreas(data);
          return result;
        }catch(e){
          return {"message": e.message, "statusCode": 0};
        }
      },
      
      searchParkingArea: async(id) => {
        try{
          const result = await Services.ParkingService.fetchParkingDetailsById(id);
          return result;
        }catch(e){
          return {"message": e.message, "statusCode": 0};
        }
      },
      
      getNearByParkingAreas: async(lat, long) => {
        try{
          const result = await Services.ParkingService.fetchNearByParkingAreas(lat, long);
          return result;
        }catch(e){
          return {"message": e.message, "statusCode": 0};
        }
      },
      
      getTopRatedParkingAreas: async() => {
        try{
          const result = await Services.ParkingService.fetchTopRatedParkingAreas();
          return result;
        }catch(e){
          return {"message": e.message, "statusCode": 0};
        }
      },
      
      submitParkingRequest: async(data) => {
        try{
          return await Services.ParkingService.postParkingRequest(data).then(async(res) => {
            const statusCode = res.statusCode;
            const message = res.message;
            return {"message": message, "statusCode": statusCode};
            
          });
        }
        catch(e){
          return {"message": e.message, "statusCode": 0};
        }
        
        
      },
      
      syncProfileData: async(data) => {
        try{
          await AsyncStorage.setItem("userProfile", JSON.stringify(data));
          return {"message": 'done', "statusCode": 1};
        }catch(e){
          return {"message": e.message, "statusCode": 0};
        }
      },
      
      fetchMyParkingRequests: async(id) => {
        try{
          return await Services.ParkingService.getMyParkingRequests(id);
        }catch(e){
          return {"message": e.message, "statusCode": 0};
        }
      },
      
      fetchParkingFees: async(id) => {
        try{
          return await Services.ParkingService.fetchParkingFees(id);
        }catch(e){
          return {"message": e.message, "statusCode": 0};
        }
      },
      
      fetchOrderInfo: async(order_no, customer_id) => {
        try{
          return await Services.TransactionService.getOrderDetails(order_no, customer_id).then(async(res) => {
            const statusCode = res.statusCode;
            let data;
            if(statusCode == 1){
              data = res.data;
            }else{
              data = [];
            }
            return data;
          });
        }catch(e){
          return {"message": e.message, "statusCode": 0};
        }
      },
      
      toggleTheme: () => {
        setIsDarkTheme(isDarkTheme => !isDarkTheme);
      }
      
      
    }), []);
    
    
    
    useEffect(() => {
      let isMounted = true;
      NetInfo.fetch().then(state => {
        if(isMounted){
          setIsConnected(state.isConnected);
        }
      });
      
      const unsubscribe = NetInfo.addEventListener(state => {
        if(isMounted){
          setIsConnected(state.isConnected);
        }
      });
      unsubscribe();
      
      let fontName = 'RobotoCondensed-Light'
      GlobalFont.applyGlobal(fontName);
      requestUserPermission();
      deviceInformation();
      
      setTimeout(async() => {
        let user, userToken;
        userToken = null;
        user = null;
        try{
          userToken = await AsyncStorage.getItem("userToken");
          if(userToken){
            user = await AsyncStorage.getItem("userProfile");
            user = JSON.parse(user);
            setProfile(user);
          }
        }catch(e){
          console.log("Error on async storage", e);
        }
        dispatch({ type: 'REGISTER', userToken: userToken});
      }, 2500);
      
      SplashScreen.hide();
      return () => { isMounted = false };
      
    }, []);
    
    if(loginState.isLoading) {
      return (
        <AppLoaderAnimation/>
        )
      }
      
      return (
        isConnected ? 
        <AuthContext.Provider value={authContext }>
        <PaperProvider theme={theme}>
        <NavigationContainer theme={theme}>
        {
          loginState.userToken
          ?  <ProfileProvider value={providerValue}>
          <DrawerScreenStack/>
          </ProfileProvider>
          : <AppRootStack/>
        } 
        </NavigationContainer>
        </PaperProvider>
        </AuthContext.Provider>
        : <OfflineScreen/>
        );
      }
      
      
      
      export default App;
      
      const styles = StyleSheet.create({
        container: {
          flex: 1, 
        },
        scrollView: {
          flex: 1, 
          backgroundColor: '#fff',
          alignItems: 'center',
          justifyContent: 'center',
          padding:20,
        },
        
        refresh: {
          padding:15,
        },
        title: {
          color: '#05375a',
          fontSize: 20,
          fontWeight: 'bold',
          textAlign: 'center',
        },
      });