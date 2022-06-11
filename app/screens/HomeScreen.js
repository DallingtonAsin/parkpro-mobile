import React, {useState, useEffect, useMemo, useRef, useContext, useCallback} from 'react';
import {
  StyleSheet,
  View,
  Image,
  Text,
  TouchableOpacity,
  TextInput,
  SafeAreaView,Keyboard,
  Alert, Pressable,
} from 'react-native';
import { icons, SIZES } from '../../constants';
import OptionItem from '../components/OptionItem';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';
// import BottomSheet   from 'reanimated-bottom-sheet';
import { BottomSheet as BrSheet } from 'react-native-btr';
import { Avatar, Divider  } from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome';
import design from '../../assets/css/styles';
import ProfileContext from '../context/index';
import { AuthContext } from '../context/context';
import Toast from 'react-native-simple-toast';
import { UIActivityIndicator } from 'react-native-indicators';
import * as theme from '../../assets/theme';
import {CURRENCY, MIN_AIRTIME_AMOUNT, MAX_AIRTIME_AMOUNT} from '@env';
import Dropdown from 'react-native-modal-dropdown';
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetScrollView
} from '@gorhom/bottom-sheet';
import FocusAwareStatusBar  from '../components/common/FocusAwareStatusBar';
import crashlytics from "@react-native-firebase/crashlytics";
import { getDeviceId, getDeviceIpAddress, getAppVersionName } from '../components/SharedCommons';
import { useTheme } from '@react-navigation/native';
import { useIsMounted } from '../components/common/isMounted';
import { COLORS, SHADOWS, FONTS, apiKeys } from '../constants';


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
  const [userCounts, setUserCounts] = useState(null);
  const [favouriteParkings, setFavouriteParkings] = useState([]);
  
  const [isSheetVisible, setIsSheetVisible] = useState(false);
  const [isEditSheetVisible, setIsEditSheetVisible] = useState(false);
  const { profile } = useContext(ProfileContext);
  const {getVehicleCategories, updateAppDetails } = React.useContext(AuthContext);
  const isMounted = useIsMounted();
  
  const vehicleBottomSheetRef = useRef(0);
  const favouritesBottomSheetRef = useRef(0);
  
  
  const snapPoints = useMemo(() => ['25%', '70%'], []);
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
  
  
  const openFavouritesSheet = useCallback((index) => {
    vehicleBottomSheetRef.current?.close();
    favouritesBottomSheetRef.current?.snapToIndex(index);
  }, []);
  
  
  useEffect(() => {
    
    dbVehicleHelper.createVehiclesTable();
    dbParkingHelper.createTableFavouriteParkings();
    updateUserAppDetails();
    
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
  
  const logCrashlytics = async () => {
    crashlytics().log("Dummy Details Added");
    await Promise.all([
      crashlytics().setUserId("101"),
      crashlytics().setAttribute("credits", String(50)),
      crashlytics().setAttributes({
        email: "aboutreact11@gmail.com",
        username: "aboutreact11",
      }),
    ]);
  };
  
  const logCrash = async (user) => {
    crashlytics().crash();
  };
  
  const logError = async (user) => {
    crashlytics().log("Updating user count.");
    try {
      if (users) {
        // An empty array is truthy, but not actually true.
        // Therefore the array was never initialised.
        setUserCounts(userCounts.push(users.length));
      }
    } catch (error) {
      crashlytics().recordError(error);
      console.log(error);
    }
  };
  
  
  const removeParkingAreaFromFavourites = (parking) => {
    try{
      if(!parking.id){
        alert('Please unable to get parking area id');
        return;
      }
      if(!parking.uniquePId){
        alert('Please unable to get parking area unique id');
        return;
      }
      dbParkingHelper.removeParkingFromFavourites(parking, isDeleted => {
        if(isDeleted){
          populateFavouriteParkings();
          Toast.show('Parking area '+parking.name+' successfully removed from favourites.', Toast.LONG);
        }else{
          alert('Unable to remove parking area from favourites');
        }
      });
    }catch(err){
      console.log("Error on removing favourite parking", err);
    }
  }
  
  const chooseActionOnFavouriteParking = (item) => {
    Alert.alert(
      'Take action',
      'Choose action on favourite parking',
      [
        {
          text: 'Remove',
          onPress: () => {
            confirmRemoveFavouriteParking(item);
          }
        },
      ],
      { cancelable: true }
      );
    }
    
    const confirmRemoveFavouriteParking = (item) => {
      Alert.alert(
        'Confirm Remove',
        `Are you sure you want to remove  ${item.name} from your favourite parkings?`,
        [
          {
            text: 'Yes',
            onPress: () => {
              removeParkingAreaFromFavourites(item);
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
            props => (
              <BottomSheetBackdrop
              {...props}
              opacity={0.2}
              />
              ),
              []
              );
              
              const handleVehicleNoChange = (val) => {
                setVehicleData({
                  ...vehicle,
                  number: val,
                });
              }
              
              
              const populateVehicleTypes = async() => {
                
                try{

                  const result = await getVehicleCategories();
                  if(result.statusCode == '1'){
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
                  // select * from vehicles
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
                    alert('Please fill vehicle number');
                    return;
                  }
                  if (!vehicle.name) {
                    alert('Please fill vehicle name');
                    return;
                  }
                  if (!vehicle.type) {
                    alert('Please select vehicle type');
                    return;
                  }
                  
                  if(vehicle.number && vehicle.name) {
                    setIsLoading(true);
                    dbVehicleHelper.doesVehicleExist(vehicle, exists => {
                      if(exists){
                        setIsLoading(false);
                        Toast.show('Sorry, vehicle with number '+vehicle.number+' has already been registered.', Toast.LONG);
                      }else{
                        // insert vehicle
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
                    alert('Please fill vehicle id');
                    return;
                  }
                  if (!number) {
                    alert('Please fill vehicle number');
                    return;
                  }
                  if (!name) {
                    alert('Please fill vehicle name');
                    return;
                  }
                  if (!type) {
                    alert('Please select vehicle type');
                    return;
                  }
                  setIsLoading(true);
                  // update vehicle details
                  dbVehicleHelper.updateVehicleDetails(vehicle, isUpdated => {
                    if(isUpdated){
                      setVehicleData({...initialVehicleState});
                      populateVehicles();
                      setIsEditSheetVisible(false);
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
                    alert('Please select vehicle to remove');
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
              
              const cancelEditVehicle = () =>{
                setIsEditSheetVisible(false);
                setVehicleData({...initialVehicleState});
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
              
              
              
              const [visible, setVisible] = useState(false);
              
              const showModal = () => setVisible(true);
              
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
                        setIsEditSheetVisible(true);
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
                  
                  const toggleEditBottomNavigationView = () => {
                    setIsEditSheetVisible(!isEditSheetVisible);
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
                        <View key={item.id} style={{flexDirection: 'row', padding:20}}>
                        <Image
                        source={require('../../assets/images/UberX.jpeg')}
                        style={design.vehicle.image}
                        />
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
                        
                        const renderFavouriteParkings = useCallback(
                          
                          (item) => (
                            <View key={item.id} style={[design.vehicle.container,{padding:10}]}>
                            <Icon name="map-marker" size={30} color="#4F8EF7" />
                            <View style={design.vehicle.middleContainer}>
                            <Text style={design.vehicle.text}>{item.name}</Text>
                            <Text style={design.vehicle.name}>{item.address}</Text>
                            </View>
                            <View style={design.vehicle.rightContainer}>
                            <Pressable onPress={() => chooseActionOnFavouriteParking(item)}>
                            <FontAwesome name={"ellipsis-h"} size={35} style={design.vehicle.ellipsis} />
                            </Pressable>
                            </View>
                            </View>
                            ),[]);
                            
                            
                            const renderHeader = (title) => {
                              return(
                                <View style={styles.bottomSheetHeader}>
                                <View style={styles.panelHeader}>
                                <View style={styles.panelHandle} />
                                <Text style={styles.popupHeaderText}>{title}</Text>
                                </View>
                                </View>
                                );
                              }
                              
                              return (
                                <SafeAreaView style={{flex: 1}}>
                                
                                <FocusAwareStatusBar barStyle="light-content"
                                backgroundColor={colors.primary} />
                                
                                
                                <BrSheet
                                visible={isSheetVisible}
                                onBackButtonPress={toggleBottomNavigationView}
                                onBackdropPress={toggleBottomNavigationView}
                                >
                                
                                <View style={{ flex:1 }}>
                                
                                <View style={styles.iconSection}>
                                <Avatar.Icon icon={icons.uber} size={80} style={{backgroundColor: colors.text}} /> 
                                </View>
                                
                                <View style={styles.addVehicleBodySection}>
                                <View style={{alignItems:'center'}}>
                                <Text style={styles.popupTitle}>Add new vehicle</Text>
                                </View>
                                
                                <View style={styles.inputContainer}>
                                <Text style={styles.label}>Vehicle Number</Text>
                                <TextInput 
                                name="vehicleNumber" 
                                value={vehicle.number}
                                onSubmitEditing={Keyboard.dismiss}
                                onChangeText={(val) => handleVehicleNoChange(val)}   
                                style={styles.input}
                                placeholder={"Enter vehicle number e.g UAA 231Y"}/>
                                </View>
                                
                                <View style={styles.inputContainer}>
                                <Text style={styles.label}>Vehicle Name</Text>
                                <TextInput 
                                name="vehicleName" 
                                value={vehicle.name}
                                onSubmitEditing={Keyboard.dismiss}
                                onChangeText={(val) => handleVehicleNameChange(val)}
                                style={styles.input}
                                placeholder={"Enter vehicle name e.g Primo, Jeep, Benz etc"}/>
                                </View>
                                
                                <View style={styles.inputContainer}>
                                <Text style={styles.label}>Vehicle Type</Text>
                                <Dropdown
                                defaultIndex={0}
                                options={vehicleTypes}
                                style={styles.vehiclesDropdown}
                                defaultValue={"Select Vehicle Type"}
                                defaultTextStyle={{fontSize:18}}
                                textStyle={{fontSize:18}}
                                onSelect={(index, value) => handleVehicleTypeChange(value)}
                                renderRow={(option) => (
                                  <Text style={styles.vehiclesDropdownOption}>{option}</Text>
                                  )}
                                  />
                                  </View>
                                  
                                  <View>
                                  <TouchableOpacity style={styles.submitVehicleBtn} onPress={()=> registerVehicle() }>
                                  {isLoading ?
                                    <UIActivityIndicator color='white' size={30} /> :
                                    <Text style={{color:design.colors.white, marginLeft:10, textTransform:'uppercase'}}>
                                    Submit  <FontAwesome name={"arrow-right"} size={10}/></Text>
                                  }
                                  </TouchableOpacity>
                                  
                                  <TouchableOpacity style={styles.cancelBtn} onPress={() => setIsSheetVisible(false)}>
                                  <Text style={{color:design.colors.dark, marginLeft:10, textTransform:'uppercase'}}>
                                  Cancel<FontAwesome name={"times"} size={10}/></Text>
                                  </TouchableOpacity>
                                  </View>
                                  
                                  </View>
                                  
                                  </View>
                                  </BrSheet>
                                  
                                  
                                  <BrSheet
                                  visible={isEditSheetVisible}
                                  onBackButtonPress={toggleEditBottomNavigationView}
                                  onBackdropPress={toggleEditBottomNavigationView}
                                  >
                                  
                                  <View style={{ flex: 3, alignItems: 'center',padding:20, justifyContent: 'center', backgroundColor: design.colors.gray,}}>
                                  <Avatar.Icon icon={icons.uber} style={{backgroundColor:design.colors.white}} /> 
                                  </View>
                                  
                                  
                                  <View style={{ flex: 3, backgroundColor: design.colors.white, padding:20 }}>
                                  <View style={{alignItems:'center'}}>
                                  <Text style={styles.popupTitle}>Edit vehicle details</Text>
                                  </View>
                                  
                                  <View style={styles.inputContainer}>
                                  <Text style={styles.label}>Vehicle Number</Text>
                                  <TextInput 
                                  name="vehicleNumber" 
                                  value={vehicle.number}
                                  onSubmitEditing={Keyboard.dismiss}
                                  onChangeText={(val) => handleVehicleNoChange(val)}   
                                  style={styles.input} placeholder={"Enter vehicle number"}/>
                                  </View>
                                  
                                  <View style={styles.inputContainer}>
                                  <Text style={styles.label}>Vehicle Name</Text>
                                  <TextInput 
                                  name="vehicleName" 
                                  value={vehicle.name}
                                  onSubmitEditing={Keyboard.dismiss}
                                  onChangeText={(val) => handleVehicleNameChange(val)}
                                  style={styles.input} placeholder={"Enter vehicle name"}/>
                                  </View>
                                  
                                  <View style={styles.inputContainer}>
                                  <Text style={styles.label}>Vehicle Type</Text>
                                  <Dropdown
                                  defaultIndex={0}
                                  options={vehicleTypes}
                                  style={styles.vehiclesDropdown}
                                  defaultValue={vehicle.type}
                                  defaultTextStyle={{fontSize:18}}
                                  textStyle={{fontSize:18}}
                                  onSelect={(index, value) => handleVehicleTypeChange(value)}
                                  renderRow={(option) => (
                                    <Text style={styles.vehiclesDropdownOption}>{option}</Text>
                                    )}
                                    />
                                    </View>
                                    
                                    <View>
                                    <TouchableOpacity style={styles.submitVehicleBtn} onPress={ updateVehicle }>
                                    {isLoading ?
                                      <UIActivityIndicator color='white' size={30} /> :
                                      <Text style={{color:design.colors.white, marginLeft:10, textTransform:'uppercase'}}>
                                      Submit  <FontAwesome name={"arrow-right"} size={10}/></Text>
                                    }
                                    </TouchableOpacity>
                                    
                                    <TouchableOpacity style={styles.cancelBtn} onPress={() => cancelEditVehicle() }>
                                    <Text style={{color:design.colors.dark, marginLeft:10, textTransform:'uppercase'}}>
                                    Cancel<FontAwesome name={"times"} size={10}/></Text>
                                    </TouchableOpacity>
                                    </View>
                                    </View>
                                    </BrSheet>
                                    
                                    
                                    <View style={styles.container}>
                                    
                                    
                                    
                                    <View style={{ flex: 1, paddingHorizontal: SIZES.padding, alignItems: "center", justifyContent: "center"}}>
                                    
                                    <View style={{flexDirection: 'column' }}>
                                    
                                    <View style={{flexDirection: 'row', justifyContent: "space-around"}}>
                                    <Text style={{
                                      color: '#fff',
                                      fontSize: 24,
                                      textAlign: 'center',
                                      fontWeight: "bold",
                                    }}>My Wallet      
                                    </Text>
                                    </View>
                                    
                                    
                                    <Text style={{
                                      color: '#fff',
                                      fontSize: 28,
                                      padding: 15,
                                      textAlign: 'center',
                                      fontWeight: "bold",
                                    }}>{CURRENCY} {profile.account_balance }</Text>
                                    </View>
                                    </View>
                                    
                                    
                                    <View style={{ flex: 3, backgroundColor:design.colors.white, 
                                      borderTopLeftRadius:25, borderTopRightRadius:25 }}>
                                      
                                      <View style={{ padding:10,  borderColor:design.colors.primary}}>
                                      
                                      <Text style={{fontSize:18, textAlign:'center', fontWeight:'bold',
                                      color: design.colors.parksmart, opacity:0.8}}>Quick Actions</Text>
                                      <View style={{ flexDirection: 'row',  marginTop:30, paddingHorizontal: SIZES.base }}>
                                      
                                      <OptionItem
                                      icon={icons.parking}
                                      bgColor={['#fff', '#fff']}
                                      label="Parkings"
                                      tintColor={colors.icon}
                                      borderRadius={5}
                                      onPress={() => props.navigation.navigate("ParkingAreas") }
                                      />
                                      
                                      <OptionItem
                                      icon={icons.myparkings}
                                      bgColor={['#fff', '#fff']}
                                      label="Favourites"
                                      borderRadius={5}
                                      tintColor={colors.icon}
                                      onPress={() => openFavouritesSheet(1)}
                                      />
                                      
                                      
                                      <OptionItem
                                      icon={icons.uber}
                                      bgColor={['#fff', '#fff']}
                                      label="My Vehicles"
                                      borderRadius={5}
                                      tintColor={colors.icon}
                                      onPress={() => openVehiclesSheet(1)}
                                      />
                                      
                                      
                                      </View>
                                      
                                      <View style={{flexDirection: 'row', marginTop: SIZES.radius, 
                                      paddingHorizontal: SIZES.base }}>
                                      
                                      <OptionItem
                                      icon={icons.request}
                                      bgColor={['#fff', '#fff']}
                                      label="Close parkings"
                                      borderRadius={5}
                                      tintColor={colors.icon}
                                      onPress={() => props.navigation.navigate("Map")}
                                      />
                                      
                                      
                                      
                                      <OptionItem
                                      icon={icons.topup}
                                      bgColor={['#fff', '#fff']}
                                      label="Deposit"
                                      borderRadius={5}
                                      tintColor={colors.icon}
                                      onPress={() => props.navigation.navigate("TopUp")}
                                      />
                                      
                                      <OptionItem
                                      icon={icons.statement}
                                      bgColor={['#fff', '#fff']}
                                      label="Transactions"
                                      borderRadius={5}
                                      tintColor={colors.icon}
                                      onPress={() => props.navigation.navigate("PaymentHistory") }
                                      />
                                      </View>
                                      </View>
                                      </View>
                                      
                                      
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
                                        <Text style={styles.text}>No any favourite parkings added yet.</Text>
                                        </View>
                                      }
                                      </BottomSheetScrollView>
                                      
                                      
                                      <TouchableOpacity style={styles.bottomSheetButton} 
                                      onPress={() => props.navigation.navigate("ParkingAreas") }>
                                      <Text style={design.vehicle.textAdd}>add favourite parking</Text>
                                      </TouchableOpacity>
                                      
                                      </BottomSheet>
                                      
                                      </View>
                                      </SafeAreaView>
                                      );
                                    };
                                    
                                    export default HomeScreen;
                                    
                                    const makeStyles =  (colors) => StyleSheet.create({
                                      
                                      container: {
                                        flex: 1,
                                        backgroundColor: colors.primary,
                                      },
                                      
                                      uploadOptions:{
                                        flexDirection: 'column', 
                                        justifyContent: 'center',
                                        alignItems: 'center'
                                      },
                                      
                                      shadow: {
                                        shadowColor: "#000",
                                        shadowOffset: {
                                          width: 0,
                                          height: 2,
                                        },
                                        shadowOpacity: 0.25,
                                        shadowRadius: 3.84,
                                        elevation: 5,
                                      },
                                      
                                      
                                      SheetContentContainer: {
                                        backgroundColor: 'white',
                                        padding: 16,
                                        paddingTop:0,
                                        // height:'auto',
                                      },
                                      
                                      contentContainer: {
                                        flex: 1,
                                        alignItems: 'center',
                                      },
                                      
                                      card:{
                                        flex:1,
                                      },
                                      
                                      input: {
                                        backgroundColor: '#ffffff',
                                        borderRadius: 3,
                                        padding:10,
                                        borderWidth: 0.5,
                                        borderColor:design.colors.primary,
                                        fontSize:16,
                                      },
                                      
                                      airtimeInput: {
                                        backgroundColor: '#ffffff',
                                        borderRadius: 3,
                                        padding:15,
                                        borderWidth: 0.5,
                                        borderColor:design.colors.primary,
                                        width: '100%',
                                      },
                                      
                                      button: {
                                        borderRadius: 20,
                                        padding: 10,
                                        elevation: 2
                                      },
                                      
                                      
                                      textStyle: {
                                        color: "white",
                                        fontWeight: "bold",
                                        textAlign: "center"
                                      },
                                      
                                      divider:{
                                        borderBottomColor: '#e2e2e2',
                                        borderBottomWidth: 1,
                                        marginTop:20
                                      },
                                      
                                      cardContainer:{
                                        flexDirection: "row",
                                        textAlign:'center',
                                        flexWrap: 'wrap',
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
                                      
                                      inputContainer:{
                                        padding:10,
                                      },
                                      
                                      scrollView: {
                                        flex: 1, 
                                      },
                                      
                                      bottomSheetContainer:{
                                        flex: 1,
                                        padding: 24,
                                        justifyContent: 'center',
                                        backgroundColor: 'grey',
                                      },
                                      
                                      footer:{
                                        marginBottom: 30,
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        alignSelf: 'center',
                                        justifyContent: 'center',
                                        
                                      },
                                      
                                      vehiclesDropdown: {
                                        borderRadius: theme.SIZES.base / 2,
                                        borderColor: theme.COLORS.overlay,
                                        borderWidth: 1,
                                        padding: theme.SIZES.base*1.3,
                                        width:350,
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        fontSize: theme.SIZES.font*0.95,
                                      },
                                      
                                      vehiclesDropdownOption: {
                                        padding: 5,
                                        fontSize: 18,
                                      },
                                      indicator: {
                                        position: "absolute",
                                        width: 10,
                                        height: 4,
                                        backgroundColor: "#999",
                                      },
                                      
                                      customBottomSheetHeader: {
                                        alignContent: "center",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        backgroundColor: "white",
                                        paddingVertical: 14,
                                        borderBottomWidth: 1,
                                        borderBottomColor: "#fff",
                                      },
                                      
                                      bottomSheetHeader: {
                                        backgroundColor: '#FFFFFF',
                                        shadowColor: '#333333',
                                        borderTopLeftRadius: 20,
                                        borderTopRightRadius: 20,
                                      },
                                      
                                      panelHeader: {
                                        alignItems: 'center',
                                      },
                                      
                                      panelHandle: {
                                        width: 40,
                                        height: 8,
                                        borderRadius: 4,
                                        backgroundColor: '#999',
                                        marginTop: 8,
                                        marginBottom: 10,
                                        
                                      },
                                      
                                      panel: {
                                        backgroundColor: '#FFFFFF',
                                      },
                                      
                                      panelTitle: {
                                        fontSize: 22,
                                        height: 35,
                                      },
                                      
                                      panelSubtitle: {
                                        fontSize: 14,
                                        color: 'gray',
                                        height: 30,
                                        marginBottom: 10,
                                      },
                                      
                                      morePanel:{
                                        backgroundColor: '#fff',
                                        padding:30,
                                        margin:20,
                                        borderRadius:5,
                                        borderColor: design.colors.orange,
                                        borderWidth:1,
                                        flexDirection: 'row',
                                        justifyContent: 'space-between',
                                        alignContent:'center',
                                        alignItems: 'center'
                                      },
                                      
                                      moreText: {
                                        fontSize: 16,
                                        fontWeight: 'bold',
                                        opacity: 0.6,
                                      },
                                      
                                      label: {
                                        fontSize:16,
                                      },
                                      
                                      popupTitle: {
                                        padding:10, 
                                        fontSize: 18,
                                        textTransform:'uppercase',
                                        fontWeight:'bold'
                                      },
                                      
                                      popupHeaderText: {
                                        padding:10, 
                                        fontSize: 19,
                                        textTransform:'capitalize',
                                        fontWeight:'bold'
                                      },
                                      
                                      text: {
                                        fontSize: 18,
                                        textAlign: 'center',
                                      },
                                      
                                      iconSection: {
                                        flex: 1,
                                        alignItems: 'center',
                                        padding:20, 
                                        justifyContent: 'center',
                                        backgroundColor: colors.primary
                                      },
                                      
                                      addVehicleBodySection:{
                                        flex: 5, 
                                        backgroundColor: design.colors.white,
                                        padding:20 
                                      },
                                      
                                      cancelBtn: {
                                        flexDirection: 'row', 
                                        borderWidth:1,
                                        marginLeft:10,
                                        marginRight:10,
                                        marginBottom:20,
                                        padding:15,
                                        borderRadius:50,
                                        borderColor:design.colors.primary,
                                        justifyContent: 'center', bottom:0, 
                                        backgroundColor:design.colors.white
                                      },
                                      
                                      submitVehicleBtn: {
                                        flexDirection: 'row', 
                                        marginLeft:10,
                                        marginRight:10,
                                        marginBottom:20,
                                        marginTop:15,
                                        padding:15,
                                        borderRadius:50,
                                        borderRadius:50,
                                        justifyContent: 'center', bottom:0,
                                        backgroundColor: colors.primary
                                      }
                                      
                                      
                                      
                                      
                                    });
                                    
                                    
                                    