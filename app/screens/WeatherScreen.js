import React, { useEffect, useState, useContext } from "react";
import { StyleSheet, Text, View , PermissionsAndroid, ActivityIndicator, ScrollView, SafeAreaView, RefreshControl, LogBox, FlatList, Image, ToastAndroid   } from "react-native";
import Geolocation from 'react-native-geolocation-service';
import WeatherInfo from '../components/weather/WeatherInfo'
import UnitsPicker from '../components/weather/UnitsPicker'
import ReloadIcon from '../components/weather/ReloadIcon'
import WeatherDetails from '../components/weather/WeatherDetails'
import HourlyForecast from "../components/weather/HourlyForecast";
import { WEATHER_API_KEY } from '@env';
import FocusAwareStatusBar  from '../components/common/FocusAwareStatusBar';
import { useTheme  } from 'react-native-paper';
import AppLoader from '../components/loaders/AppLoader';
import * as Location from 'expo-location';
import { AuthContext } from '../context/context';
import Toast from 'react-native-simple-toast';


const BASE_WEATHER_URL = "https://api.openweathermap.org/data/2.5/weather?";
LogBox.ignoreAllLogs(true);

const WeatherScreen = () => {
  // hasInternetConnection
  const [errorMessage, setErrorMessage] = useState(null);
  const [currentWeather, setCurrentWeather] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [currentWeatherDetails, setCurrentWeatherDetails] = useState(null);
  const [unitsSystem , setUnitsSystem] = useState('metric');
  const [isLoading, setIsLoading] = useState(true);
  const [isConnected, setIsConnected] = useState(false);
  const { colors } = useTheme();
  
  const { hasInternetConnection } = React.useContext(AuthContext);
  
  useEffect(async() => {
    let isConnected = await hasInternetConnection();
    setIsConnected(isConnected);
    if(!isConnected){
      setIsLoading(false);
      Toast.show('No internet Conncetion', Toast.LONG);
    }else{
      load();
    }
  }, [isConnected, unitsSystem]);
  
  
  const refreshWeather = async() => {
    await load();
  }

  const getForecastApiUrl = (metric) => {
    const url =  `https://api.openweathermap.org/data/2.5/onecall?&units=${metric}&exclude=minutely&appid=${WEATHER_API_KEY}`;
    return url;
  }
  
  
  const load = async() => {
    
    setCurrentWeatherDetails(null)
    setCurrentWeather(null)
    setErrorMessage(null)
    
    try {
      

      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: "Location Permissions",
          message:
            "App needs access to your location " +
            "so you can see the current weather and forecast.",
          buttonNeutral: "Ask Me Later",
          buttonNegative: "Cancel",
          buttonPositive: "OK"
        }
      );

      if (granted != PermissionsAndroid.RESULTS.GRANTED) {
        setErrorMessage("Location permission needed to load weather denied!");
        return;
      }
      setIsLoading(true);

      Geolocation.getCurrentPosition(
        async (position) => {
          const latitude =  parseFloat(position.coords.latitude);
          const longitude =  parseFloat(position.coords.longitude);
          const weatherUrl = `${BASE_WEATHER_URL}lat=${latitude}&lon=${longitude}&units=${unitsSystem}&appid=${WEATHER_API_KEY}`;
          await fetch(weatherUrl).then(async(response) => {
            const result = await response.json();
            
            if(response.ok){
              setCurrentWeather(result.main.temp)
              setCurrentWeatherDetails(result)
            }
            else {
              setErrorMessage(result.message)
            }
            
            const forecastApiUrl = getForecastApiUrl(unitsSystem);
            const resp = await fetch( `${forecastApiUrl}&lat=${latitude}&lon=${longitude}`);
            const data = await resp.json();
            if(!resp.ok) {
              Alert.alert(`Error retrieving weather data: ${data.message}`); 
            } else {
              console.log(`Forecast data`, data);
              setForecast(data);
            }
            
            
            setIsLoading(false);
            
          });
          
          
        },
        (error) => {
          console.log(error.code, error.message);
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
        );
        
        
        
      } catch (error) {
        setErrorMessage(error.message)
      }
      
      
    }
    
      if ((!forecast || !currentWeatherDetails)) {
        return <SafeAreaView style={styles.loading}>
        <FocusAwareStatusBar barStyle="light-content" backgroundColor={colors.primary} />
          {  isLoading && isConnected ?  <AppLoader /> : null }
        </SafeAreaView>
      }
   
    
    
    if(currentWeatherDetails && forecast){
      
      // const  {main : temp} = currentWeather
      return (
        
        <>
        <SafeAreaView style={styles.container}>
        <FocusAwareStatusBar barStyle="light-content" backgroundColor={colors.primary} />
        
        <ScrollView 
        refreshControl={
          <RefreshControl 
          onRefresh={() => {  refreshWeather() }} 
          refreshing={isLoading}
          />}
          >
          
          <View style={styles.main}>
          <UnitsPicker unitsSystem={unitsSystem} setUnitsSystem={setUnitsSystem}/>
          <ReloadIcon load={load}/>
          <WeatherInfo currentWeather={currentWeather} currentWeatherDetails={currentWeatherDetails} unitsSystem={unitsSystem}></WeatherInfo>
          </View>
          
          <WeatherDetails currentWeather={currentWeather} currentWeatherDetails={currentWeatherDetails} unitsSystem={unitsSystem}/>
          
          
          <HourlyForecast forecast={forecast} unitsSystem={unitsSystem}/>
        

          </ScrollView>
          </SafeAreaView>
          
          {  isLoading && isConnected ?  <AppLoader /> : null }
          
          </>
          );
        }
        else if(errorMessage){
          return (
            <View style={styles.errorContainer}>
            <FocusAwareStatusBar barStyle="light-content" backgroundColor={colors.primary} />
            <Text style={{fontSize:16, textAlign: 'center'}}>{errorMessage}</Text>
            </View>
            );
          } 
          else {
            return (
              <View style={styles.container}>
              <FocusAwareStatusBar barStyle="light-content" backgroundColor={colors.primary} />
              </View>
              );
            }
            
          }
          
          export default WeatherScreen
          
          const styles = StyleSheet.create({
            container: {
              flex: 1,
              backgroundColor: "#fff",
              alignItems: 'center',
              justifyContent: 'flex-start',
            },

            errorContainer: {
              flex: 1,
              backgroundColor: "#fff",
              alignItems: 'center',
              justifyContent: 'center',
              padding: 5
            },
            
            main : {
              flex: 1,
              justifyContent: "center",
            },
            title: {
              width: '100%',
              textAlign: 'center',
              fontSize: 42,
              color: '#e96e50',
            },
          
            
            loading: {
              flex: 1,
              backgroundColor: '#fff',
              alignItems: 'center',
              justifyContent: 'center',
            },
            current: {
              flexDirection: 'row',
              alignItems: 'center',
              alignContent: 'center',
            },
            currentTemp: {
              fontSize: 32,
              fontWeight: 'bold',
              textAlign: 'center',
            },  
            currentDescription: {
              width: '100%',
              textAlign: 'center',
              fontWeight: '200',
              fontSize: 24,
              marginBottom: 24
            },
            hour: {
              padding: 6,
              alignItems: 'center',
            },
            day: {
              flexDirection: 'row',
            },
            dayDetails: {
              justifyContent: 'center',
            },
            dayTemp: {
              marginLeft: 12,
              alignSelf: 'center',
              fontSize: 20
            },
            largeIcon: {
              width: 250,
              height: 200,
            },
          
            text:{
              fontSize:16
            }
          });