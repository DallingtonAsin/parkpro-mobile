import React,{useEffect, useState, useContext} from 'react';
import { StyleSheet, Text, View, Button, ScrollView, Dimensions, TouchableOpacity, Alert} from 'react-native';
import Modal from 'react-native-modal';
import * as theme from '../../../assets/theme';
import design from '../../../assets/css/styles';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import Toast from 'react-native-simple-toast';
import { useTheme } from '@react-navigation/native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import ModalDropdown  from 'react-native-modal-dropdown';
import { openDatabase } from 'react-native-sqlite-storage';
import ProfileContext from '../../context';
import { AuthContext } from '../../context/context';
import { UIActivityIndicator } from 'react-native-indicators';
import {CURRENCY} from '@env';
import { get12HrClockTime , get24HrClockTime, numberWithCommas, diff_hours} from '../sharedHelper/AppUtils';
import { SelectDropDown } from '../common/SelectDropdown';

  const {height, width} = Dimensions.get('screen');
  const db = openDatabase({ name: 'Customers.db' });
  const dbVehicleHelper = require("../../database/vehicles");
  const _  = require('lodash');


  export const RequestScreen = ({item, open, onClose}) => {
    
    const initialState = {
      hours:{},
      startTime: '',
      endTime: '',
      
      start_time: '',
      end_time: '',
      diff_hours : 0,
      total_amount: 0,
      active:null
    }

    const { profile } = useContext(ProfileContext);
    const {getParkingAreas, getVehicleCategories, submitParkingRequest} = React.useContext(AuthContext);
    
    const [state, setState] = useState(initialState);
    const [selectedVehicle, setSelectedVehicle] = useState('');
    const { colors } = useTheme();
    const styles = makeStyles(colors);

    const { fees, name,
            description, distance,
            current_free_space ,
            total_space, is_open,
            phone_number, rating 
          } = item;

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
      const [carType, setCarType] = useState();

      const [startTime, setStartTime] = useState('');
      const [endTime, setEndTime] = useState('');

      const [startTimeText, setStartTimeText] = useState('');
      const [endTimeText, setEndTimeText] = useState('');

      const [start_time, setStartHourTime] = useState('');
      const [end_time, setEndHourTime] = useState('');


      const [amount, setAmount] = useState("0");
      
      const [isStartTimePickerVisible, setStartTimePickerVisibility] = useState(false);
      const [isEndTimePickerVisible, setEndTimePickerVisibility] = useState(false);
      const [isReqProcessing, setIsReqProcessing] = useState(false);
     
      const availableHours = [0, 1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24];

      useEffect(() => {
        populateHours();
        populateVehicles();
        fetchVehicleCategories();
      }, []);

      const populateHours = () => {
        console.log("hours x", availableHours);
        console.log("hours y", state.hours);

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

              console.log("myvehicles x", vehicles);
              console.log("myvehicles y", myvehicles);

              if (vehicles && !_.isEqual(vehicles, myvehicles)) {
                setVehicleState(myvehicles);
                if(myvehicles.length > 0){
                  setSelectedVehicle(myvehicles[0]);
                }
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

            console.log("my vehicle cats x", carTypes);
            console.log("my vehicle cats y", types);

            if (carTypes && !_.isEqual(carTypes, types)) {
              if(types.length > 0){
                setCarType(types[0]);
              }
              if(types.length > 0) {
                setCarTypes(types);
              }
            }
            
            
          }catch(err){
            Toast.show(err.message, Toast.LONG);
          }
        }
        
        
        const handleVehicle = (selectedItem) => {
          
          const vehicleDetailsArr = selectedItem.split("-");
          const VName = vehicleDetailsArr[0].trim();
          const VNumber = vehicleDetailsArr[1].trim();
 
          setSelectedVehicle(selectedItem);
          let vehicleType = '';

          dbVehicleHelper.searchVehicle(VNumber, VName, async result => {

            console.log("Here are vehicle details 1", result);
            console.log("Got this vehicle number 1", result.number);
            console.log("Got this vehicle name 1", result.name);
            console.log("Got this vehicle type 1", result.type);

            vehicleType = result.type;

              setState({
                ...state,
                setCarType: vehicleType
              });

              if(start_time && end_time){
                calculateAmount(start_time, end_time);
                ResetAmount(vehicleType);
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

          let start_hour_time = get24HrClockTime(selectedStartTime);
         

          if(endTime){
            if(start_hour_time < endTime){

              const sTimeText =  get12HrClockTime(selectedStartTime);
              setStartTimeText(sTimeText);

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

            const sTimeText =  get12HrClockTime(selectedStartTime);
            setStartTimeText(sTimeText);

            if(end_time){
              calculateAmount(selectedStartTime, end_time);
            }
          }
          hideStartTimePicker();
        };
        
        const handleConfirmEndTime = (selectedEndTime) => {

          let end_hour_time = get24HrClockTime(selectedEndTime);
          if(startTime){
            if(end_hour_time > startTime){

              const eTimeText = get12HrClockTime(selectedEndTime);
              setEndTimeText(eTimeText);
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
            const eTimeText = get12HrClockTime(selectedEndTime);
            setEndTimeText(eTimeText); 
            
            if(start_time){
              calculateAmount(start_time, selectedEndTime);
            }
          }
          
          console.warn("End time has been picked: ", end_hour_time);
          hideEndTimePicker();
        };

      
        
        const submitRequest = async() => {
      
          try{
            
            const parking_area_id = item.id;
            const customer_id = profile.id;
            const telephone_no = `${profile.country_code}${profile.phone_number}`;
            const vehicle_details = selectedVehicle;
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
          
          
          const calculateAmount = (startTime, endTime, selectedCarType= "") => {
            
            if(selectedCarType){
              ResetAmount(selectedCarType);
            }else{
              
              let res = diff_hours(endTime, startTime);
              console.log("Diff in hours", res);
              console.log("Fees per hour", fees[`${carType}`]);
              let total = res*fees[`${carType}`];
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
            const { diff_hours } = state;
            console.log("Fees per hour", fees[`${selectedCarType}`]);
            let value = diff_hours*fees[`${selectedCarType}`];
            value = numberWithCommas(value);
            setAmount(value);
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
                
                <View style={{marginTop:10}}>
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
                {/* {renderVehicles()}
                <Text style={{color:theme.COLORS.gray}}></Text> */}
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
                {/*  {fees[`${carType}`]} */}
                </View>
                
                
                </View>
                
                
                <TouchableOpacity style={[styles.payBtn,
                  is_open ? {backgroundColor: colors.primary}: {backgroundColor: theme.COLORS.gray}]} 
                  disabled={is_open ? false : true}
                  onPress={() => submitRequest()}
                  >  
                  <Text style={styles.payText}> 
                  { isReqProcessing 
                    ? <UIActivityIndicator color='#fff' size={25}/>
                    : 'Submit Request' 
                  }
                  </Text>
                  <FontAwesome name='angle-right' size={theme.SIZES.icon*1.75} color={theme.COLORS.white} style={{marginLeft:10}} />
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