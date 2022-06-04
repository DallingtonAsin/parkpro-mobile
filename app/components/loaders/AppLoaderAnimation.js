import React from 'react';
import { View } from 'react-native';

import LottieView from 'lottie-react-native';

const AppLoaderAnimation = () => {
    return (
        <View style={{flex:1, justifyContent: 'center', alignItems:'center'}}>
          <LottieView source={require('../../../assets/json/stay-safe-stay-home.json')} autoPlay loop />
        </View>
    )
}

export default AppLoaderAnimation;