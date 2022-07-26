import React from 'react';
import {View, Text, FlatList, Image, StyleSheet} from 'react-native';


export default HourlyForecast = ({ forecast, unitsSystem }) => {

    const units = unitsSystem === 'metric' ? 'C' : 'F';

  return (

    <View>
        <Text style={styles.subtitle}>Hourly Forecast</Text>
        <FlatList horizontal
        data={forecast.hourly.slice(0, 24)}
        keyExtractor={(item, index) => index.toString()}
        renderItem={(hour) => {
        const weather = hour.item.weather[0];
        var dt = new Date(hour.item.dt * 1000);
        return <View style={styles.hour}>
        <Text style={styles.text}>{dt.toLocaleTimeString().replace(/:\d+ /, ' ')}</Text>
        <Text style={styles.text}>{Math.round(hour.item.temp)}°{units}</Text>
        <Image
        style={styles.smallIcon}
        source={{
            uri: `http://openweathermap.org/img/wn/${weather.icon}@4x.png`,
        }}
        />
        <Text style={styles.text}>{weather.description}</Text>
        </View>
        }}
        />
    </View>
  )


}

const styles = StyleSheet.create({

    subtitle: {
        fontSize: 20,
        marginVertical: 12,
        marginLeft: 10,
        color: '#e96e50',
      },

      text:{
        fontSize:16
      },

      hour: {
        padding: 6,
        alignItems: 'center',
      },

      smallIcon: {
        width: 100,
        height: 100,
      }

});