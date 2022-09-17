import React from 'react';
import { View, StyleSheet } from 'react-native';
import { UIActivityIndicator } from 'react-native-indicators';

const AppLoader = () => {
    return (
        <View style={[ StyleSheet.absoluteFillObject,  styles.container]}>
          {/* <LottieView source={require('../../../assets/json/loading.json')}
            style={styles.loader}
            autoPlay loop /> */}
               <UIActivityIndicator color={theme.colors.primary} size={60}/>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
       justifyContent: 'center',
       alignItems: 'center',
       backgroundColor: 'rgba(0,0,0,0.3)',
       zIndex: 1
    },

    loader: {
        width: 350,
        height: 350,
    }
});

export default AppLoader;