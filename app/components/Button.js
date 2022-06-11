import React from 'react'
import { View, TouchableOpacity, Image, Text} from 'react-native';
import { COLORS, SIZES, SHADOWS, FONTS, apiKeys, assets } from '../constants';


export const CircleButton = ({imgUrl, imgTintColor, handlePress, ...props}) => {
    return(
        <TouchableOpacity style={{
            width:40,
            height:40,
            backgroundColor: COLORS.white,
            position: 'absolute',
            borderRadius: SIZES.extraLarge,
            alignItems: 'center',
            justifyContent: 'center',
            ...SHADOWS.light,
            ...props,
        }}
        onPress={handlePress}
        >
            <Image
             source={imgUrl}
             resizeMode="contain"
             style={{width: 28,
                     height:28,
                     tintColor: imgTintColor}}
            />

        </TouchableOpacity>
    )
}

export const RectButton = () => {
    return(
        <View>
            <Text>Rect Button</Text>
        </View>
    )
}