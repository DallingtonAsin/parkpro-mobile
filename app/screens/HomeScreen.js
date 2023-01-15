import React, {useState, useEffect, useMemo, useRef, useContext, useCallback} from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Alert, Pressable,
} from 'react-native';
import { SIZES } from '../../constants';
import { HomeCardItem } from '../components/CardItem';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {  Divider  } from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome';
import design from '../../assets/css/styles';
import ProfileContext from '../context/index';
import { AuthContext } from '../context/context';
import Toast from 'react-native-simple-toast';
import {CURRENCY} from '@env';
import BottomSheet, { BottomSheetBackdrop, BottomSheetScrollView } from '@gorhom/bottom-sheet';
import FocusAwareStatusBar  from '../components/common/FocusAwareStatusBar';
import { getDeviceId, getDeviceIpAddress, getAppVersionName } from '../components/sharedHelper/AppUtils';
import { useTheme } from '@react-navigation/native';
import { useIsMounted } from '../components/common/isMounted';
import { apiKeys } from '../constants';
import { AddVehicleScreen } from '../components/vehicle';
import { renderHeader } from '../components/bottomSheets/renderHender';

const dbVehicleHelper = require("../database/vehicles");
const dbParkingHelper = require("../database/favouriteParkings");

const initialVehicleState= {
  id: '',
  number: '',
  name: '',
  type: '',
}


