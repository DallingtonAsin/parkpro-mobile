import React from 'react'
import { View, Platform, StyleSheet } from 'react-native'
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { colors } from '../utils/index'

export default function ReloadIcon({ load }) {
    const reloadIconName = Platform.OS === 'ios' ? 'refresh' : 'refresh'
    return (
        <View style={styles.reloadIcon}>
            <FontAwesome 
            onPress={load} 
            name={reloadIconName}
            size={30}
            color={colors.PRIMARY_COLOR}
            style={{ top:35 }}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    reloadIcon: {
        position: 'absolute',
        top: 0,
        right: 30,
    },
})