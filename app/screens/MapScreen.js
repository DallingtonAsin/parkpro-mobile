import React,{useEffect, useState, useContext, useRef} from 'react';
import { StyleSheet, Text, View,Button,
  ScrollView, FlatList, Dimensions,
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
  import * as Location from 'expo-location';
  import Geocoder from 'react-native-geocoding';
  import {CURRENCY} from '@env';
  import { UIActivityIndicator } from 'react-native-indicators';
  import DateTimePickerModal from "react-native-modal-datetime-picker";
  import {callHelpLine} from '../components/SharedCommons';
  import { openDatabase } from 'react-native-sqlite-storage';
  import FocusAwareStatusBar  from '../components/common/FocusAwareStatusBar';
  import { useTheme } from '@react-navigation/native';
  import { MAP_API_KEY } from '@env';
  
  
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
    const [currentAddress, setCurrentAddress] = useState('Kampala, Uganda');
    const [nearByParkings, setNearByParkings] = useState([]);
    const [carType, setCarType] = useState();
    
    const { colors } = useTheme();
    const styles = makeStyles(colors);
    
    const [locationServiceEnabled, setLocationServiceEnabled] = useState(false);
    const [displayCurrentAddress, setDisplayCurrentAddress] = useState('fetching your location...');
    
    
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
        
        
        
        
        
        return(
          <View style={styles.container}>
          <FocusAwareStatusBar barStyle="dark-content" 
          backgroundColor={colors.primary} />
          
          {/* {renderHeader()} */}
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
              >
              <TouchableWithoutFeedback>
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