const HomeScreen = (props) => {
  
  const [isLoading, setIsLoading] = useState(false);
  const [vehicles, setVehicleState] = useState({});
  const [vehicle, setVehicleData] = React.useState(initialVehicleState);
  const [vehicleTypes, setVehicleTypes] = useState([]);
  const [favouriteParkings, setFavouriteParkings] = useState([]);
  
  const [isSheetVisible, setIsSheetVisible] = useState(false);
  const { profile } = useContext(ProfileContext);
  const {getVehicleCategories, updateAppDetails, asyncCustomerProfile } = React.useContext(AuthContext);
  const isMounted = useIsMounted();
  const [isEditingVehicle, setIsEditingVehicle] = useState(false);
  const [hideBalance, setHideBalance] = useState(false);
  
  const vehicleBottomSheetRef = useRef(0);
  const favouritesBottomSheetRef = useRef(0);
  
  const snapPoints = useMemo(() => ['25%', '75%'], []);
  
  const { colors } = useTheme();
  const styles = makeStyles(colors);
  
  const handleVehicleSheetChanges = useCallback((index) => {
    populateVehicles();
  }, []);
  
  const handleSheetFavouriteParkingChanges = useCallback((index) => {
    populateFavouriteParkings();
  }, []);
  
  const openVehiclesSheet = useCallback((index) => {
    favouritesBottomSheetRef.current?.close();
    vehicleBottomSheetRef.current?.snapToIndex(index);
  }, []);
  
  
  const closeAddVehicleScreen = () => {
    setVehicleData({...initialVehicleState});
    setIsSheetVisible(false);
    setIsEditingVehicle(false);
  }
  
  const openFavouritesSheet = useCallback((index) => {
    vehicleBottomSheetRef.current?.close();
    favouritesBottomSheetRef.current?.snapToIndex(index);
  }, []);
  
  
  useEffect(() => {
    
    const asyncUserProfile = async() => {
      await asyncCustomerProfile(profile.id);
    }
    
    asyncUserProfile()
    .catch((error => {console.log(`Error on asyncing user profile`, error)}));
    
    
    dbVehicleHelper.createVehiclesTable();
    dbParkingHelper.createTableFavouriteParkings();

    const updateUserDetails = async() => {
        await updateUserAppDetails();
    }

    updateUserDetails()
    .catch((error => {console.log(`Error on asyncing user details`, error)}));
    
    
    populateVehicleTypes();
    populateVehicles();
    populateFavouriteParkings();
    
  }, []);
  
  
  const updateUserAppDetails = async() => {
    try{
      
      let deviceInfo = await AsyncStorage.getItem(apiKeys.DEVICE_INFO);
      deviceInfo = JSON.parse(deviceInfo);
      const deviceToken =  deviceInfo[`${apiKeys.DEVICE_TOKEN}`];
      
      const deviceId = getDeviceId();
      const ipAddress = await getDeviceIpAddress();
      const currentVersion = getAppVersionName();
      
      const reqParams = {
        id: profile.id,
        uniqueDeviceId: deviceId,
        ipAddress: ipAddress,
        currentVersion: currentVersion,
        deviceToken: deviceToken
      }
      const result = await updateAppDetails(reqParams);
      // console.log("Update app details result", result);
      
    }catch(err){
      Toast.show(err.message, Toast.LONG);
    }
  }
  
  
  const populateFavouriteParkings = () =>{
    try{
      dbParkingHelper.getFavouriteParkings(parkings => {
        if(parkings){
          if(isMounted.current) { 
            setFavouriteParkings(parkings);
          }
        }
      });
    }catch(err){
      console.log("Error on loading favourite parkings", err);
    }
    
  }
  
  
  const renderVehiclesBackdrop = useCallback(
    props => (
      <BottomSheetBackdrop
      {...props}
      opacity={0.2}
      />
      ),
      []
      );
      
      const renderFavouritesBackdrop = useCallback(
        props => ( <BottomSheetBackdrop  {...props}  opacity={0.2} />),
        []);
        
        const handleVehicleNoChange = (val) => {
          setVehicleData({
            ...vehicle,
            number: val,
          });
        }
        
        
        const populateVehicleTypes = async() => {
          
          try{
            
            const result = await getVehicleCategories();
            if(result.statusCode == 200){
              const data = result.data;
              const vehicle_types = [];
              for(let i=0; i<data.length; i++) {
                vehicle_types.push(data[i]['name']);
              }
              if(isMounted.current) { 
                setVehicleTypes(vehicle_types);
              }
            }
          }catch(err){
            Toast.show(err.message, Toast.LONG);
          }
          
        }
        
        
        const populateVehicles = () =>{
          try{
            dbVehicleHelper.getVehicles(vehicles => {
              if(vehicles){
                if(isMounted.current) { 
                  setVehicleState(vehicles);
                }
              }
            });
          }catch(err){
            Toast.show(err.message, Toast.LONG);
          }
          
        }
        
        const registerVehicle = () => {
          
          try{
            if (!vehicle.number) {
              Toast.show('Please enter vehicle number', Toast.LONG);
              return;
            }
            if (!vehicle.name) {
              Toast.show('Please enter vehicle name', Toast.LONG);
              return;
            }
            if (!vehicle.type) {
              Toast.show('Please select vehicle type', Toast.LONG);
              return;
            }
            
            if(vehicle.number && vehicle.name) {
              setIsLoading(true);
              dbVehicleHelper.doesVehicleExist(vehicle, exists => {
                if(exists){
                  setIsLoading(false);
                  Toast.show('Sorry, vehicle with number '+vehicle.number+' has already been registered.', Toast.LONG);
                }else{
                  
                  dbVehicleHelper.insertVehicle(vehicle, isInserted => {
                    if(isInserted){
                      setVehicleData({...initialVehicleState});
                      populateVehicles();
                      setIsSheetVisible(false);
                      Toast.show('Vehicle added successfully', Toast.LONG);
                    }else{
                      alert('Unable to register vehicle');
                    }
                    setIsLoading(false);
                  });
                }
              });
              
              
            }
          }catch(err){
            console.log("Error on adding vehicle", err);
          }
        };
        
        const updateVehicle = () => {
          
          try{
            
            const id = vehicle.id;
            const number = vehicle.number;
            const name = vehicle.name;
            const type = vehicle.type;
            
            if (!id) {
              Toast.show('Unable to capture  vehicle id', Toast.LONG);
              return;
            }
            if (!number) {
              Toast.show('Please enter vehicle number', Toast.LONG);
              return;
            }
            if (!name) {
              Toast.show('Please enter vehicle name', Toast.LONG);
              return;
            }
            if (!type) {
              Toast.show('Please select vehicle type', Toast.LONG);
              return;
            }
            setIsLoading(true);
            dbVehicleHelper.updateVehicleDetails(vehicle, isUpdated => {
              if(isUpdated){
                setVehicleData({...initialVehicleState});
                populateVehicles();
                setIsSheetVisible(false);
                Toast.show('Vehicle details updated successfully', Toast.LONG);
              }else{
                alert('Unable to update vehicle details');
              }
              setIsLoading(false);
            });
            
          }catch(err){
            console.log("Error on updating vehicle details", err);
          }
          
        };
        
        
        const deleteVehicle = (VehicleId) => {
          try{
            if(!VehicleId){
              Toast.show('Please select vehicle to remove', Toast.LONG);
              return;
            }
            dbVehicleHelper.deleteVehicle(VehicleId, isDeleted => {
              if(isDeleted){
                populateVehicles();
                Toast.show('Vehicle removed successfully', Toast.LONG);
              }else{
                alert('Unable to remove vehicle');
              }
            });
          }catch(err){
            console.log("Error on deleting vehicle", err);
          }
        }
        
        
        const handleVehicleNameChange = (val) => {
          setVehicleData({
            ...vehicle,
            name: val,
          });
        }
        
        const handleVehicleTypeChange = (val) => {
          setVehicleData({
            ...vehicle,
            type: val,
          });
        }
        
        
        let modalRef;
        const openModal = () => modalRef.show();
        const saveModalRef = ref => modalRef = ref;
        const onSelectedOption = value => {
          handleVehicleTypeChange(value);
        };
        
        const chooseActionOnVehicle = (item) => {
          Alert.alert(
            'Take action',
            'Choose action on the vehicle',
            [
              {
                text: 'Edit',
                onPress: () => {
                  setVehicleData({
                    id: item.id,
                    number: item.number,
                    name: item.name,
                    type: item.type,
                    
                  });
                  
                  setIsSheetVisible(true)
                  setIsEditingVehicle(true);
                }
              },
              {
                text: 'Delete',
                onPress: () => {
                  confirmDeleteVehicle(item);
                }
              },
            ],
            { cancelable: true }
            );
          }
          
          
          const confirmDeleteVehicle = (item) => {
            Alert.alert(
              'Confirm Delete',
              `Are you sure you want to delete this vehicle ${item.name} ${item.number} from your list?`,
              [
                {
                  text: 'Yes',
                  onPress: () => {
                    deleteVehicle(item.id);
                  }
                },
                {
                  text: 'No',
                  onPress: () => {
                    
                  }
                },
              ],
              { cancelable: true }
              );
            }
            
            const toggleBottomNavigationView = () => {
              setIsSheetVisible(!isSheetVisible);
            };
            
            
            
            const FlatListItemSeparator = () => {
              return (
                <View
                style={{
                  height: 1,
                  width: "100%",
                  backgroundColor: "#e2e2e2",
                }}
                />
                );
              }
              function capitalizeFirstLetter(string) {
                return string.charAt(0).toUpperCase() + string.slice(1);
              }
              
              
              const renderVehicles =  useCallback(
                (item) => (
                  <View key={item.id} style={{flexDirection: 'row', padding:12}}>
                  {/* <Image
                  source={require('../../assets/images/UberX.jpeg')}
                  style={design.vehicle.image}
                  /> */}
                  <View style={design.vehicle.middleContainer}>
                  <Text style={[design.vehicle.text, {color: '#000'}]}>{item.number}</Text>
                  <Text style={[design.vehicle.name, {color: '#000'}]}>{item.name}</Text>
                  </View>
                  <View style={design.vehicle.middleContainer}>
                  <Text style={[design.vehicle.name, {color: '#000'}]}>{capitalizeFirstLetter(item.type)}</Text>
                  </View>
                  <View style={design.vehicle.rightContainer}>
                  <Pressable onPress={() => chooseActionOnVehicle(item) }>
                  <FontAwesome name={"ellipsis-h"} size={35} style={design.vehicle.ellipsis} />
                  </Pressable>
                  </View>
                  
                  </View>
                  ),[]);
                  
                  const viewParkingInfo = (item) => { 
                    // console.log(`Item onto info screen`, item);
                    item.id = item.uniquePId;
                    // console.log(`Item onto info screen 2`, item);
                    
                    // return;
                    props.navigation.navigate("ParkingInfo", {
                      screen: 'ParkingInfo',
                      params: {
                        item: item
                      }
                    });
                  }
                  
                  const renderFavouriteParkings = useCallback(
                    
                    (item) => (
                      <TouchableOpacity 
                      onPress={() => { viewParkingInfo(item) }}
                      key={item.uniquePId} 
                      style={[design.vehicle.container,{padding:10}]}
                      >
                      <Icon name="map-marker" size={30} color="#4F8EF7" />
                      <View style={design.vehicle.middleContainer}>
                      <Text style={design.vehicle.text}>{item.name}</Text>
                      <Text style={design.vehicle.name}>{item.address}</Text>
                      </View>
                      </TouchableOpacity>
                      ),[]);
                      
                      
                      
                      return (
                        <>
                        
                        <FocusAwareStatusBar barStyle="light-content"
                        backgroundColor={colors.primary} />
                        
                        
                        <AddVehicleScreen
                        isSheetVisible={isSheetVisible}
                        toggleBottomNavigationView={toggleBottomNavigationView}
                        vehicleTypes={vehicleTypes}
                        vehicle={vehicle}
                        isLoading={isLoading}
                        setIsSheetVisible={setIsSheetVisible}
                        onSelectedOption={onSelectedOption}
                        saveModalRef={saveModalRef}
                        openModal={openModal}
                        handleVehicleNoChange={handleVehicleNoChange}
                        handleVehicleNameChange={handleVehicleNameChange}
                        registerVehicle={registerVehicle}
                        updateVehicle={updateVehicle}
                        isEditingVehicle={isEditingVehicle}
                        closeAddVehicleScreen={closeAddVehicleScreen}
                        />
                        
                        
                        <View style={styles.container}>
                        
                        <View style={styles.header}>
                        <Text style={styles.mywallet}>My Wallet</Text>
                        
                        <View style= {{flexDirection : 'row', padding: 15, justifyContent: 'space-around'}}>
                        <Text style={styles.balanceText}>
                        {CURRENCY} 
                        { hideBalance && <Text> .....</Text> }
                        { !hideBalance && <Text> {profile.account_balance}</Text> } 
                        </Text>
                        </View>
                        
                        </View>
                        
                        
                        <View style={styles.body}>
                        <Text style={styles.bodyHeaderText}>Quick Actions</Text>
                        
                        <View style={styles.cardRow}>
                        
                        <HomeCardItem
                        icon={'parking'}
                        bgColor={['#fff', '#fff']}
                        label="Parking"
                        tintColor={colors.icon}
                        borderRadius={5}
                        onPress={() => props.navigation.navigate("ParkingAreas") }
                        />
                        
                        <HomeCardItem
                        icon={'bookmark'}
                        bgColor={['#fff', '#fff']}
                        label="Favourites"
                        borderRadius={5}
                        tintColor={colors.icon}
                        onPress={() => openFavouritesSheet(1)}
                        />
                        
                        
                        <HomeCardItem
                        icon={'car'}
                        bgColor={['#fff', '#fff']}
                        label="My Vehicles"
                        borderRadius={5}
                        tintColor={colors.icon}
                        onPress={() => openVehiclesSheet(1)}
                        />
                        
                        
                        </View>
                        
                        <View style={styles.cardRow}>
                        
                        <HomeCardItem
                        icon={'shopping-cart'}
                        bgColor={['#fff', '#fff']}
                        label="Orders"
                        borderRadius={5}
                        tintColor={colors.icon}
                        onPress={() => props.navigation.navigate("Orders")}
                        />
                        
                        
                        
                        <HomeCardItem
                        icon={'plus-circle'}
                        bgColor={['#fff', '#fff']}
                        label="Deposit"
                        borderRadius={5}
                        tintColor={colors.icon}
                        onPress={() => props.navigation.navigate("TopUp")}
                        />
                        
                        <HomeCardItem
                        icon={'wallet'}
                        bgColor={['#fff', '#fff']}
                        label="Transactions"
                        borderRadius={5}
                        tintColor={colors.icon}
                        onPress={() => props.navigation.navigate("PaymentHistory") }
                        />
                        </View>
                        
                        </View>
                        
                        {/* <VehicleScreen
                        vehicleBottomSheetRef={vehicleBottomSheetRef}
                        snapPoints={snapPoints}
                        renderVehiclesBackdrop={renderVehiclesBackdrop}
                        handleVehicleSheetChanges={handleVehicleSheetChanges}
                        renderHeader={renderHeader}
                        vehicles={vehicles}
                        isSheetVisible={isVehicleSheetVisible}
                        setIsSheetVisible={setIsVehicleSheetVisible}
                        renderVehicles={renderVehicles}
                      /> */}
                      
                      
                      <BottomSheet
                      ref={vehicleBottomSheetRef}
                      index={-1}
                      
                      snapPoints={snapPoints}
                      enablePanDownToClose={true}
                      backdropComponent={renderVehiclesBackdrop}
                      onChange={handleVehicleSheetChanges}
                      handleComponent={() => renderHeader("My Vehicles") }>
                      
                      <Divider style={styles.divider}/>
                      
                      <BottomSheetScrollView contentContainerStyle={styles.contentContainer}>
                      {
                        vehicles.length > 0 
                        ? vehicles.map(renderVehicles)
                        : <View style={{flex:1, justifyContent: 'center', alignItems: 'center'}}>
                        <Text style={styles.text}>No vehicles added yet.</Text>
                        </View>
                      }
                      </BottomSheetScrollView>
                      
                      <TouchableOpacity style={styles.bottomSheetButton} onPress={() => {setIsSheetVisible(true)}}>
                      <Text style={design.vehicle.textAdd}>add vehicle</Text>
                      </TouchableOpacity>
                      
                      </BottomSheet>
                      
                      
                      <BottomSheet
                      ref={favouritesBottomSheetRef}
                      index={-1}
                      snapPoints={snapPoints}
                      enablePanDownToClose={true}
                      backdropComponent={renderFavouritesBackdrop}
                      onChange={handleSheetFavouriteParkingChanges}
                      handleComponent={() => renderHeader("favourite parking areas") }
                      >
                      
                      <Divider style={styles.divider}/>
                      
                      <BottomSheetScrollView contentContainerStyle={styles.contentContainer}>
                      {
                        favouriteParkings.length > 0 
                        ? favouriteParkings.map(renderFavouriteParkings)
                        : <View style={{flex:1, justifyContent: 'center', alignItems: 'center'}}>
                        <Text style={styles.text}>No favourite parkings added yet.</Text>
                        </View>
                      }
                      </BottomSheetScrollView>
                      </BottomSheet>
                      
                      </View>
                      </>
                      );
                    };
                    
                    export default HomeScreen;
                    
                    const makeStyles =  (colors) => StyleSheet.create({
                      
                      container: {
                        flex: 1,
                        backgroundColor: colors.primary,
                      },
                      
                      header:{
                        flex: 1,
                        paddingHorizontal: SIZES.padding,
                        alignItems: "center",
                        justifyContent: "center"
                      },
                      
                      body:{ 
                        flex: 3,
                        backgroundColor:design.colors.white, 
                        borderTopLeftRadius:25,
                        borderTopRightRadius:25
                      },
                      
                      cardRow: {
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        marginTop: SIZES.radius, 
                        marginLeft:10,
                        marginRight:10
                      },
                      
                      contentContainer: {
                        alignItems: 'center',
                        backgroundColor: colors.text,
                      },
                      
                      divider:{
                        borderBottomColor: '#e2e2e2',
                        borderBottomWidth: 1,
                        marginTop:20
                      },
                      
                      bottomSheetButton:{
                        flexDirection: 'row',
                        justifyContent: 'center',
                        alignItems: 'center',
                        alignSelf: 'center',
                        borderWidth:1,
                        marginLeft:10, 
                        marginTop:15,
                        marginBottom:80,
                        height:50,
                        width:'75%',
                        borderRadius:30,
                        borderColor:design.colors.primary,
                      },
                      
                      text: {
                        fontSize: 18,
                        textAlign: 'center',
                      },
                      
                      mywallet:{
                        color: '#fff',
                        fontSize: 24,
                        textAlign: 'center',
                        fontWeight: "bold",
                      },
                      
                      balanceText: {
                        color: '#fff',
                        fontSize: 28,
                        // padding: 15,
                        textAlign: 'center',
                        fontWeight: "bold",
                      },
                      
                      bodyHeaderText:{
                        fontSize:18,
                        textAlign:'center',
                        fontWeight:'bold',
                        color: design.colors.parksmart,
                        opacity:0.8,
                        padding:15
                      }
                      
                    });