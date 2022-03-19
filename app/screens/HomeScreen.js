import React, {useState, useEffect, useMemo, useRef, useContext, useCallback} from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  Image,
  Text,
  TouchableOpacity,
  FlatList,
  ImageBackground,StatusBar,
  TouchableHighlight,TextInput,
  Dimensions,Button,
  SafeAreaView,Keyboard,
  Alert, Pressable,
} from 'react-native';
import { icons, SIZES } from '../../constants';
import OptionItem from '../components/OptionItem';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Animated from 'react-native-reanimated';
// import BottomSheet   from 'reanimated-bottom-sheet';
import { BottomSheet as BrSheet } from 'react-native-btr';
import { Avatar, Divider, Portal  } from 'react-native-paper';
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

const dbVehicleHelper = require("../database/vehicles")

const initialUserState = {
  user_id: '',
  name: '',
  firstname: '',
  lastname: '',
  phoneNo: '',
  email: '',
  account_balance: '',
  image: '',
}

const initialVehicleState= {
  id: '',
  number: '',
  name: '',
  type: '',
}

const HomeScreen = props => {
  
  // ref
  const vehicleBottomSheetRef = useRef(0);
  const buyAirtimeBottomSheetRef = useRef(0);
  
  const favouritesBottomSheetRef = useRef(0);
  
  
  // variables
  const snapPoints = useMemo(() => ['25%', '70%'], []);
  const airtimeSnapPoints = useMemo(() => ['25%', '50%'], []);
  
  
  const handleSheetChanges = useCallback((index) => {
    console.log('handleSheetChanges', index);
  }, []);
  
  
  
  const openVehiclesSheet = useCallback((index) => {
    vehicleBottomSheetRef.current?.snapToIndex(index);
  }, []);
  
  const openCloseBuyAirtimeSheet = useCallback((index) => {
    buyAirtimeBottomSheetRef.current?.snapToIndex(index);
  }, []);
  
  const handleCloseAirtimeSheet = () => buyAirtimeBottomSheetRef.current?.close()
  
  const openFavouritesSheet = useCallback((index) => {
    favouritesBottomSheetRef.current?.snapToIndex(index);
  }, []);
  
  const [state, setData] = useState(initialUserState);
  const [isSheetVisible, setIsSheetVisible] = useState(false);
  const [isEditSheetVisible, setIsEditSheetVisible] = useState(false);
  
  
  const {profile, setProfile} = useContext(ProfileContext);
  const { getParkingAreas, getVehicleCategories, loadAirtimeCredit, syncProfileData } = React.useContext(AuthContext);
  
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingAirtime, setIsLoadingAirtime] = useState(false);
  
  const [isParkingsLoading, setIsParkingsLoading] = useState(true);
  
  
  const [vehicles, setVehicleState] = useState({});
  const [vehicle, setVehicleData] = React.useState(initialVehicleState);
  const [nearByParkings, setNearByParkings] = useState([]);
  const [vehicleTypes, setVehicleTypes] = useState([]);
  
  const [airtimeAmount, setAirtimeAmount] =useState(0);
  
  const loadAirtime = async() => {
    
    const airtime = parseFloat(airtimeAmount);
    minAirtimeAmount = parseFloat(MIN_AIRTIME_AMOUNT);
    maxAirtimeAmount = parseFloat(MAX_AIRTIME_AMOUNT);
    
    if(!airtime){
      Alert.alert("Message", "Please enter airtime amount to load.")
    }
    if(airtime){
      if(airtime < minAirtimeAmount || airtime > maxAirtimeAmount){
        Alert.alert("Message", "Please enter airtime amount not less than "+minAirtimeAmount+" and not greater than "+maxAirtimeAmount+".")
      }
      if(airtime >= minAirtimeAmount && airtime <= maxAirtimeAmount){
        const data = {
          id: profile.id,
          phone_number: profile.phone_number,
          amount: airtime
        }
        setIsLoadingAirtime(true);
        const response = await loadAirtimeCredit(data);
        console.log("Response from loading airtime", response);
        const statusCode = response.statusCode;
        const message = response.message;
        if(statusCode == 1){
          const customer = response.data;
          setProfile(customer);
          await syncProfileData(customer);
          setAirtimeAmount(0);
          handleCloseAirtimeSheet();
          Toast.show(message, Toast.LONG);
        }else{
          Alert.alert("Message", message);
        }
        setIsLoadingAirtime(false);
      }
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
          
          useEffect(() => {
            // create table vehicles if it doesn't exist
            dbVehicleHelper.createVehiclesTable();
          }, []);
          
          
          useEffect(() => {
            fetchParkings();
            populateVehicles();
            populateVehicleTypes();
          }, []);
          
          const populateVehicleTypes = async() => {
            const data = await getVehicleCategories();
            const vehicle_types = [];
            for(let i=0; i<data.length; i++) {
              vehicle_types.push(data[i]['name']);
            }
            console.log("Vehicle types in db", vehicle_types);
            setVehicleTypes(vehicle_types);
          }
          
          
          const populateVehicles = () =>{
            try{
              // select * from vehicles
              dbVehicleHelper.getVehicles(vehicles => {
                console.log("Got this vehicles list", vehicles);
                if(vehicles){
                  setVehicleState(vehicles);
                }
              });
            }catch(error){
              Toast.show(error.message);
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
                  console.log("Exists vehicle response", exists);
                  if(exists){
                    setIsLoading(false);
                    Toast.show('Sorry, vehicle with number '+vehicle.number+' has already been registered.', Toast.LONG);
                  }else{
                    // insert vehicle
                    dbVehicleHelper.insertVehicle(vehicle, isInserted => {
                      console.log("Insert vehicle response", isInserted);
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
            }catch(error){
              Toast.show(error.message);
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
                console.log("Update vehicle response", isUpdated);
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
              
            }catch(error){
              Toast.show(error.message);
            }
            
          };
          
          
          const deleteVehicle = (VehicleId) => {
            try{
              if(!VehicleId){
                alert('Please select vehicle to remove');
                return;
              }
              // delete vehicle 
              dbVehicleHelper.deleteVehicle(VehicleId, isDeleted => {
                console.log("Delete vehicle response", isDeleted);
                if(isDeleted){
                  populateVehicles();
                  Toast.show('Vehicle removed successfully', Toast.LONG);
                }else{
                  alert('Unable to remove vehicle');
                }
              });
            }catch(error){
              Toast.show(error.message);
            }
            
            
            
          };
          
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
          
          
          const fetchParkings = async() => {
            const parkings = await getParkingAreas();
            if(parkings.length > 0) {
              setNearByParkings(parkings);
              setIsParkingsLoading(false);
            }
            
          }
          
          
          const [visible, setVisible] = useState(false);
          
          const showModal = () => setVisible(true);
          
          
          const getVehicleNo = (item) => {
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
                
                const VehicleComponent = (item) => (
                  <View style={[design.vehicle.container,{padding:3}]}>
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
                  <Pressable onPress={() => getVehicleNo(item) }>
                  <FontAwesome name={"ellipsis-h"} size={28} style={design.vehicle.ellipsis} />
                  </Pressable>
                  </View>
                  
                  </View>
                  )
                  
                  const parkingsComponent = (item) => (
                    <View style={[design.vehicle.container,{padding:10}]}>
                    
                    <Icon name="map-marker" size={30} color="#4F8EF7" />
                    
                    <View style={design.vehicle.middleContainer}>
                    <Text style={design.vehicle.text}>{item.name}</Text>
                    <Text style={design.vehicle.name}>{item.address}</Text>
                    </View>
                    
                    <View style={design.vehicle.rightContainer}>
                    <Pressable>
                    <FontAwesome name={"ellipsis-h"} size={20} style={design.vehicle.ellipsis} />
                    </Pressable>
                    </View>
                    
                    
                    </View>
                    )
                    
                    
                    const renderHeader = (title) => {
                      return(
                        <View style={styles.bottomSheetHeader}>
                        <View style={styles.panelHeader}>
                        <View style={styles.panelHandle} />
                        <Text style={{fontSize:18, textAlign: 'center', fontWeight: '900', textTransform:'capitalize'}}>{title}</Text>
                        </View>
                        </View>
                        );
                      }
                      
                      return (
                        <ScrollView contentContainerStyle={{flex:1}}>
                        
                        <StatusBar
                        backgroundColor={design.colors.primary}
                        barStyle="light-content"
                        />
                        
                        
                        <BrSheet
                        visible={isSheetVisible}
                        onBackButtonPress={toggleBottomNavigationView}
                        onBackdropPress={toggleBottomNavigationView}
                        >
                        <SafeAreaView>
                        <ScrollView style={styles.panel}>
                        
                        <View style={{ flex: 3, alignItems: 'center',padding:20, justifyContent: 'center', backgroundColor: design.colors.gray,}}>
                        <Avatar.Icon icon={icons.uber} style={{backgroundColor:design.colors.white}} /> 
                        </View>
                        
                        
                        <View style={{ flex: 3, backgroundColor: design.colors.white, padding:20 }}>
                        <View style={{alignItems:'center'}}>
                        <Text style={{ padding:10, fontSize: 18, textTransform:'uppercase',fontWeight:'bold'}}>Add new vehicle</Text>
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
                          <TouchableOpacity style={{
                            flexDirection: 'row', 
                            marginLeft:10,
                            marginRight:10,
                            marginBottom:20,
                            marginTop:15,
                            padding:15,
                            borderRadius:50,
                            borderRadius:50,
                            justifyContent: 'center', bottom:0,
                            backgroundColor:design.colors.primary
                          }} onPress={()=>registerVehicle() }>
                          {isLoading ?
                            <UIActivityIndicator color='white' size={30} /> :
                            <Text style={{color:design.colors.white, marginLeft:10, textTransform:'uppercase'}}>
                            Submit  <FontAwesome name={"arrow-right"} size={10}/></Text>
                          }
                          </TouchableOpacity>
                          
                          <TouchableOpacity style={{flexDirection: 'row', 
                          borderWidth:1,
                          marginLeft:10,
                          marginRight:10,
                          marginBottom:20,
                          padding:15,
                          borderRadius:50,
                          borderColor:design.colors.primary,
                          justifyContent: 'center', bottom:0, 
                          backgroundColor:design.colors.white}} onPress={() => setIsSheetVisible(false)}>
                          <Text style={{color:design.colors.dark, marginLeft:10, textTransform:'uppercase'}}>
                          Cancel<FontAwesome name={"times"} size={10}/></Text>
                          </TouchableOpacity>
                          </View>
                          
                          </View>
                          
                          </ScrollView>
                          </SafeAreaView>
                          </BrSheet>
                          
                          
                          <BrSheet
                          visible={isEditSheetVisible}
                          onBackButtonPress={toggleEditBottomNavigationView}
                          onBackdropPress={toggleEditBottomNavigationView}
                          >
                          <SafeAreaView>
                          <ScrollView style={styles.panel}>
                          
                          <View style={{ flex: 3, alignItems: 'center',padding:20, justifyContent: 'center', backgroundColor: design.colors.gray,}}>
                          <Avatar.Icon icon={icons.uber} style={{backgroundColor:design.colors.white}} /> 
                          </View>
                          
                          
                          <View style={{ flex: 3, backgroundColor: design.colors.white, padding:20 }}>
                          <View style={{alignItems:'center'}}>
                          <Text style={{ padding:10, fontSize: 18, textTransform:'uppercase',fontWeight:'bold'}}>Edit vehicle details</Text>
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
                          defaultIndex={vehicle.id}
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
                            <TouchableOpacity style={{
                              flexDirection: 'row', 
                              marginLeft:10,
                              marginRight:10,
                              marginBottom:20,
                              marginTop:15,
                              padding:15,
                              borderRadius:50,
                              borderRadius:50,
                              justifyContent: 'center', bottom:0,
                              backgroundColor:design.colors.primary
                            }} onPress={ updateVehicle }>
                            {isLoading ?
                              <UIActivityIndicator color='white' size={30} /> :
                              <Text style={{color:design.colors.white, marginLeft:10, textTransform:'uppercase'}}>
                              Submit  <FontAwesome name={"arrow-right"} size={10}/></Text>
                            }
                            </TouchableOpacity>
                            
                            <TouchableOpacity style={{flexDirection: 'row', 
                            borderWidth:1,
                            marginLeft:10,
                            marginRight:10,
                            marginBottom:20,
                            padding:15,
                            borderRadius:50,
                            borderColor:design.colors.primary,
                            justifyContent: 'center', bottom:0, 
                            backgroundColor:design.colors.white}} onPress={() => cancelEditVehicle() }>
                            <Text style={{color:design.colors.dark, marginLeft:10, textTransform:'uppercase'}}>
                            Cancel<FontAwesome name={"times"} size={10}/></Text>
                            </TouchableOpacity>
                            </View>
                            
                            </View>
                            
                            </ScrollView>
                            </SafeAreaView>
                            </BrSheet>
                            
                            
                            <View style={styles.container}>
                            
                            
                            
                            <View style={{ flex: 1, paddingHorizontal: SIZES.padding, alignItems: "center", justifyContent: "center"}}>
                            <View style={{flexDirection: 'column' }}>
                            
                            <View style={{flexDirection: 'row', justifyContent: "space-around"}}>
                            <Text style={{
                              color: '#fff',
                              fontSize: 22,
                              textAlign: 'center',
                              fontWeight: "bold",
                            }}>My Wallet      
                            </Text>
                            {/* <FontAwesome name={"info-circle"} size={20} color={design.colors.white} style={{marginTop:5}}/> */}
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
                              icon={icons.request}
                              bgColor={['#fff', '#fff']}
                              label="Nearby parkings"
                              borderRadius={5}
                              tintColor={design.colors.orange}
                              onPress={() => props.navigation.navigate("Map")}
                              />
                              <OptionItem
                              icon={icons.parking}
                              bgColor={['#fff', '#fff']}
                              label="Place Request"
                              tintColor={design.colors.orange}
                              borderRadius={5}
                              onPress={() => props.navigation.navigate("ParkingAreas") }
                              />
                              
                              <OptionItem
                              icon={icons.uber}
                              bgColor={['#fff', '#fff']}
                              label="My Vehicles"
                              borderRadius={5}
                              tintColor={design.colors.orange}
                              onPress={() => openVehiclesSheet(1)}
                              />
                              
                              
                              </View>
                              
                              <View style={{flexDirection: 'row', marginTop: SIZES.radius, 
                              paddingHorizontal: SIZES.base }}>
                              
                              <OptionItem
                              icon={icons.myparkings}
                              bgColor={['#fff', '#fff']}
                              label="Favourites"
                              borderRadius={5}
                              tintColor={design.colors.orange}
                              onPress={() => openFavouritesSheet(1)}
                              />
                              
                              <OptionItem
                              icon={icons.topup}
                              bgColor={['#fff', '#fff']}
                              label="Top Up"
                              borderRadius={5}
                              tintColor={design.colors.orange}
                              onPress={() => props.navigation.navigate("TopUp")}
                              />
                              
                              <OptionItem
                              icon={icons.statement}
                              bgColor={['#fff', '#fff']}
                              label="Transactions"
                              borderRadius={5}
                              tintColor={design.colors.orange}
                              onPress={() => props.navigation.navigate("PaymentHistory") }
                              />
                              
                              </View>
                              
                              {/* <View style={styles.morePanel}>
                              
                              
                              <TouchableOpacity  onPress={() => openCloseBuyAirtimeSheet(1)} style={{alignContent:'center', alignItems: 'center'}}>
                              <FontAwesome name={"mobile"} size={35} color={design.colors.orange} />
                              <Text style={styles.moreText}>Airtime</Text>
                              </TouchableOpacity>
                              
                              <TouchableOpacity style={{alignContent:'center', alignItems: 'center'}}>
                              <FontAwesome name={"wifi"} size={35} color={design.colors.orange} />
                              <Text style={styles.moreText}>Data</Text>
                              </TouchableOpacity>
                              
                              <TouchableOpacity style={{alignContent:'center', alignItems: 'center'}}>
                              <FontAwesome5 name={"wallet"} size={35}  color={design.colors.orange}/>
                              <Text style={styles.moreText}>Bills</Text>
                              </TouchableOpacity>
                              
                              
                              </View> */}
                              
                              </View>
                              </View>
                              
                              
                              {/* Vehicles List  */}
                              <BottomSheet
                              ref={vehicleBottomSheetRef}
                              index={-1}
                              snapPoints={snapPoints}
                              enablePanDownToClose={true}
                              backdropComponent={renderVehiclesBackdrop}
                              onChange={handleSheetChanges}
                              handleComponent={() => renderHeader("My Vehicles") }
                              >
                              <BottomSheetScrollView contentContainerStyle={styles.contentContainer}>
                              
                              <View style={{flexDirection: 'row'}}>
                              <View style={{flexDirection: 'row', alignItems: 'flex-end'}}>
                              </View>
                              </View>
                              
                              <Divider style={styles.divider}/>
                              <FlatList
                              scrollEnabled={true}
                              vertical={true}
                              data={vehicles}
                              renderItem={({item}) => VehicleComponent(item) }
                              ItemSeparatorComponent = { FlatListItemSeparator }
                              keyExtractor={(item, index) => { return item.number.toString()}}
                              />
                              <Pressable style={styles.bottomSheetButton} onPress={() => {setIsSheetVisible(true)}}>
                              <Text style={{fontSize:14, textAlign: 'center', textTransform:'uppercase'}}>
                              add vehicle
                              </Text>
                              <FontAwesome name={"arrow-right"} size={18} style={design.vehicle.icon} color={"#808080"}/>
                              </Pressable>
                              </BottomSheetScrollView>
                              </BottomSheet>
                              
                              
                              
                              {/* Buy Airtime     */}
                              <BottomSheet
                              ref={buyAirtimeBottomSheetRef}
                              index={-1}
                              snapPoints={airtimeSnapPoints}
                              enablePanDownToClose={true}
                              backdropComponent={renderVehiclesBackdrop}
                              onChange={handleSheetChanges}
                              handleComponent={() => renderHeader("Buy Airtime") }
                              >
                              <BottomSheetScrollView contentContainerStyle={styles.contentContainer}>
                              
                              <View style={{flexDirection: 'row', padding:35}}>
                              <TextInput 
                              name="vehicleNumber" 
                              value={airtimeAmount}
                              onSubmitEditing={Keyboard.dismiss}
                              onChangeText={(val) => setAirtimeAmount(val)}   
                              style={styles.input}
                              keyboardType='numeric'
                              placeholder={"Enter amount to load e.g 50"}/>
                              </View>
                              
                              <TouchableOpacity style={styles.bottomSheetButton} onPress={() => loadAirtime() }>
                              
                              {
                                isLoadingAirtime ? 
                                <UIActivityIndicator color='black' size={27}/> : 
                                <>
                                <Text style={{fontSize:14, textAlign: 'center',
                                textTransform:'uppercase'}}> Continue</Text>
                                <FontAwesome name={"arrow-right"} size={18}
                                style={design.vehicle.icon} color={"#808080"}/>
                                </>
                              }
                              </TouchableOpacity>
                              </BottomSheetScrollView>
                              </BottomSheet>
                              
                              
                              
                              
                              <BottomSheet
                              ref={favouritesBottomSheetRef}
                              index={-1}
                              snapPoints={snapPoints}
                              enablePanDownToClose={true}
                              backdropComponent={renderFavouritesBackdrop}
                              onChange={handleSheetChanges}
                              handleComponent={() => renderHeader("favourite parking areas") }
                              >
                              <BottomSheetScrollView contentContainerStyle={styles.contentContainer}>
                              
                              <View style={styles.SheetContentContainer}>
                              <Divider style={styles.divider}/>
                              
                              <SafeAreaView>
                              <FlatList
                              data={nearByParkings}
                              renderItem={({item}) => parkingsComponent(item) }
                              keyExtractor={(item, index) => { return item.id.toString()}}
                              ItemSeparatorComponent = { FlatListItemSeparator }
                              />
                              </SafeAreaView>
                              
                              <Pressable style={styles.bottomSheetButton} onPress={showModal}>
                              <Text style={design.vehicle.textAdd}>
                              add favourite parking 
                              <FontAwesome name={"arrow-right"} size={10} style={design.vehicle.icon}/>
                              </Text>
                              </Pressable>
                              
                              
                              </View>
                              </BottomSheetScrollView>
                              </BottomSheet>
                              
                              
                              </View>
                              </ScrollView>
                              );
                            };
                            
                            export default HomeScreen;
                            
                            const styles = StyleSheet.create({
                              
                              container: {
                                flex: 1,
                                backgroundColor: design.colors.primary,
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
                                borderWidth:1, 
                                marginTop:15,
                                marginBottom:60,
                                height:60,
                                width:'70%',
                                padding:15,
                                borderRadius:30,
                                borderColor:design.colors.primary,
                                justifyContent: 'center',
                                alignItems: 'center',
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
                                justifyContent: 'space-between', alignContent:'center',
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
                              
                              
                              
                              
                              
                              
                              
                              
                            });
                            
                            
                            