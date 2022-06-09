import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { colors as utilColors } from '../utils/index'
import {  MaterialCommunityIcons, Ionicons } from '@expo/vector-icons'
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import FocusAwareStatusBar  from '../../components/common/FocusAwareStatusBar';
import { useTheme  } from 'react-native-paper';

const { PRIMARY_COLOR, SECONDARY_COLOR, BORDER_COLOR } = utilColors

export default function WeatherDetails({ currentWeather, currentWeatherDetails, unitsSystem }) {
   
    const { colors } = useTheme();
   
    const {
        main: { temp, humidity, pressure },
        wind: { speed },
    } = currentWeatherDetails

    const windSpeed = unitsSystem === 'metric' ? `${Math.round(speed)} m/s` : `${Math.round(speed)} miles/h`
    const units = unitsSystem === 'metric' ? 'C' : 'F';
    return (
        <View style={styles.weatherDetails}>
        <FocusAwareStatusBar barStyle="light-content" backgroundColor={colors.primary} />
            <View style={styles.weatherDetailsRow}>
                <View style={{ ...styles.weatherDetailsBox, borderRightWidth: 1, borderRightColor: BORDER_COLOR }}>
                    <View style={styles.weatherDetailsRow}>
                        <FontAwesome name="thermometer" size={25} color={SECONDARY_COLOR} />
                        <View style={styles.weatherDetailsItems}>
                            <Text style={styles.text}>Feels like :</Text>
                            <Text style={styles.textSecondary}>{temp} ° {units} </Text>
                        </View>
                    </View>
                </View>
                <View style={styles.weatherDetailsBox}>
                    <View style={styles.weatherDetailsRow}>
                        <FontAwesome5 name="water" size={25} color={SECONDARY_COLOR} />
                        <View style={styles.weatherDetailsItems}>
                            <Text style={styles.text}>Humidity :</Text>
                            <Text style={styles.textSecondary}>{humidity} %</Text>
                        </View>
                    </View>
                </View>
            </View>
            <View style={{ ...styles.weatherDetailsRow, borderTopWidth: 1, borderTopColor: BORDER_COLOR }}>
                <View style={{ ...styles.weatherDetailsBox, borderRightWidth: 1, borderRightColor: BORDER_COLOR }}>
                    <View style={styles.weatherDetailsRow}>
                        <FontAwesome name="bold" size={25} color={SECONDARY_COLOR} />
                        <View style={styles.weatherDetailsItems}>
                            <Text style={styles.text}>Wind Speed :</Text>
                            <Text style={styles.textSecondary}>{windSpeed}</Text>
                        </View>
                    </View>
                </View>
                <View style={styles.weatherDetailsBox}>
                    <View style={styles.weatherDetailsRow}>
                        <FontAwesome name="tachometer" size={25} color={SECONDARY_COLOR} />
                        <View style={styles.weatherDetailsItems}>
                            <Text style={styles.text}>Pressure :</Text>
                            <Text style={styles.textSecondary}>{pressure} hPa</Text>
                        </View>
                    </View>
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    weatherDetails: {
        flex:1,
        marginTop: 'auto',
        margin: 15,
        borderWidth: 1,
        borderColor: BORDER_COLOR,
        borderRadius: 10,
     
    },
    weatherDetailsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    weatherDetailsBox: {
        flex: 1,
        padding: 20,
    },
    weatherDetailsItems: {
        alignItems: 'flex-end',
        justifyContent: 'flex-end',
    },
    textSecondary: {
        fontSize: 15,
        color: SECONDARY_COLOR,
        fontWeight: '700',
        margin: 7,
    },
    text: {
        fontSize:16
    }
})