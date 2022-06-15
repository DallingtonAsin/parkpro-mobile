import React,{useEffect, useState, useContext, useRef} from 'react';
import { StyleSheet, Text, View,Button,Pressable,
  ScrollView, FlatList, Dimensions,Platform,
  TouchableOpacity, TouchableWithoutFeedback, 
  PermissionsAndroid, Alert, Image} from 'react-native';
  import Toast from 'react-native-simple-toast';
  import MapView, { Marker, Callout, PROVIDER_GOOGLE } from 'react-native-maps';
  import * as theme from '../../assets/theme';
  import design from '../../assets/css/styles';
  import Modal from 'react-native-modal';
  import ModalDropdown  from 'react-native-modal-dropdown';
  import Geolocation from 'react-native-geolocation-service';
  import FontAwesome from 'react-native-vector-icons/FontAwesome';
  import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
  import { HeaderBackButton} from '@react-navigation/stack'
  import ProfileContext from '../context/index';
  import { AuthContext } from '../context/context';
  import {  icons, mapStyles } from '../../constants';
  // import Location from 'expo-location';
  import * as Location from 'expo-location';
  // import { Constants, Location, Permissions } from 'expo';
  import Geocoder from 'react-native-geocoding';
  import {CURRENCY} from '@env';
  import { UIActivityIndicator } from 'react-native-indicators';
  import DateTimePickerModal from "react-native-modal-datetime-picker";
  import {callHelpLine} from '../components/SharedCommons';
  import RequestScreen from '../screens/RequestScreen';
  import DropDownPicker from 'react-native-dropdown-picker';
  import { openDatabase } from 'react-native-sqlite-storage';
  import FocusAwareStatusBar  from '../components/common/FocusAwareStatusBar';
  import { useTheme } from '@react-navigation/native';
  import {MAP_API_KEY} from '@env';
  
  
  const db = openDatabase({ name: 'Customers.db' });
  const dbVehicleHelper = require("../database/vehicles");
  
  const {height, width} = Dimensions.get('screen');
  const LATITUDE_DELTA = 0.0922; 
  const LONGITUDE_DELTA =  LATITUDE_DELTA + (width / height);
  Geocoder.init(MAP_API_KEY);
  
  const deviceWidth = Dimensions.get("window").width;
  const deviceHeight = Dimensions.get("window").height;
  const availableHours = [0, 1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24];
  
  const initialState = {
    hours:{},
    selectedVehicle: '',
    startTime: '',
    endTime: '',
    
    start_time: '',
    end_time: '',
    diff_hours : 0,
    total_amount: 0,
    active:null,
    activeModal:null,
  }
  
  const mapInitialState =
  {
    location: null,
    currentPosition: {  
      latitude:0.353550,
      longitude:32.618591,
      latitudeDelta:0.0122,
      longitudeDelta:0.0621 
    },
    markerCoords: {
      latitude: 0,   
      longitude: 0, 
    },
    destination: {  
      latitude: 0,   
      longitude: 0,  
    },
    active:null,
    activeModal:null,
  }
  
  const MapScreen = (props) => {
    
    const [state, setState] = useState(initialState);
    const [region, setRegion] = useState(mapInitialState);
    const { profile } = useContext(ProfileContext);
    const [vehicles, setVehicleState] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isLoadingParkings, setIsLoadingParkings] = useState(true);
    const [isReqProcessing, setIsReqProcessing] = useState(false);
    const [currentAddress, setCurrentAddress] = useState('Kampala, Uganda');
    const [nearByParkings, setNearByParkings] = useState([]);
    const [carType, setCarType] = useState();
    const [carTypes, setCarTypes] = useState();
    
    const [startTime, setStartTime] = useState(null);
    const [endTime, setEndTime] = useState(null);
    const [start_time, setStartHourTime] = useState(null);
    const [end_time, setEndHourTime] = useState(null);
    const [amount, setAmount] = useState("0");
    const { colors } = useTheme();
    const styles = makeStyles(colors);
    
    const [locationServiceEnabled, setLocationServiceEnabled] = useState(false);
    const [displayCurrentAddress, setDisplayCurrentAddress] = useState('fetching your location...');
    
    
    const {getParkingAreas, getVehicleCategories, submitParkingRequest} = React.useContext(AuthContext);
    
    const [isStartTimePickerVisible, setStartTimePickerVisibility] = useState(false);
    const [isEndTimePickerVisible, setEndTimePickerVisibility] = useState(false);
    
    
    const CheckIfLocationEnabled = async () => {
      let enabled = await Location.hasServicesEnabledAsync();
      
      if (!enabled) {
        Alert.alert(
          'Location Service not enabled',
          'Please enable your location services to continue',
          [{ text: 'OK' }],
          { cancelable: false }
          );
        } else {
          setLocationServiceEnabled(enabled);
        }
      };
      
      const GetCurrentLocation = async () => {
        const granted = await PermissionsAndroid.check( PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION );
        console.log("Permission status", granted);
        
        if (!granted) {
          Alert.alert(
            'Permission not granted',
            'Allow the app to use location service.',
            [{ text: 'OK' }],
            { cancelable: false }
            );
          }
          
          let { coords } = await Location.getCurrentPositionAsync({ enableHighAccuracy: false });
          console.log("Your coords", coords);
          
          if (coords) {
            const { latitude, longitude } = coords;
            let response = await Location.reverseGeocodeAsync({
              latitude,
              longitude
            });
            
            for (let item of response) {
              let address = `${item.name}, ${item.street}, ${item.postalCode}, ${item.city}`;
              
              setDisplayCurrentAddress(address);
            }
          }
        };
        
        
        const getTime = (selectedDate) => {
          let currentDate = selectedDate || date;
          let hours = currentDate.getHours();
          let minutes = currentDate.getMinutes(); // + ":" + currentDate.getSeconds();
          hours  = hours > 9 ? hours : '0'+hours; 
          minutes  = minutes > 9 ? minutes : '0'+minutes; 
          var ampm = hours >= 12 ? 'PM' : 'AM';
          let time = hours + ":" + minutes;
          let timex = hours + ":" + minutes + " " + ampm;
          return time; 
        }
        
        const showStartTimePicker = () => {
          setStartTimePickerVisibility(true);
        };
        
        const hideStartTimePicker = () => {
          setStartTimePickerVisibility(false);
        };
        
        const showEndTimePicker = () => {
          setEndTimePickerVisibility(true);
        };
        
        const hideEndTimePicker = () => {
          setEndTimePickerVisibility(false);
        };
        
        
        const handleConfirmStartTime = (selectedStartTime) => {
          let start_hour_time = getTime(selectedStartTime);
          if(endTime){
            if(start_hour_time < endTime){
              setStartTime(start_hour_time);
              setStartHourTime(selectedStartTime);
              if(end_time){
                calculateAmount(selectedStartTime, end_time);
              }
            }else{
              Alert.alert("Message", "Start time must be less than end time");
            }
          }else{
            setStartTime(start_hour_time);
            setStartHourTime(selectedStartTime);  
            if(end_time){
              calculateAmount(selectedStartTime, end_time);
            }
          }
          hideStartTimePicker();
        };
        
        
        const handleConfirmEndTime = (selectedEndTime) => {
          let end_hour_time = getTime(selectedEndTime);
          if(startTime){
            if(end_hour_time > startTime){
              setEndTime(end_hour_time);
              setEndHourTime(selectedEndTime);
              if(start_time){
                calculateAmount(start_time, selectedEndTime);
              }
            }else{
              Alert.alert("Message", "End time must be greater than start time");
            }
          }else{
            setEndTime(end_hour_time);
            setEndHourTime(selectedEndTime); 
            
            if(start_time){
              calculateAmount(start_time, selectedEndTime);
            }
          }
          
          console.warn("End time has been picked: ", end_hour_time);
          hideEndTimePicker();
        };
        
        
        const diff_hours = (dt2, dt1) => {
          var diff = Math.abs(new Date(dt2) - new Date(dt1));
          var minutes = Math.floor((diff/1000)/60);
          var hours = minutes/60;
          hours = Math.round(hours * 10) / 10
          return hours;
        }
        
        
        const calculateAmount = (startTime, endTime, selectedCarType= "") => {
          
          if(selectedCarType){
            ResetAmount(selectedCarType);
          }else{
            const { activeModal } = state;
            let res = diff_hours(endTime, startTime);
            console.log("Diff in hours", res);
            console.log("Fees per hour", activeModal.fees[`${carType}`]);
            let total = res*activeModal.fees[`${carType}`];
            setState({
              ...state,
              diff_hours: res,
              total_amount: total,
            });
            total = numberWithCommas(total);
            setAmount(total);
          }
          
        }
        
        const ResetAmount = (selectedCarType) =>{
          const {activeModal, diff_hours} = state;
          console.log("Fees per hour", activeModal.fees[`${selectedCarType}`]);
          let value = diff_hours*activeModal.fees[`${selectedCarType}`];
          value = numberWithCommas(value);
          setAmount(value);
        }
        
        
        
        const requestLocationPermission = async () => {
          const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION, {
            title: "Allow permissions to access your current location",
            message:
            "Enable location",
            buttonNeutral: "Not Right Now!",
            buttonNegative: "Cancel",
            buttonPositive: "OK"
          } );
          
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            Geolocation.getCurrentPosition(
              (position) => {
                
                // console.log("Got position: ", position);
                
                let lat = parseFloat(position.coords.latitude);
                let long = parseFloat(position.coords.longitude);
                
                setRegion({
                  ...region,
                  latitude: lat,
                  longitude: long,
                  
                  currentPosition: {  
                    latitude: lat,   
                    longitude: long,  
                    latitudeDelta: LATITUDE_DELTA,
                    longitudeDelta: LONGITUDE_DELTA,
                  },
                  
                  markerCoords:{
                    latitude: lat,
                    longitude: long,
                  },
                  
                  
                  destination: {  
                    latitude: lat-0.3,   
                    longitude: long-0.3,  
                  },
                  
                  
                });
                
                Geocoder.from(position.coords.latitude, position.coords.longitude)
                .then(json => {
                  //  console.log("Response from Geocoder", json);
                  var addressComponent = json.results[0].address_components;
                  setCurrentAddress(addressComponent);
                  // console.log("Your current location", addressComponent);
                })
                .catch(error => console.warn(error));
                
                
                
                // console.log("Marker region", region.markerCoords);
              },
              (error) => {
                // console.log(error.code, error.message);
              },
              { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
              );
            }
            
          }
          
          function numberWithCommas(x) {
            return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
          }
          
          
          const handleVehicle = (selectedItem) => {
            
            const vehicleDetailsArr = selectedItem.split("-");
            const VName = vehicleDetailsArr[0].trim();
            const VNumber = vehicleDetailsArr[1].trim();
            
            dbVehicleHelper.searchVehicle(VNumber, VName, async result => {
              console.log("Here are vehicle details 1", result);
              console.log("Got this vehicle number 1", result.number);
              console.log("Got this vehicle name 1", result.name);
              console.log("Got this vehicle type 1", result.type);
              const vehicleType = result.type;
              setState({
                ...state,
                selectedVehicle: selectedItem,
                setCarType: vehicleType
              });
              
              if(start_time && end_time){
                calculateAmount(start_time, end_time);
                ResetAmount(vehicleType);
              }
              
            });
            
          }
          
          
          const submitRequest = async() => {
            

            try{

            const { activeModal } = state;
            console.log("Here is your active modal data", activeModal);
            console.log("Here is your active modal fees", activeModal.fees);
            
            const parking_area_id = activeModal.id;
            const customer_id = profile.id;
            const telephone_no = `${profile.country_code}${profile.phone_number}`;
            const vehicle_details = state.selectedVehicle;
            //   let account_balance = profile.account_balance.replace(/,/g, '');
            
            let balance = 9000000; // parseFloat(account_balance);
            const total_amount =parseFloat(state.total_amount);
            console.log("Balance: " + balance);
            console.log("Total amount: " + total_amount);
            console.log("Selected vehicle", vehicle_details);
            
            
            
            if (!parking_area_id) {
              Toast.show('Please select parking', Toast.LONG);
              return;
            }
            
            if (!telephone_no) {
              Toast.show('Unable to capture your phone number', Toast.LONG);
              return;
            }
            
            if (!vehicle_details) {
              Toast.show('Please select your vehicle details', Toast.LONG);
              return;
            }
            
            if (!carType) {
              Toast.show('Please select your vehicle type', Toast.LONG);
              return;
            }
            
            if (!startTime) {
              Toast.show('Please select your booking period (start time)', Toast.LONG);
              return;
            }
            
            if (!endTime) {
              Toast.show('Please select your booking period (end time)', Toast.LONG);
              return;
            }
            
            if (startTime > endTime) {
              Toast.show('Start time cannot be greater than end time', Toast.LONG);
              return;
            }
            
            if (!customer_id) {
              Toast.show('Unable to get your id', Toast.LONG);
              return;
            }
            
            if(balance < total_amount){
              Toast.show('You have insufficient account balance to send this parking request.', Toast.LONG);
              return;
            }
            
            
            if(customer_id && parking_area_id && telephone_no && vehicle_details
              && carType && startTime && endTime) {
                
                
                
                const vehicleDetailsArr = vehicle_details.split("-");
                const VName = vehicleDetailsArr[0].trim();
                const VNumber = vehicleDetailsArr[1].trim();
                
                console.log("Vehicle name", VName);
                console.log("Vehicle number", VNumber);
                
                if(VName && VNumber){
                  dbVehicleHelper.searchVehicle(VNumber, VName, async result => {
                    console.log("Here are vehicle details", result);
                    console.log("Got this vehicle number", result.number);
                    console.log("Got this vehicle name", result.name);
                    console.log("Got this vehicle type", result.type);
                    const vehicleType = result.type;
                    
                    const reqParams = {
                      customer_id: customer_id,
                      parking_area_id: parking_area_id,
                      telephone_no: telephone_no,
                      vehicle_details: vehicle_details,
                      vehicle_category: vehicleType,
                      start_time: startTime,
                      end_time: endTime
                    }
                    
                    console.log("Request data", reqParams);
                    setIsReqProcessing(true);
                    
                    const resp = await submitParkingRequest(reqParams);
                    console.log("Resp", resp);
                    
                    if(resp.statusCode == 1){
                      setStartTime('');
                      setEndTime('');
                      setAmount("0");
                      Toast.show(resp.message, Toast.LONG);
                    }else{
                      Toast.show(resp.message, Toast.LONG);
                    }
                    setIsReqProcessing(true);
                    
                  });
                  
                }else{
                  Toast.show("Unable to capture your vehicle details", Toast.LONG);
                }
                
                
                
              }else{
                Toast.show("Please supply all the information", Toast.LONG);
                
              }
              
            }catch(err){
              Toast.show(err.message, Toast.LONG);
            }

            setIsReqProcessing(false);

            }
            
            
            
            
            const fetchNearByParkings = async() => {
              
              try{
                const resp = await getParkingAreas();
                if(resp.statusCode == 1){
                  const near_parking_places = resp.data;
                  if(near_parking_places.length > 0) {
                    setNearByParkings(near_parking_places);
                  }
                }else{
                  Toast.show(resp.message, Toast.LONG);
                }
              }catch(err){
                Toast.show(err.message, Toast.LONG);
              }
              setIsLoadingParkings(false);
            }
            
            const fetchVehicleCategories = async() => {
              
              try{
                
                const result = await getVehicleCategories();
                const vehicle_categories = result.data; 
                console.log("Response", vehicle_categories);
                
                let types = [];
                
                for(let i = 0; i < vehicle_categories.length; i++) {
                  let name = vehicle_categories[i]['name'];
                  types.push(name);
                }
                
                if(types.length > 0){
                  setCarType(types[0]);
                }
                // console.log("Vehicle Types", JSON.stringify(types));
                if(types.length > 0) {
                  setCarTypes(types);
                }
              }catch(err){
                Toast.show(err.message, Toast.LONG);
              }
            }
            
            useEffect(() => {
              requestLocationPermission();
              CheckIfLocationEnabled();
              GetCurrentLocation();
              populateHours();
              populateVehicles();
              fetchVehicleCategories();
              fetchNearByParkings();
              
            }, []);
            
            
            
            const handleStartTime = (value) => {
              let start_time;
              (value < 9) ? start_time = `0` + value + ":00" : value + ":00";
              console.log("Start time", start_time);
              
              setState({
                ...state,
                startTime: start_time
              });
            }
            
            const handleEndTime = (value) => {
              let end_time;
              end_time = (value < 9) ?  `0`+value+":00" : value + ":00";
              console.log("End time", end_time);
              setState({
                ...state,
                endTime: end_time
              });
            }
            
            
            const  renderHeader = () => {
              return(
                <View style={styles.header}>
                <View style={{flex:1, justifyContent:'flex-start'}}>
                <HeaderBackButton tintColor={theme.COLORS.black} onPress={() => props.navigation.goBack(null)} />
                {/* <Text style={styles.headerTitle}>Scroll down to view more nearby parking areas</Text> */}
                </View>
                <View style={{flex:1, justifyContent:'center', alignItems:"flex-end"}}>
                <Text style={styles.headerTitle}>Your Current Location</Text>
                <Text style={styles.headerLocation}>{displayCurrentAddress}
                
                </Text>
                </View>
                </View>
                )
              }
              
              const getDirections = () => {
                Alert.alert("Message", "Coming soon...");
              }
              
              
              const renderParking = (item) => {
                const { hours }  = state;
                const totalPrice = item.fees[`${carType}`] * availableHours[1];
                
                return (
                  <TouchableWithoutFeedback key={`parking-${item.id}`} 
                  onPress={() => { 
                    setState({...state, active: item.id });
                    setIsModalVisible(!isModalVisible);
                    
                  }} >
                  <View style={[styles.parking, styles.shadow]}>
                  
                  <View style={styles.hours}>
                  <Text style={styles.hoursTitle}>x {item.spots} {item.name}</Text>
                  <View >
                  
                  <TouchableOpacity style={styles.directionsBtn} onPress={() => getDirections()}>
                  <Image
                  source={icons.geo}
                  resizeMode="cover"
                  style={{
                    tintColor: '#ffa500',
                    width: 25,
                    height: 25,
                  }}
                  />
                  <Text style={styles.directionsText}>
                  Directions
                  </Text>
                  <FontAwesome name='angle-right' size={theme.SIZES.icon*1.75} color={'#ffa500'} />
                  </TouchableOpacity>
                  </View>
                  </View>
                  <View style={styles.parkingInfoContainer}>
                  <View style={styles.parkingInfo}>
                  <View style={styles.parkingIcon}>
                  <FontAwesome name='tag' size={theme.SIZES.icon} color={theme.COLORS.gray}  />
                  <Text style={{ marginLeft: theme.SIZES.base }}> 
                  {item.fees[`${carType}`]}
                  </Text>
                  </View>
                  <View style={styles.parkingIcon}>
                  <FontAwesome name='star' size={theme.SIZES.icon} color={theme.COLORS.gray} />
                  <Text style={{ marginLeft: theme.SIZES.base }}> {item.rating}</Text>
                  </View>
                  </View>
                  <TouchableOpacity style={styles.buy} onPress={() => {
                    setState({...state, activeModal: item });
                    setIsModalVisible(!isModalVisible);
                  }}>
                  <View style={styles.buyTotal}>
                  
                  <View style={{flex:1, flexDirection: 'row', alignItems: 'center' }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Text style={[styles.buyTotalPrice, {fontSize: 15}]}>Request parking</Text>
                  </View>
                  
                  <View style={styles.buyBtn}>
                  <FontAwesome name='angle-right' size={theme.SIZES.icon * 1.75} color={theme.COLORS.white} />
                  </View>
                  
                  </View>
                  
                  
                  
                  </View>
                  
                  </TouchableOpacity>
                  </View>
                  
                  </View>
                  </TouchableWithoutFeedback>
                  )
                }
                
                const renderParkings = () => {
                  return ( 
                    <FlatList
                    horizontal={true} 
                    vertical={false}
                    pagingEnabled
                    scrollEnabled={true}
                    showsVerticalScrollIndicator={false}
                    showsHorizontalScrollIndicator={false}
                    scrollEventThrottle={16}
                    snapToAlignment="center"
                    style={styles.parkings}
                    data={nearByParkings}
                    extraData={state}
                    keyExtractor={(item, index) => `${item.id}`}
                    renderItem={({ item }) => renderParking(item)}
                    />
                    )
                  }
                  
                  const populateHours = () =>{
                    setState({
                      ...state,
                      hours: availableHours
                    });
                  }
                  
                  
                  const populateVehicles = () =>{
                    db.transaction((tx) => {
                      tx.executeSql(
                        'SELECT * FROM vehicles',
                        [],
                        (tx, results) => {
                          var temp = [];
                          for (let i = 0; i < results.rows.length; ++i){
                            temp.push(results.rows.item(i));
                          }
                          
                          myvehicles = [];
                          for (let i = 0; i < temp.length; ++i){
                            myvehicles.push(`${temp[i]['name']} - ${temp[i]['number']}`); // : ${temp[i]['name']}
                          }
                          if(myvehicles.length > 0){
                            setState({
                              ...state,
                              selectedVehicle: myvehicles[0],
                            });
                          }
                          setVehicleState(myvehicles);
                        }
                        );
                      });
                    }
                    
                    const renderVehicles = () => {
                      return (
                        <ModalDropdown 
                        defaultIndex={0}
                        options={vehicles}
                        style={styles.vehiclesDropdown}
                        defaultValue={vehicles.length > 0 ? vehicles[0] : "select vehicle"}
                        defaultTextStyle={{fontSize:16}}
                        textStyle={{fontSize:16}}
                        onSelect={(index, value) => handleVehicle(value)}
                        renderRow={(option) => (
                          <Text style={styles.hoursDropdownOption}>{option}</Text>
                          )}
                          />
                          )
                        }
                        
                        const closeModelOnSwipe = () => {
                          setIsModalVisible(false);
                          setState({...state, activeModal:null});
                        }
                        
                        const openOrderInfoModal = (item) =>{
                          setState({...state, activeModal: item });
                          setIsModalVisible(!isModalVisible);
                        }
                        
                        const renderModal = () => {
                          const {activeModal, hours} = state;
                          
                          if (!activeModal) return null;
                          return  <Modal 
                          backdropColor={theme.COLORS.overlay}
                          style={styles.modalContainer}
                          isVisible={isModalVisible}
                          deviceWidth={deviceWidth}
                          deviceHeight={deviceHeight}
                          useNativeDriver
                          onBackButtonPress={()=>setState({...state, activeModal:null})}
                          onBackdropPress={()=>setState({...state, activeModal:null})} 
                          swipeDirection="down"
                          propagateSwipe
                          onSwipeComplete={()=> closeModelOnSwipe() }
                          >
                          <ScrollView contentContainerStyle={styles.modal}>
                          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                          <View>
                          <Text style={{fontSize: theme.SIZES.font *1.4}}>
                          {activeModal.name}
                          </Text>
                          </View>
                          <View>
                          <TouchableOpacity onPress={() => {
                            setIsModalVisible(false)
                          }}>
                          <FontAwesome name='times' size={30} color={theme.COLORS.gray}/>
                          </TouchableOpacity>
                          </View>
                          </View>
                          
                          <View style={{paddingVertical:theme.SIZES.base}}>
                          <Text style={{color:theme.COLORS.gray, fontSize:theme.SIZES.font*1.2}}>
                          {activeModal.description}
                          </Text>
                          </View>
                          
                          <View style={styles.modalInfo1}>
                          
                          <View style={{ flexDirection: 'column'}}>
                          
                          
                          <View style={{flexDirection: 'row', justifyContent: 'space-evenly'}}>
                          <View style={[styles.parkingIcon,  ]}>
                          <FontAwesome name='clock-o' size={theme.SIZES.icon*1.3} color={theme.COLORS.orange} style={{paddingTop:5}}/>
                          {
                            activeModal.is_open
                            ? <Text style={{fontSize:theme.SIZES.icon*1.05, color: 'green', opacity:0.6}}> Open</Text>
                            :  <Text style={{fontSize:theme.SIZES.icon*1.05, color: 'red', opacity:0.6}}> Closed</Text>
                            
                          }
                          </View> 
                          <View style={[styles.parkingIcon, ]}>
                          <FontAwesome name='star' size={theme.SIZES.icon*1.5} color={theme.COLORS.orange} style={{paddingTop:5}}/>
                          <Text style={{fontSize:theme.SIZES.icon*1.15}}> {activeModal.rating}</Text>
                          </View>
                          </View>
                          
                          <View style={{flexDirection: 'row',  justifyContent: 'space-evenly'}}>
                          <View style={[styles.parkingIcon,  ]}>
                          <FontAwesome name='road' size={theme.SIZES.icon*1.3} color={theme.COLORS.orange} style={{paddingTop:5}}/>
                          <Text style={{fontSize:theme.SIZES.icon*1.05}}> {activeModal.distance}km</Text>
                          </View>
                          <View style={[styles.parkingIcon, {paddingLeft:10} ]}>
                          <FontAwesome name='car' size={theme.SIZES.icon*1.3} color={theme.COLORS.orange} style={{paddingTop:5}}/>
                          <Text style={{fontSize:theme.SIZES.icon*1.05}}> {activeModal.free}/{activeModal.spots}</Text>
                          </View>
                          </View>
                          
                          
                          </View>
                          
                          
                          <View>
                          <TouchableOpacity style={styles.callBtn} onPress={() =>  callHelpLine(activeModal.phone_number)}>
                          <FontAwesome5 name="phone-alt" size={18} color={design.colors.gray}/>
                          <Text style={{fontSize:16, paddingLeft:10, color:design.colors.gray}}>Call Now</Text>
                          </TouchableOpacity>
                          </View>
                          </View>
                          <View>
                          
                          <View style={{marginTop:10}}>
                          <Text style={{fontSize: 16, fontWeight:'bold', opacity:0.6, color:'#000', textTransform:'capitalize'}}>ORDER REQUEST INFORMATION</Text>
                          </View>
                          
                          
                          <View style={styles.orderInfo}>
                          <Text style={{color:theme.COLORS.gray, fontSize:theme.SIZES.font*1.1}}>Vehicle</Text>
                          <View style={styles.modalVehiclesDropdown}>
                          {renderVehicles()}
                          <Text style={{color:theme.COLORS.gray}}></Text>
                          </View>
                          </View>
                          
                          <View style={{flexDirection: 'column'}}>
                          
                          <View style={[styles.orderInfo, {flexDirection: 'row'}]}>
                          <Text style={{color:theme.COLORS.gray, fontSize:theme.SIZES.font*1.1}}>Start Time</Text>
                          <Text style={{color:theme.COLORS.gray, fontSize:theme.SIZES.font*1.1, fontWeight:'bold'}}>{startTime}</Text>
                          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                          <View style={styles.modalVehiclesDropdown}>
                          <View  style={{width:110}}>
                          <Button title="select" onPress={showStartTimePicker} color={design.colors.gray}/>
                          </View>
                          <DateTimePickerModal
                          isVisible={isStartTimePickerVisible}
                          mode="time"
                          onConfirm={handleConfirmStartTime}
                          onCancel={hideStartTimePicker}
                          />
                          </View>
                          
                          </View>
                          </View>
                          
                          
                          <View style={[styles.orderInfo, {flexDirection: 'row'}]}>
                          <Text style={{color:theme.COLORS.gray, fontSize:theme.SIZES.font*1.1}}>End Time</Text>
                          <Text style={{color:theme.COLORS.gray, fontSize:theme.SIZES.font*1.1, fontWeight:'bold'}}>{endTime}</Text>
                          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                          <View style={[styles.modalVehiclesDropdown, {marginLeft:10 }]}>
                          <View  style={{width:110}}>
                          <Button title="select" onPress={showEndTimePicker} color={design.colors.gray} />
                          </View>
                          <DateTimePickerModal
                          isVisible={isEndTimePickerVisible}
                          mode="time"
                          onConfirm={handleConfirmEndTime}
                          onCancel={hideEndTimePicker}
                          />
                          </View>
                          
                          </View>
                          </View>
                          
                          </View>
                          
                          <View style={styles.orderInfo}>
                          <Text style={{color:theme.COLORS.gray, fontSize:theme.SIZES.font*1.1}}>Amount</Text>
                          <Text style={{color:theme.COLORS.gray, fontSize:theme.SIZES.icon*1.15}}>
                          {CURRENCY}. {amount} 
                          </Text>
                          {/*  {activeModal.fees[`${carType}`]} */}
                          </View>
                          
                          
                          </View>
                          
                          
                          <TouchableOpacity style={[styles.payBtn,
                            activeModal.is_open ? {backgroundColor: colors.primary}: {backgroundColor: theme.COLORS.gray}]} 
                            disabled={activeModal.is_open ? false : true}
                            onPress={() => submitRequest()}
                            >  
                            <Text style={styles.payText}> 
                            {isReqProcessing ? 
                              <UIActivityIndicator color='#fff' size={25}/> : 'Submit Request' }
                              </Text>
                              <FontAwesome name='angle-right' size={theme.SIZES.icon*1.75} color={theme.COLORS.white} style={{marginLeft:10}} />
                              </TouchableOpacity> 
                              
                              </ScrollView>
                              </Modal>
                              // <RequestScreen activeModal={activeModal} vehiclesList={vehicles} isVisible={isModalVisible}/>
                              
                            }
                            // const {currentPosition, parkings} = props;
                            return(
                              <View style={styles.container}>
                              <FocusAwareStatusBar barStyle="dark-content" 
                              backgroundColor={colors.primary} />
                              
                              {renderHeader()}
                              <MapView 
                              initialRegion={region.currentPosition}
                              style={styles.map}
                              // customMapStyle={mapStyles.brownStyle}
                              minZoomLevel={15.5}
                              maxZoomLevel={19}
                              showsUserLocation={true}
                              
                              >
                              
                              <Marker 
                              key={`current-location-marker`}
                              coordinate={region.markerCoords}
                              title={'Current Location'}
                              description={`Your current location`}
                              >
                              <FontAwesome name='map-marker' size={theme.SIZES.icon*2.5} color={theme.COLORS.orange}/> 
                              <FontAwesome name='car' size={theme.SIZES.icon*1.8} color={theme.COLORS.orange}/> 
                              
                              </Marker>
                              
                              {
                                nearByParkings.length > 0 ?
                                nearByParkings.map(parking =>(
                                  <Marker 
                                  key={`marker-${parking.id}`}
                                  coordinate={parking.coordinate}
                                  title={parking.name}
                                  description={parking.description}
                                  onPress={()=> openOrderInfoModal(parking)}
                                  >
                                  <TouchableWithoutFeedback onLongPress={()=> openOrderInfoModal(parking)} >
                                  <View style={[
                                    styles.marker,
                                    styles.shadow, 
                                    state.active === parking.id ? styles.active: null
                                  ]}>
                                  <Text style={[styles.markerStatus, {fontSize:9}]}>{CURRENCY} </Text>
                                  <Text style={styles.markerPrice}>{parking.fees[`${carType}`]}</Text>
                                  <Text style={[styles.markerStatus, {fontSize:11}]}>({parking.free}/{parking.spots})</Text>
                                  </View>
                                  </TouchableWithoutFeedback>
                                  </Marker>
                                  ))
                                  : null
                                }
                                </MapView>
                                
                                
                                {
                                  !isLoadingParkings? 
                                  renderParkings()
                                  :  <View style={[styles.parking, styles.shadow, {flexDirection: 'column',
                                  justifyContent:'center', alignItems: 'center',padding: 30}]}>
                                  <UIActivityIndicator color='#FFA500' size={30} />
                                  <Text style={{fontSize:18, color: '#C0C0C0', margin:15}}>Searching...</Text>
                                  </View>
                                }
                                
                                
                                {renderModal()}
                                </View>
                                )
                                
                              }
                              MapScreen.defaultProps={
                                currentPosition:{
                                  latitude:0.353550,
                                  longitude:32.618591,
                                  latitudeDelta:0.0122,
                                  longitudeDelta:0.0121
                                },
                              }
                              
                              export default MapScreen;
                              
                              
                              const makeStyles = (colors) => StyleSheet.create({
                                container: {
                                  flex: 1,
                                  backgroundColor: theme.COLORS.white,
                                },
                                header: {
                                  flexDirection: 'row',
                                  justifyContent: 'center',
                                  paddingHorizontal: theme.SIZES.base * 2,
                                  paddingTop: theme.SIZES.base * 1.0,
                                  paddingBottom: theme.SIZES.base * 1.5,
                                  height: Dimensions.get('screen').height*0.08,
                                },
                                headerTitle: {
                                  color: theme.COLORS.gray,
                                },
                                headerLocation: {
                                  fontSize: theme.SIZES.font,
                                  fontWeight: '500',
                                  paddingVertical: theme.SIZES.base / 3,
                                },
                                map: {
                                  flex: 3,
                                },
                                parkings: {
                                  position: 'absolute',
                                  right: 0,
                                  left: 0,
                                  bottom: 0,
                                  paddingBottom: theme.SIZES.base * 2,
                                },
                                parking: {
                                  flexDirection: 'row',
                                  backgroundColor: theme.COLORS.white,
                                  borderRadius: 6,
                                  padding: theme.SIZES.base,
                                  marginHorizontal: theme.SIZES.base * 2,
                                  width: width - (24 * 2),
                                },
                                buy: {
                                  flex: 1,
                                  flexDirection: 'row',
                                  paddingHorizontal: theme.SIZES.base * 1.5,
                                  paddingVertical: theme.SIZES.base,
                                  backgroundColor: colors.primary,
                                  borderRadius: 6,
                                },
                                buyTotal: {
                                  flex: 1,
                                  justifyContent: 'space-evenly',
                                },
                                buyTotalPrice: {
                                  color: theme.COLORS.white,
                                  fontSize: theme.SIZES.base * 2,
                                  fontWeight: '600',
                                  paddingLeft: theme.SIZES.base / 4,
                                },
                                buyBtn: {
                                  flex: 1,
                                  justifyContent: 'center',
                                  alignItems: 'flex-end',
                                },
                                marker: {
                                  flexDirection: 'row',
                                  backgroundColor: theme.COLORS.white,
                                  borderRadius: theme.SIZES.base * 2,
                                  paddingVertical: 12,
                                  paddingHorizontal: theme.SIZES.base * 2,
                                  borderWidth: 1,
                                  borderColor: theme.COLORS.white,
                                },
                                markerPrice: { color: theme.COLORS.red, fontWeight: 'bold', },
                                markerStatus: { color: theme.COLORS.gray },
                                shadow: {
                                  shadowColor: theme.COLORS.black,
                                  shadowOffset: {
                                    width: 0,
                                    height: 6,
                                  },
                                  shadowOpacity: 0.1,
                                  shadowRadius: 4,
                                },
                                active: {
                                  borderColor: theme.COLORS.red,
                                },
                                hours: {
                                  flex: 1,
                                  flexDirection: 'column',
                                  marginLeft: theme.SIZES.base / 2,
                                  justifyContent: 'space-evenly',
                                },
                                hoursTitle: {
                                  fontSize: 18,
                                  fontWeight: '500',
                                },
                                hoursDropdown: {
                                  borderRadius: theme.SIZES.base / 2,
                                  borderColor: theme.COLORS.overlay,
                                  borderWidth: 1,
                                  padding: theme.SIZES.base,
                                  marginRight: theme.SIZES.base / 2,
                                  fontSize: theme.SIZES.font*0.95,
                                },
                                vehiclesDropdown: {
                                  borderRadius: theme.SIZES.base / 2,
                                  borderColor: theme.COLORS.overlay,
                                  borderWidth: 1,
                                  padding: theme.SIZES.base*1.3,
                                  width:220,
                                  justifyContent: 'center',
                                  alignItems: 'center',
                                  fontSize: theme.SIZES.font*0.95,
                                },
                                carsDropdown: {
                                  borderRadius: theme.SIZES.base / 2,
                                  borderColor: theme.COLORS.overlay,
                                  borderWidth: 1,
                                  padding: theme.SIZES.base*1.3,
                                  width:220,
                                  justifyContent: 'center',
                                  alignItems: 'center',
                                },
                                hoursDropdownOption: {
                                  padding: 5,
                                  fontSize: 18,
                                },
                                hoursDropdownStyle: {
                                  marginLeft: -theme.SIZES.base,
                                  paddingHorizontal: theme.SIZES.base / 2,
                                  marginVertical: -(theme.SIZES.base + 1),
                                },
                                parkingInfoContainer: { flex: 1.5, flexDirection: 'row' },
                                parkingInfo: {
                                  justifyContent: 'space-evenly',
                                  marginHorizontal: theme.SIZES.base*1.5,
                                },
                                parkingIcon: {
                                  flexDirection: 'row',
                                  justifyContent: 'space-between',
                                },
                                modalContainer: {
                                  margin: 0,
                                  justifyContent: 'flex-end',
                                },
                                modal: {
                                  flexDirection: 'column',
                                  height: '100%',
                                  padding: theme.SIZES.base * 2,
                                  backgroundColor: theme.COLORS.white,
                                  borderTopLeftRadius: theme.SIZES.base,
                                  borderTopRightRadius: theme.SIZES.base,
                                },
                                
                                
                                
                                
                                modalInfo: {
                                  flexDirection: 'row',
                                  justifyContent: 'space-evenly',
                                  paddingVertical: theme.SIZES.base,
                                  borderTopWidth: 1,
                                  borderBottomWidth: 1,
                                  borderTopColor: theme.COLORS.overlay,
                                  borderBottomColor: theme.COLORS.overlay,
                                },
                                
                                modalInfo1: {
                                  flexDirection: 'row',
                                  justifyContent: 'space-around',
                                  paddingVertical: theme.SIZES.base,
                                },
                                
                                
                                orderInfo:{
                                  flexDirection: 'row',
                                  justifyContent: 'space-between',
                                  paddingVertical: theme.SIZES.base*1.5,
                                  borderTopWidth: 0.7,
                                  
                                  
                                  
                                },
                                modalHours: {
                                  paddingVertical: height * 0.11,
                                  
                                },
                                modalHoursDropdown: {
                                  flexDirection: 'row',
                                  justifyContent: 'center',
                                  alignItems: 'center',
                                  paddingVertical: theme.SIZES.base,
                                },
                                modalVehiclesDropdown: {
                                  flexDirection: 'row',
                                  justifyContent: 'center',
                                  alignItems: 'center',
                                  // paddingVertical: theme.SIZES.base,
                                },
                                payBtn: {
                                  // borderRadius: 6,
                                  // flexDirection: 'row',
                                  // alignItems: 'center',
                                  // justifyContent: 'space-around',
                                  // padding: theme.SIZES.base * 1.1,
                                  // fontWeight:'bold',
                                  // bottom: 0,
                                  // marginBottom: 30,
                                  
                                  color: '#fff',
                                  borderRadius:6,
                                  flexDirection: 'row',
                                  backgroundColor: '#273746',
                                  borderColor: '#273746',
                                  position: 'absolute',
                                  bottom: 0,
                                  width: '100%',
                                  justifyContent: 'center',
                                  alignItems: 'center',
                                  padding: theme.SIZES.base * 1.1,
                                  fontWeight: 'bold',
                                  margin: 30,
                                  
                                },
                                payText: {
                                  fontWeight: '600',
                                  fontSize: theme.SIZES.base * 1.5,
                                  color: theme.COLORS.white,
                                  textAlign: 'center',
                                },
                                directionsText: {
                                  fontWeight: '200',
                                  fontSize: theme.SIZES.base * 1.25,
                                  color: '#000', // theme.COLORS.white,
                                  fontWeight: 'bold',
                                  opacity:0.7,
                                },
                                directionsBtn: {
                                  borderRadius: 8,
                                  flexDirection: 'row',
                                  alignItems: 'center',
                                  justifyContent: 'space-between',
                                  padding: 8,
                                  backgroundColor: '#fff', // theme.COLORS.primary,
                                  fontWeight:'bold',
                                  borderColor: '#ffa500',
                                  borderWidth:1,
                                  // marginBottom: 30,
                                },
                                dropdown1BtnStyle: {
                                  width: "80%",
                                  height: 50,
                                  backgroundColor: "#FFF",
                                  borderRadius: 8,
                                  borderWidth: 1,
                                  borderColor: "#444",
                                },
                                dropdown1BtnTxtStyle: { color: "#444", textAlign: "left" },
                                dropdown1DropdownStyle: { backgroundColor: "#EFEFEF" },
                                dropdown1RowStyle: {
                                  backgroundColor: "#EFEFEF",
                                  borderBottomColor: "#C5C5C5",
                                },
                                setTimeBtn: {
                                  backgroundColor: design.colors.success,
                                  alignItems: 'center',
                                  padding:10,
                                  borderRadius:40, 
                                },
                                callBtn:{
                                  flexDirection: 'row',
                                  height:45,
                                  borderWidth:1,
                                  borderRadius:30,
                                  borderColor: design.colors.gray,
                                  backgroundColor: design.colors.white,
                                  justifyContent: 'center',
                                  alignItems: 'center',
                                  width:'70%',
                                  marginLeft:30,
                                },
                                dropdown1RowTxtStyle: { color: "#444", textAlign: "left" },
                                
                              });
