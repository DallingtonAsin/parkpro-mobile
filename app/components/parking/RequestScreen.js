import React,{useEffect, useState, useContext} from 'react';
import { StyleSheet, Text, View, Button, ScrollView, Dimensions, TouchableOpacity, Alert} from 'react-native';
import Modal from 'react-native-modal';
import * as theme from '../../../assets/theme';
import design from '../../../assets/css/styles';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import Toast from 'react-native-simple-toast';
import { useTheme } from '@react-navigation/native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { openDatabase } from 'react-native-sqlite-storage';
import ProfileContext from '../../context';
import { AuthContext } from '../../context/context';
import { UIActivityIndicator } from 'react-native-indicators';
import {CURRENCY} from '@env';
import { get12HrClockTime , get24HrClockTime, numberWithCommas, diff_hours} from '../sharedHelper/AppUtils';
import { SelectDropDown } from '../common/SelectDropdown';

const db = openDatabase({ name: 'Customers.db' });
const dbVehicleHelper = require("../../database/vehicles");
const _  = require('lodash');


export const RequestScreen = ({item, open, onClose}) => {
  
  const initialState = {
        hours: {},
        startTime: '',
        endTime: '',
        start_time: '',
        end_time: '',
        active: null
  }

  const { profile } = useContext(ProfileContext);
  const { getVehicleCategories, submitParkingRequest} = React.useContext(AuthContext);
  
  const [state, setState] = useState(initialState);
  const [selectedVehicle, setSelectedVehicle] = useState('');
  
  const { colors } = useTheme();
  const styles = makeStyles(colors);
  
  const { fees, name, description, is_open } = item;
  
  let modalRef;
  const openModal = () => modalRef.show();
  const saveModalRef = ref => modalRef = ref;
  const onSelectedOption = value => {
    handleVehicle(value)
  };
  
  
  const deviceWidth = Dimensions.get("window").width;
  const deviceHeight = Dimensions.get("window").height;
  
  const [vehicles, setVehicleState] = useState([]);
  const [carTypes, setCarTypes] = useState([]);
  const [carType, setCarType] = useState('');
  
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  
  const [startTimeText, setStartTimeText] = useState('');
  const [endTimeText, setEndTimeText] = useState('');
  
  const [start_time, setStartHourTime] = useState('');
  const [end_time, setEndHourTime] = useState('');
  
  const [amount, setAmount] = useState(0);
  const [diffInHrs, setDiffInHrs] = useState(0);

  const [isStartTimePickerVisible, setStartTimePickerVisibility] = useState(false);
  const [isEndTimePickerVisible, setEndTimePickerVisibility] = useState(false);
  const [isReqProcessing, setIsReqProcessing] = useState(false);
  
  const availableHours = [0, 1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24];
  
  useEffect(() => {
    populateHours();
  }, []);

  useEffect(() => {
    populateVehicles();
  })

  useEffect(() => {
    fetchVehicleCategories();
  }, [carTypes])
  
  const populateHours = () => {
    
    if (availableHours && !_.isEqual(availableHours, state.hours)) {
      setState({
        ...state,
        hours: availableHours
      });
    }else{
      console.log("Not safe on hours");
    }
  }
  
  const populateVehicles = () =>{
    
    db.transaction((tx) => {
      tx.executeSql(
        'SELECT * FROM vehicles',
        [],
        (tx, results) => {
          
          var temp = [], myvehicles = [];
          
          for (let i = 0; i < results.rows.length; ++i){
            temp.push(results.rows.item(i));
          }
          
          for (let i = 0; i < temp.length; ++i){
            myvehicles.push(`${temp[i]['name']} - ${temp[i]['number']}`); // : ${temp[i]['name']}
          }
  
          if (vehicles && !_.isEqual(vehicles, myvehicles)) {
              setVehicleState(myvehicles);
          }
          
        }
        );
      });
    }
    
    const fetchVehicleCategories = async() => {
      
      try{
        
        const result = await getVehicleCategories();
        const vehicle_categories = result.data; 
        
        let types = [];
        for(let i = 0; i < vehicle_categories.length; i++) {
          let name = vehicle_categories[i]['name'];
          types.push(name);
        }
        
        if (carTypes && !_.isEqual(carTypes, types)) {
          if(types.length > 0) {
            setCarTypes(types);
            // setCarType(types[0]);
          }
        }
        
      }catch(err){
        Toast.show(err.message, Toast.LONG);
      }
    }


    
    
    const handleVehicle = (selectedItem) => {
      
      const vehicleDetailsArr = selectedItem.split("-");
      const name = vehicleDetailsArr[0].trim();
      const number = vehicleDetailsArr[1].trim();
      
      setSelectedVehicle(selectedItem);
      
      dbVehicleHelper.searchVehicle(number, name, async result => {
        
        console.log(`Here are vehicle details 1`, result);
        console.log(`Vehicle number ${result.number}, name ${result.name} and type ${ result.type}`);
        
        let vehicleType = result.type;
        setCarType(vehicleType);
        
        if(start_time && end_time){
          calculateAmount(start_time, end_time, vehicleType);
        }
        
      });
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
      
      try{
      let start_hour_time = get24HrClockTime(selectedStartTime);
      
      if(endTime){
        if(start_hour_time < endTime){
          
          const sTimeText =  get12HrClockTime(selectedStartTime);
          setStartTimeText(sTimeText);
          
          setStartTime(start_hour_time);
          setStartHourTime(selectedStartTime);
          
          if(end_time){
            calculateAmount(selectedStartTime, end_time, carType);
          }
        }else{
          Alert.alert("Message", "Start time must be less than end time");
        }
      }else{
        
        setStartTime(start_hour_time);
        setStartHourTime(selectedStartTime); 
        
        const sTimeText =  get12HrClockTime(selectedStartTime);
        setStartTimeText(sTimeText);
        
        if(end_time){
          calculateAmount(selectedStartTime, end_time, carType);
        }
      }
      hideStartTimePicker();
    }catch(err){
      Toast.show(err.message, Toast.LONG);
    }
    };
    
    const handleConfirmEndTime = (selectedEndTime) => {
      
      try {

      let end_hour_time = get24HrClockTime(selectedEndTime);

      if(startTime){
        if(end_hour_time > startTime){
          
          const eTimeText = get12HrClockTime(selectedEndTime);
          setEndTimeText(eTimeText);
          setEndTime(end_hour_time);
          setEndHourTime(selectedEndTime);
          
          if(start_time){
            calculateAmount(start_time, selectedEndTime, carType);
          }
        }else{
          Alert.alert("Message", "End time must be greater than start time");
        }

      }else{

        setEndTime(end_hour_time);
        setEndHourTime(selectedEndTime);
        const eTimeText = get12HrClockTime(selectedEndTime);
        setEndTimeText(eTimeText); 
        
        if(start_time){
          calculateAmount(start_time, selectedEndTime, carType);
        }
      }
      
      console.warn("End time has been picked: ", end_hour_time);
      hideEndTimePicker();
    }catch(err){
      Toast.show(err.message, Toast.LONG);
    }
    };
    
    
    
    const submitRequest = async() => {
      
      try{
        
        const parking_area_id = item.id;
        const customer_id = profile.id;
        const telephone_no = `${profile.country_code}${profile.phone_number}`;
        const vehicle_details = selectedVehicle;
        let account_balance = '9000000'; // profile.account_balance.replace(/,/g, '');
        
        let balance = parseFloat(account_balance);
        const total_amount =parseFloat(amount);

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
           vehicles.length <= 0 && Toast.show("Please first register atleast one vehicle before placing an order", Toast.LONG)
           vehicles.length > 0 && Toast.show("Please select vehicle", Toast.LONG);
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
            const vehicleName = vehicleDetailsArr[0].trim();
            const vehicleNumber = vehicleDetailsArr[1].trim();
            
            console.log(`Vehicle name ${vehicleName} and number ${vehicleNumber}`);
            
            if(vehicleName && vehicleNumber){
              dbVehicleHelper.searchVehicle(vehicleNumber, vehicleName, async result => {
                
                console.log(`Here are vehicle details`, result);
                console.log(`Vehicle number ${result.number}, name ${result.name} and type ${ result.type}`);
                
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
                
                if(resp.statusCode == 200){
                  
                  setStartTime('');
                  setEndTime('');
                  setAmount(0);
                  setStartTimeText('');
                  setEndTimeText('');
                  setSelectedVehicle('')

                  Toast.show(resp.message, Toast.LONG);
                  
                }else{
                  Toast.show(resp.message, Toast.LONG);
                }
                setIsReqProcessing(false);
                
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
      
      
      const calculateAmount = (startTime, endTime, carType) => {
        
        if(carType){
          
          setCarType(carType);

          let hours = diff_hours(endTime, startTime);
          setDiffInHrs(hours);
          let total = hours*fees[`${carType}`];
          total = Math.round(total);

          setAmount(total);
          
          console.log("Diff in hours", hours);
          console.log("Fees per hour", fees[`${carType}`]);
          
          total = numberWithCommas(total);
          console.log('Total is', total);

          setAmount(total);

        }else{

          vehicles.length <= 0 && Toast.show("Please first register atleast one vehicle before placing an order", Toast.LONG)
          vehicles.length > 0 && Toast.show("Please select vehicle", Toast.LONG)
        }
        
      }
      
          return (
            <Modal 
            backdropColor={theme.COLORS.overlay}
            style={styles.modalContainer}
            isVisible={open}
            deviceWidth={deviceWidth}
            deviceHeight={deviceHeight}
            useNativeDriver
            onBackButtonPress={onClose}
            onBackdropPress={onClose}
            swipeDirection="down"
            propagateSwipe
            >
            
            <ScrollView contentContainerStyle={styles.modal}>
            <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <View>
            <Text style={{fontSize: theme.SIZES.font *1.4}}>{name}</Text>
            </View>
            <View>
            <TouchableOpacity onPress={onClose}>
            <FontAwesome name='times' size={30} color={theme.COLORS.gray}/>
            </TouchableOpacity>
            </View>
            </View>
            
            <View style={{paddingVertical:theme.SIZES.base}}>
            <Text style={{color:theme.COLORS.gray, fontSize:theme.SIZES.font*1.2}}>{description}</Text>
            </View>
            
            
            <View style={{paddingVertical: 10 }}>
              <Text style={{fontSize: 16 }}>Working hours:  <Text style={{ fontWeight:'bold', left: 5 }}>{item.working_hours}</Text></Text>
            { is_open &&  <Text style={{fontSize:14, textTransform:'uppercase', fontWeight: '900', color: design.colors.green}}>Open</Text>}
            { !is_open &&  <Text style={{fontSize:14, textTransform:'uppercase', fontWeight: '900', color: design.colors.red}}>Closed</Text>}
          
            <View style={{marginTop: 25}}>
            <Text style={{fontSize: 16, fontWeight:'bold', opacity:0.6, color:'#000', textTransform:'capitalize'}}>ORDER REQUEST INFORMATION</Text>
            </View>
            
            
            <View style={styles.orderInfo}>
            <Text style={{color:theme.COLORS.gray, fontSize:theme.SIZES.font*1.1}}>Vehicle</Text>
            
            <View style={styles.modalVehiclesDropdown}>
            
            <TouchableOpacity onPress={() => openModal()} style={{padding: 18, elevation:1, borderColor: 'gray'}}>
            <Text> { selectedVehicle ? selectedVehicle : 'Select vehicle'}</Text>
            </TouchableOpacity>
            
            <SelectDropDown 
            items={vehicles}
            saveModalRef={saveModalRef}
            onSelectedOption={onSelectedOption}
            background={colors.primary}
            textColor={colors.text}
            />
          </View>
          
          </View>
          
          <View style={{flexDirection: 'column'}}>
          
          <View style={[styles.orderInfo, {flexDirection: 'row'}]}>
          <Text style={{color:theme.COLORS.gray, fontSize:theme.SIZES.font*1.1}}>Start Time</Text>
          <Text style={{color:theme.COLORS.gray, fontSize:theme.SIZES.font*1.1, fontWeight:'bold'}}>{startTimeText}</Text>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <View style={styles.modalVehiclesDropdown}>
          <View  style={{width:110}}>
          <Button title="select" onPress={showStartTimePicker} color={design.colors.gray}/>
          </View>
          <DateTimePickerModal
          isVisible={isStartTimePickerVisible}
          mode="time"
          is24Hour={false}
          locale="en_GB"  // for iOS
          onConfirm={handleConfirmStartTime}
          onCancel={hideStartTimePicker}
          />
          </View>
          
          </View>
          </View>
          
          
          <View style={[styles.orderInfo, {flexDirection: 'row'}]}>
          <Text style={{color:theme.COLORS.gray, fontSize:theme.SIZES.font*1.1}}>End Time</Text>
          <Text style={{color:theme.COLORS.gray, fontSize:theme.SIZES.font*1.1, fontWeight:'bold'}}>{endTimeText}</Text>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <View style={[styles.modalVehiclesDropdown, {marginLeft:10 }]}>
          <View  style={{width:110}}>
          <Button title="select" onPress={showEndTimePicker} color={design.colors.gray} />
          </View>
          <DateTimePickerModal
          isVisible={isEndTimePickerVisible}
          mode="time"
          is24Hour={false}
          locale="en_GB"  // for iOS
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
          </View>
          
          
          </View>
          
          
          <TouchableOpacity style={[styles.payBtn,
            is_open ? {backgroundColor: colors.primary}: {backgroundColor: theme.COLORS.gray}]} 
            disabled={is_open ? false : true}
            onPress={() => submitRequest()}
            >  
            <Text style={design.buttonText}> 
            { isReqProcessing 
              ? <UIActivityIndicator color='#fff' size={25}/>
              : 'Submit Request' 
            }
            </Text>
            </TouchableOpacity> 
            
            </ScrollView>
            </Modal>
            
            )
          }
          
          const makeStyles = (colors) => StyleSheet.create({

            container: {
              flex: 1,
              backgroundColor: theme.COLORS.white,
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
            
            orderInfo:{
              flexDirection: 'row',
              justifyContent: 'space-between',
              paddingVertical: theme.SIZES.base*1.5,
              borderTopWidth: 0.7
            },

            modalVehiclesDropdown: {
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center'
            },

            payBtn: {
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

          });