import React, {useEffect, useState, useMemo} from 'react';
import { View, ActivityIndicator, Image, RefreshControl,  Text, 
  StyleSheet, SafeAreaView, ScrollView} from 'react-native';
  import { NavigationContainer } from '@react-navigation/native';
  import AsyncStorage from '@react-native-async-storage/async-storage';
  import { Provider as PaperProvider, DefaultTheme as PaperDefaultTheme, DarkTheme as PaperDarkTheme } 
  from 'react-native-paper';
  import { AuthContext } from './app/context/context';
  import AppRootStack from  './app/components/stacks/AppRootStack';
  import DrawerScreenStack from './app/components/stacks/DrawerScreenStack';
  import loginReducer from './app/redux/reducers/loginReducer';
  import NetInfo from "@react-native-community/netinfo";
  import FontAwesome from 'react-native-vector-icons/FontAwesome';
  import { ProfileProvider } from './app/context/index';
  import SplashScreen from 'react-native-splash-screen'
  import {  icons} from './constants';
  import GlobalFont from 'react-native-global-font'
  const Services = require("./app/services");
  
  // import OfflineScreen from  './app/screens/OfflineScreen';
  
  const theme = {
    ...PaperDefaultTheme,
    roundness: 2,
    colors: {
      ...PaperDefaultTheme.colors,
      primary: '#3498db',
      accent: '#f1c40f',
    },
  };
  
  const initialLoginState = {
    isLoading: true,
    userName: null,
    userToken: null,
    data: null,
  }
  
  
  
  
  
  const wait = (timeout) => {
    return new Promise(resolve => setTimeout(resolve, timeout));
  }
  
  
  const user = async () =>{
    let userData = null;
    try {
      const payload = await AsyncStorage.getItem('userProfile')
      userData = JSON.parse(payload); 
      return userData;
    } catch (e) {
      console.log(e);
    }
  }
  
  
  
  const AppStack = ({token}) => {
    
  }
  
  
  const getUser = async() => {
    try{
      const user = await AsyncStorage.getItem("userProfile");
      const userProfile = JSON.parse(user)
      return userProfile;
    }catch(e){
      throw e;
    }
  }
  
  
  function App() {
    
    
    
    const [profile, setProfile] = useState(null);
    const providerValue = useMemo(() => ({profile, setProfile}), [profile, setProfile]); 
    const [loginState, dispatch] = React.useReducer(loginReducer, initialLoginState);
    const [isConnected, setIsConnected] = React.useState(false);
    
    
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
            return await Services.CustomerService.getNotifications(id).then(async(res) => {
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
        }, 1000);
        
        SplashScreen.hide();
        return () => { isMounted = false };
        
      }, []);
      
      if(loginState.isLoading) {
        return (
          <View style={{flex:1, justifyContent: 'center', alignItems:'center'}}>
          <ActivityIndicator size="large"/>
          </View>
          )
        }
        
        return (
          isConnected ? 
          <AuthContext.Provider value={authContext }>
          <PaperProvider theme={theme}>
          <NavigationContainer>
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