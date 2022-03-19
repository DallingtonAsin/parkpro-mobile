import React from 'react'
import { View, Text , StyleSheet , Image} from 'react-native'
import {colors} from '../utils/index'

const {PRIMARY_COLOR , SECONDARY_COLOR} = colors

export default function WeatherInfo({currentWeather , currentWeatherDetails, unitsSystem}) {
    const {
        main: {temp},
        weather: [details],
        name} = currentWeatherDetails;

        const { icon , main , description} = details

        const iconUrl = `https://openweathermap.org/img/wn/${icon}@4x.png`
        const units = unitsSystem === 'metric' ? 'C' : 'F';
    return (
        <View style={styles.weatherInfo}>
            {/* <Text>{name}</Text> */}
            <Image style = {styles.weatherIcon} source={{uri: iconUrl}} />
            <Text style = {styles.textPrimary} >{temp}° {units}</Text>
            <Text style = {styles.weatherDescription}>{description}</Text>
            <Text style={styles.textSecondary}>{main}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    weatherInfo: {
        alignItems: 'center'
    },
    weatherIcon:{
        width: 100,
        height: 100
    },
    weatherDescription: {
        textTransform: 'capitalize',
        fontSize:14
    },
    textPrimary: {
        fontSize: 40,
        color: PRIMARY_COLOR
    },
    textSecondary: {
        fontSize: 20,
        color: SECONDARY_COLOR,
        fontWeight: '500',
        marginTop: 10,
    },
})
