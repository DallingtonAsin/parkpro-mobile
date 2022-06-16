import React,{useEffect, useState, useContext} from 'react';
import Modal from 'react-native-modal';
import * as theme from '../../../assets/theme';
import design from '../../../assets/css/styles';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import {CURRENCY} from '@env';
import { StyleSheet, Text, View,Button, ScrollView, FlatList, Dimensions, TouchableOpacity, TouchableWithoutFeedback, 
         PermissionsAndroid, Alert, Image} from 'react-native';
import { useTheme } from '@react-navigation/native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { callHelpLine } from '../../components/SharedCommons';
import ModalDropdown  from 'react-native-modal-dropdown';
import { openDatabase } from 'react-native-sqlite-storage';

    

  const {height, width} = Dimensions.get('screen');
  const db = openDatabase({ name: 'Customers.db' });
  const dbVehicleHelper = require("../../database/vehicles");

    export const RequestScreen = ({item, open, onClose}) => {
        
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

        const [state, setState] = useState(initialState);
        const { colors } = useTheme();
        const styles = makeStyles(colors);
        console.log("Got this item on request screen", item);
        const { id: id, address, name,
                description, distance,
                current_free_space ,
                total_space, is_open,
                phone_number, rating } = item;
        

        const deviceWidth = Dimensions.get("window").width;
        const deviceHeight = Dimensions.get("window").height;
        const [vehicles, setVehicleState] = useState([]);

        const [startTime, setStartTime] = useState(null);
        const [endTime, setEndTime] = useState(null);
        const [start_time, setStartHourTime] = useState(null);
        const [end_time, setEndHourTime] = useState(null);
        const [amount, setAmount] = useState("0");

        const [isStartTimePickerVisible, setStartTimePickerVisibility] = useState(false);
        const [isEndTimePickerVisible, setEndTimePickerVisibility] = useState(false);
        const [isReqProcessing, setIsReqProcessing] = useState(false);
        const [carType, setCarType] = useState();
        const [carTypes, setCarTypes] = useState();
        const availableHours = [0, 1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24];


        useEffect(() => {
            populateHours();
            populateVehicles();
            fetchVehicleCategories();
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
                  const result = await getVehicleCategories();
                  const vehicle_categories = result.data; 
                  
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
            
            <View style={styles.modalInfo1}>
            
            <View style={{ flexDirection: 'column'}}>
            
            <View style={{flexDirection: 'row', justifyContent: 'space-evenly'}}>
            <View style={[styles.parkingIcon,  ]}>
            <FontAwesome name='clock-o' size={theme.SIZES.icon*1.3} color={theme.COLORS.orange} style={{paddingTop:5}}/>
            {
                is_open
                ? <Text style={{fontSize:theme.SIZES.icon*1.05, color: 'green', opacity:0.6}}> Open</Text>
                :  <Text style={{fontSize:theme.SIZES.icon*1.05, color: 'red', opacity:0.6}}> Closed</Text>
                
            }
            </View> 

            <View style={[styles.parkingIcon, ]}>
            <FontAwesome name='star' size={theme.SIZES.icon*1.5} color={theme.COLORS.orange} style={{paddingTop:5}}/>
            <Text style={{fontSize:theme.SIZES.icon*1.15}}>{rating}</Text>
            </View>
            </View>
            
            <View style={{flexDirection: 'row',  justifyContent: 'space-evenly'}}>
            <View style={[styles.parkingIcon,  ]}>
            <FontAwesome name='road' size={theme.SIZES.icon*1.3} color={theme.COLORS.orange} style={{paddingTop:5}}/>
            <Text style={{fontSize:theme.SIZES.icon*1.05}}>{distance} km</Text>
            </View>

            <View style={[styles.parkingIcon, {paddingLeft:10} ]}>
            <FontAwesome name='car' size={theme.SIZES.icon*1.3} color={theme.COLORS.orange} style={{paddingTop:5}}/>
            <Text style={{fontSize:theme.SIZES.icon*1.05}}>{current_free_space}/{total_space}</Text>
            </View>
            </View>
            
            </View>
            
            
            <View>
            <TouchableOpacity style={styles.callBtn} 
            onPress={() =>  callHelpLine(phone_number)}
            >
            <FontAwesome5 name="phone-alt" size={18} color={design.colors.gray}/>
            <Text style={{fontSize:16, paddingLeft:10, color:design.colors.gray}}>Call</Text>
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
                true ? {backgroundColor: colors.primary}: {backgroundColor: theme.COLORS.gray}]} 
                // disabled={activeModal.is_open ? false : true}
                //   onPress={() => submitRequest()}
                >  
                <Text style={styles.payText}> 
                {isReqProcessing ? 
                    <UIActivityIndicator color='#fff' size={25}/> : 'Submit Request' }
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