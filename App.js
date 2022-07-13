import React, {useEffect, useState, useMemo} from 'react';
import { Image, RefreshControl,  Text, View, StatusBar, StyleSheet,
  SafeAreaView, ScrollView, Platform, NativeModules, TouchableOpacity} from 'react-native';
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
  const services = require("./app/services");
  import AppLoaderAnimation from './app/components/loaders/AppLoaderAnimation';
  import { customDefaultTheme,  customDarkTheme} from './assets/themes';
  import messaging from '@react-native-firebase/messaging';
  import auth from '@react-native-firebase/auth';
  import firestore from '@react-native-firebase/firestore';
  import PushNotification, { Importance } from "react-native-push-notification";
  import Toast from 'react-native-simple-toast';
  import { useIsMounted } from './app/components/common/isMounted';
  import LocationEnabler from 'react-native-location-enabler';
  import { navigationRef } from './app/components/navigators/RootNavigation';
  import design from './assets/css/styles';
  import { COLORS, SHADOWS, SIZES, FONTS, apiKeys } from './app/constants';
  
  
  const {
    PRIORITIES: { HIGH_ACCURACY },
    useLocationSettings,
  } = LocationEnabler;
  
  const initialLoginState = {
    isLoading: true,
    userName: null,
    userToken: null,
    data: null,
  }
  
  const channel_id= "app-notifications";
  
  PushNotification.configure({
    onNotification: function (notification) {
      console.log('LOCAL NOTIFICATION ==>', notification);
    },
    requestPermissions: Platform.OS === 'ios',
  });
  
  PushNotification.createChannel({
    channelId: channel_id, 
    channelName: "app-notifications", 
    importance: Importance.HIGH,
  },
  (created) => {}
  );
  
  const wait = (timeout) => {
    return new Promise(resolve => setTimeout(resolve, timeout));
  }
  
  const listenForPushNotification = () => {
    
    PushNotification.channelBlocked(channel_id, function (blocked) {
      console.log(blocked); // true/false
    });
    
    PushNotification.checkPermissions((permissions) => {
      console.log("Permissions", permissions);
    });
    
    const subscribe = messaging().onMessage(async remoteMessage => {
      let message_body = remoteMessage.notification.body;
      let message_title = remoteMessage.notification.title;
      Toast.show(`${message_title} : ${message_body}`);
      // let avatar = remoteMessage.notification.android.imageUrl;
    });
    return subscribe;
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
  
  
  const App = ()  => {
    
    
    const [profile, setProfile] = useState(null);
    const providerValue = useMemo(() => ({profile, setProfile}), [profile, setProfile]); 
    const [loginState, dispatch] = React.useReducer(loginReducer, initialLoginState);
    const [isConnected, setIsConnected] = React.useState(false);
    const [isDarkTheme, setIsDarkTheme] = React.useState(false);
    
    const theme = isDarkTheme ? customDarkTheme : customDefaultTheme;
    const isMounted = useIsMounted();
    
    const [enabled, requestResolution] = useLocationSettings(
      {
        priority: HIGH_ACCURACY,
        alwaysShow: true, 
        needBle: true,
      },
      false 
      );
      
      
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
        
        
        const EnableLocationScreen = () => {
          
          const css =  makeStyles(theme.colors);
          
          return(
            <View style={css.container}>
            <StatusBar barStyle="light-content" backgroundColor={theme.colors.primary} />
            
            <View style={css.header}>
            <FontAwesome name={"map-marker"} size={135} color={theme.colors.text} style={{ top:-80 }}/>
            <Text style={{textAlign: 'center', fontSize:30, color: theme.colors.text,
            fontWeight: 'bold'}}>Where are you?</Text>
            <Text style={{textAlign: 'center', fontSize:18, 
            color: theme.colors.text, top:35, fontStyle: 'normal' }}>
            Enabling your location is important because it helps us 
            get you the closest parking areas.</Text>
            </View>
            
            <View style={css.footer}>
            <TouchableOpacity style={[design.btnSecondary, 
              { color: '#fff', backgroundColor: theme.colors.text,
              borderColor: theme.colors.primary, alignSelf: 'center'}]}
              onPress={requestResolution}>
              <Text style={{color:design.colors.dark, textTransform:'uppercase',
              fontSize:16, fontWeight: 'bold'}}>Enable Your Location </Text>
              </TouchableOpacity>
              </View>
              </View>
              )
            }
            
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
              data[`${apiKeys.DEVICE_TOKEN}`] = token;
              data[`${apiKeys.DEVICE_TYPE}`] = Platform.OS;
              data[`${apiKeys.DEVICE_LANGUAGE}`] = language;
              loadDeviceInfo(data).done();
              
            }
            
            const loadDeviceInfo = async (deviceData) => {
              var value = JSON.stringify(deviceData);
              try {
                await AsyncStorage.setItem(apiKeys.DEVICE_INFO, value);
              } catch (error) {
                console.log(error);
              }
            }; 
            
            const authContext = React.useMemo(() => ({
              
              
              sendSmsVerification: async(data) => {
                try{
                  return await services.customer.sendOTP(data);
                }catch(e){
                  throw e;
                }
              },
              
              verifyOTP: async(data) => {
                try{
                  return await services.customer.verifyOtp(data);
                }catch(e){
                  throw e;
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
                  
                }catch(e){
                  console.log("Got exception on async storage", e);
                  throw e;
                } 
              },
              
              signOut: async() => {
                try{
                  await AsyncStorage.removeItem("userToken");
                  await AsyncStorage.removeItem("userProfile");
                  dispatch({ type: 'LOGOUT' });
                }catch(e){
                  throw e;
                }
                
              },
              
              
              createProfile: async(data) => {
                try{
                  return await services.customer.createProfile(data);
                }catch(e){
                  throw e;
                }
              },
              
              
              updateProfile: async(data) => {
                try{
                  return await services.customer.updateProfile(data);
                }catch(e){
                  throw e;
                }
              },
              
              UpdateProfileImage: async(data) => {
                try{
                  return await services.customer.uploadProfilePicture(data);
                }catch(e){
                  throw e;
                }
              },
              
              deleteProfilePicture: async(data) => {
                try{
                  return await services.customer.removeProfilePicture(data);
                }catch(e){
                  throw e;
                }
              },
              
              changePin: async(data) => {
                try{
                  return await services.customer.changePin(data);
                }catch(e){
                  throw e;
                }
              },
              
              asyncCustomerProfile: async(id) => {
                
                try{
                  return await services.customer.getCustomerData(id).then(async(res) => {
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
                  throw e;
                }
              },
              
              getCustomerNotifications: async(id) => {
                try{
                  return await services.customer.getNotifications(id);
                }catch(e){
                  throw e;
                }
              },
              
              getCustomerTransactions: async(id) => {
                try{
                  return await services.transaction.getTransactionHistory(id);
                }catch(e){
                  throw e;
                }
              },
              
              getParkingAreas: async() => {
                try{
                  return await services.parking.fetchParkingAreas();
                }catch(e){
                  throw e;
                }
              },
              
              getVehicleCategories: async() => {
                try{
                  return await services.parking.getCarTypes();
                }catch(e){
                  throw e;
                }
              },
              
              
              
              updatePassword: async(data) => {
                try{
                  return await services.customer.changePassword(data)
                }catch(e){
                  throw e;
                }
              },
              
              
              postSuggestion: async(data) => {
                try{
                  return await services.customer.postSuggestion(data);
                }catch(e){
                  throw e;
                }
              },
              
              
              depositMoney: async(data) => {
                try{
                  return await services.customer.topUp(data);
                }catch(e){
                  throw e;
                }
              },
              
              filterParkingAreas: async(data) => {
                try{
                  return await services.parking.filterParkingAreas(data);
                }catch(e){
                  throw e;
                }
              },
              
              searchParkingArea: async(id) => {
                try{
                  return await services.parking.fetchParkingDetailsById(id);
                }catch(e){
                  throw e;
                }
              },
              
              getNearByParkingAreas: async(lat, long) => {
                try{
                  const result = await services.parking.fetchNearByParkingAreas(lat, long);
                  return result;
                }catch(e){
                  throw e;
                }
              },
              
              getTopRatedParkingAreas: async() => {
                try{
                  const result = await services.parking.fetchTopRatedParkingAreas();
                  return result;
                }catch(e){
                  throw e;
                }
              },
              
              submitParkingRequest: async(data) => {
                try{
                  return await services.parking.postParkingRequest(data);
                }
                catch(e){
                  throw e;
                }
                
              },
              
              syncProfileData: async(data) => {
                try{
                  await AsyncStorage.setItem("userProfile", JSON.stringify(data));
                  return {"message": 'done', "statusCode": 1};
                }catch(e){
                  throw e;
                }
              },
              
              fetchMyParkingRequests: async(id) => {
                try{
                  return await services.parking.getMyParkingRequests(id);
                }catch(e){
                  throw e;
                }
              },
              
              fetchParkingFees: async(id) => {
                try{
                  return await services.parking.fetchParkingFees(id);
                }catch(e){
                  throw e;
                }
              },
              
              fetchOrderInfo: async(order_no, customer_id) => {
                try{
                  return await services.transaction.getOrderDetails(order_no, customer_id);
                }catch(e){
                  throw e;
                }
              },
              
              updateAppDetails: async(data) => {
                try{
                  return await services.customer.postAppDetails(data);
                }catch(e){
                  throw e;
                }
              },
              
              resendSignupOTP: async(data) => {
                try{
                  return await services.customer.resendSignupOTP(data);
                }catch(e){
                  throw e;
                }
              },

              verifyChangePhoneNumber: async(data) => {
                try{
                  return await services.customer.verifyChangePhoneNumber(data);
                }catch(e){
                  throw e;
                }
              },

              changePhoneNumber: async(data) => {
                try{
                  return await services.customer.changePhoneNumber(data);
                }catch(e){
                  throw e;
                }
              },
              
              toggleTheme: () => {
                setIsDarkTheme(isDarkTheme => !isDarkTheme);
              }
              
              
            }), []);
            
            
            
            useEffect(() => {
              
              let fontName = 'Inter-Light'
              GlobalFont.applyGlobal(fontName);
              
              NetInfo.fetch().then(state => {
                isMounted.current && setIsConnected(state.isConnected);
                
              });
              
              const unsubscribe = NetInfo.addEventListener(state => {
                isMounted.current && setIsConnected(state.isConnected);
                
              });
              
              unsubscribe();
              
              
              requestUserPermission();
              deviceInformation();
              listenForPushNotification();
              
              setTimeout(async() => {
                
                let user, userToken;
                userToken = null;
                user = null;
                
                try{
                  userToken = await AsyncStorage.getItem("userToken");
                  if(userToken){
                    
                    user = await AsyncStorage.getItem("userProfile");
                    user = JSON.parse(user);
                    isMounted.current &&  setProfile(user);
                    
                  }
                }catch(e){
                  console.log("Error on async storage", e);
                }
                dispatch({ type: 'REGISTER', userToken: userToken});
              }, 2500);
              
              SplashScreen.hide();
              
            }, []);
            
            if(loginState.isLoading) {
              return (
                <AppLoaderAnimation/>
                )
              }
              
              if(!isConnected){
                return (
                  <OfflineScreen/>
                  )
                }
                
                if(!enabled){
                  return (
                    <EnableLocationScreen theme={theme} userToken={loginState.userToken}/>
                    )
                  }
                  
                  return (
                    
                    <AuthContext.Provider value={authContext}>
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
                  
                  const makeStyles = (colors) => StyleSheet.create({
                    
                    container: {
                      flex: 1
                    },
                    
                    header: {
                      flex: 5,
                      padding:20,
                      backgroundColor: colors.primary,
                      justifyContent: 'center',
                      alignItems: 'center',
                    },
                    
                    footer: {
                      flex: 1,
                      backgroundColor: design.colors.white,
                    }
                  });