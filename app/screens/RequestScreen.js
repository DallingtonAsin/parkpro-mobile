import React,{useEffect, useState, useContext, useRef} from 'react';
import { StyleSheet, Text, View,Button,Pressable,
  ScrollView, FlatList, Dimensions,Platform,
  TouchableOpacity, TouchableWithoutFeedback, 
  PermissionsAndroid, Alert, Image} from 'react-native';
  import MapView, { Marker, Callout, PROVIDER_GOOGLE } from 'react-native-maps';
  import * as theme from '../../assets/theme';
  import design from '../../assets/css/styles';
  import Modal from 'react-native-modal';
  import Dropdown from 'react-native-modal-dropdown';
  import Geolocation from 'react-native-geolocation-service';
  import FontAwesome from 'react-native-vector-icons/FontAwesome';
  import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
  import { HeaderBackButton} from '@react-navigation/stack'
  import ProfileContext from '../context/index';
  import { AuthContext } from '../context/context';
  import { openDatabase } from 'react-native-sqlite-storage';
  import {  icons, mapStyles } from '../../constants';
  import Location from 'expo-location';
  import Geocoder from 'react-native-geocoding';
  import {currency} from '@env';
  import { UIActivityIndicator } from 'react-native-indicators';
  import DateTimePickerModal from "react-native-modal-datetime-picker";
  import {callHelpLine} from '../components/SharedCommons';
  import DropDownPicker from 'react-native-dropdown-picker';
  import Toast from 'react-native-simple-toast';
  
  
  const initialState = {
    hours:{},
    selectedVehicle: '',
    startTime: '',
    endTime: '',
    
    start_time: '',
    end_time: '',
    diff_hours : 0,
    total_amount: 0,
  }
  
  const mapInitialState =
  {
    location: null,
    currentPosition: {  
      latitude:0.353550,
      longitude:32.618591,
      latitudeDelta:0.0122,
      longitudeDelta:0.0121 
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
  
  const {height, width} = Dimensions.get('screen');
  const LATITUDE_DELTA = 0.0922 
  const LONGITUDE_DELTA =  LATITUDE_DELTA + (width / height);
  var db = openDatabase({ name: 'Customers.db' });
  Geocoder.init("AIzaSyCBrtM8sRgDkCkfe5eBq-P20qlVghWbYDc");
  
  const deviceWidth = Dimensions.get("window").width;
  const deviceHeight = Dimensions.get("window").height;
  const availableHours = [0, 1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24];
  
  
  
  const RequestScreen = ({activeModal, vehiclesList, isVisible}) => {
    
    const visible = isVisible;
    const [state, setState] = useState(initialState);
    const [region, setRegion] = useState(mapInitialState);
    const { profile } = useContext(ProfileContext);
    const [vehicles, setVehicleState] = useState(vehiclesList);
    const [isModalVisible, setIsModalVisible] = useState(visible);
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
    
    
    const {getVehicleCategories, submitParkingRequest} = React.useContext(AuthContext);
    
    const [isStartTimePickerVisible, setStartTimePickerVisibility] = useState(false);
    const [isEndTimePickerVisible, setEndTimePickerVisibility] = useState(false);
    
    const closeModelOnSwipe = () => {
      setIsModalVisible(false);
      setState({...state, activeModal:null});
    }
    
    useEffect(() => {
      
      fetchVehicleCategories();
      populateHours();
      populateVehicles();
      
      // fetchNearByParkings();
      // requestLocationPermission();
      
    }, []);
    
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
      
      const fetchVehicleCategories = async() => {
        try{
          
          const vehicle_categories = await getVehicleCategories();
          let types = [];
          for(let i = 0; i < vehicle_categories.length; i++) {
            let name = vehicle_categories[i]['name'];
            types.push(name);
          }
          
          if(types.length > 0){
            setCarType(types[0]);
          }
          if(types.length > 0) {
            setCarTypes(types);
          }
        }catch(err){
          Toast.show(err.message, Toast.LONG);
          
        }
      }
      
      
      const submitRequest = async() => {
        
        try{
          
          const parking_area_id = activeModal.id;
          const customer_id = profile.id;
          const telephone_no = profile.phone_number;
          const vehicle_details = state.selectedVehicle;
          let account_balance = profile.account_balance.replace(/,/g, '');
          let balance =  parseFloat(account_balance);
          const total_amount =parseFloat(state.total_amount);
          console.log("Balance: " + account_balance);
          console.log("Total amount: " + total_amount);
          
          if (!parking_area_id) {
            alert('Please select parking');
            return;
          }
          
          if (!telephone_no) {
            alert('Unable to capture your phone number');
            return;
          }
          
          if (!vehicle_details) {
            alert('Please select your vehicle details');
            return;
          }
          
          if (!carType) {
            alert('Please select your vehicle type');
            return;
          }
          
          if (!startTime) {
            alert('Please select your booking period (start time)');
            return;
          }
          
          if (!endTime) {
            alert('Please select your booking period (end time)');
            return;
          }
          
          if (startTime > endTime) {
            alert('Start time cannot be greater than end time');
            return;
          }
          
          if (!customer_id) {
            alert('Unable to get your id');
            return;
          }
          
          if(balance < total_amount){
            Alert.alert('Message', 'You have insufficient account balance to submit parking order.');
            return;
          }
          
          
          if(customer_id && parking_area_id && telephone_no && vehicle_details
            && carType && startTime && endTime) {
              let reqParams = {
                customer_id: customer_id,
                parking_area_id: parking_area_id,
                telephone_no: telephone_no,
                vehicle_details: vehicle_details,
                vehicle_category: carType,
                start_time: startTime,
                end_time: endTime
              }
              setIsReqProcessing(true);
              let resp = await submitParkingRequest(reqParams);
              if(resp.statusCode == 1){
                setStartTime('');
                setEndTime('');
                Alert.alert("Success", resp.message);
              }else{
                Alert.alert("Error", resp.message);
              }
              setIsReqProcessing(false);
            }else{
              Alert.alert("Error", "Please supply all the information");
              
            }
            
          }catch(err){
            Toast.show(err.message, Toast.LONG);
            
          }
        }
        
        const renderCarTypes = () => {
          return (
            
            <Dropdown
            defaultIndex={0}
            options={carTypes}
            style={styles.carsDropdown}
            defaultValue={"Select vehicle type"}
            defaultTextStyle={{fontSize:18}}
            textStyle={{fontSize:18}}
            onSelect={(index, value) => onChangeCarType(value)}
            renderRow={(option) => (
              <Text style={styles.hoursDropdownOption}>{option}</Text>
              )}
              />
              )
            }
            
            const renderVehicles = () => {
              return (
                
                <Dropdown
                defaultIndex={0}
                options={vehicles}
                style={styles.vehiclesDropdown}
                defaultValue={"Select Vehicle"}
                defaultTextStyle={{fontSize:16}}
                textStyle={{fontSize:16}}
                onSelect={(index, value) => handleVehicle(value)}
                renderRow={(option) => (
                  <Text style={styles.hoursDropdownOption}>{option}</Text>
                  )}
                  />
                  )
                }
                
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
                
                const handleVehicle = (selectedItem) => {
                  setState({
                    ...state,
                    selectedVehicle: selectedItem,
                  });
                }
                
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
                
                
                const calculateAmount = (startTime, endTime) => {
                  
                  let res = diff_hours(endTime, startTime);
                  let total = res*activeModal.fees[`${carType}`];
                  setState({
                    ...state,
                    diff_hours: res,
                    total_amount: total,
                  });
                  console.log("Diff in hours", res);
                  activeModal.fees[`${carType}`] = total;
                }
                
                //   const ResetAmount = () =>{
                //     const {activeModal, diff_hours} = state;
                //     activeModal.fees[`${carType}`] = diff_hours*activeModal.fees[`${carType}`];
                //   }
                
                
                if (!activeModal) return null;
                return(
                  <Modal 
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
                    isVisible = false;
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
                  <FontAwesome5 name="phone-alt" size={18} color={design.colors.white}/>
                  <Text style={{fontSize:16, paddingLeft:10, color:design.colors.white}}>Call Now</Text>
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
                  <Button title="Start time" onPress={showStartTimePicker} color={design.colors.primary}/>
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
                  <Button title="End time" onPress={showEndTimePicker} color={design.colors.primary} />
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
                  {currency}.{activeModal.fees[`${carType}`]}
                  </Text>
                  </View>
                  
                  
                  </View>
                  
                  
                  <TouchableOpacity style={[styles.payBtn,
                    activeModal.is_open ? {backgroundColor: theme.COLORS.primary}: {backgroundColor: 'gray'}]} 
                    disabled={activeModal.is_open ? false : true}
                    onPress={() => submitRequest()}
                    >  
                    <Text style={styles.payText}> 
                    {isReqProcessing ? <UIActivityIndicator color='#fff' size={25}/> : 'Submit Request' }
                    </Text>
                    <FontAwesome name='angle-right' size={theme.SIZES.icon*1.75} color={theme.COLORS.white} />
                    </TouchableOpacity> 
                    
                    </ScrollView>
                    </Modal>
                    )
                  }
                  
                  
                  export default RequestScreen;
                  
                  const styles = StyleSheet.create({
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
                      backgroundColor: theme.COLORS.primary,
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
                      fontSize: theme.SIZES.text,
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
                      borderRadius: 6,
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-around',
                      padding: theme.SIZES.base * 1.1,
                      fontWeight:'bold',
                      // marginBottom: 30,
                    },
                    payText: {
                      fontWeight: '600',
                      fontSize: theme.SIZES.base * 1.5,
                      color: theme.COLORS.white,
                      textAlign: 'center',
                    },
                    directionsText: {
                      fontWeight: '200',
                      fontSize: theme.SIZES.base * 1.15,
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
                      borderColor: design.colors.success,
                      backgroundColor: design.colors.success,
                      justifyContent: 'center',
                      alignItems: 'center',
                      width:'70%',
                      marginLeft:30,
                    },
                    
                    dropdown1RowTxtStyle: { color: "#444", textAlign: "left" },
                    
                    
                    
                  });