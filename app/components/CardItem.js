import React from 'react';
import LinearGradient from 'react-native-linear-gradient';
import {TouchableOpacity, Image, View, Text, StyleSheet, Dimensions} from 'react-native'
import { COLORS, FONTS, SIZES } from '../../constants';
import design from '../../assets/css/styles';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

export const HomeCardItem = ({ icon, label, tintColor, onPress, labelColor }) => {

    const windowWidth = Dimensions.get('window').width;
    const windowHeight = Dimensions.get('window').height;

    return (

        <TouchableOpacity style={{
             width: windowWidth*0.30,
             height: windowHeight*0.16,
             borderWidth: 0.6,
             borderColor: COLORS.gray,
             borderRadius:10,
             justifyContent: 'center',
             alignItems: 'center'
             }}
             onPress={onPress}
             > 

        
           <Image
            source={icon}
            resizeMode="cover"
            style={{
                tintColor: tintColor,
                width:  45,
                height: 45,
            }}
            />

           <Text style={{ marginTop: SIZES.base, color: labelColor ? labelColor : design.colors.primary, ...FONTS.body3, fontWeight:'normal', fontSize:15.5 }}>{label}</Text> 


        </TouchableOpacity>
        )
    }


export const AboutCardItem = ({ bgColor, icon, label, borderRadius,
                                onPress, labelColor, XWidth, YHeight, color }) => {

return (

<TouchableOpacity
style={[{ flex: 1, alignItems: 'center', justifyContent: 'center' }]}
onPress={onPress}
activeOpacity={0.9}
>
<View style={[styles.shadow, styles.socialMediaCard,  { 
 width: XWidth ? XWidth : 120,
 height: YHeight ? YHeight: 120,
 borderColor:'#000',
 
 }]}>

<LinearGradient
style={[{ flex: 1, alignItems: 'center', justifyContent: 'center',
borderRadius: borderRadius ? borderRadius : 10 }]}
colors={bgColor}
start={{ x: 0, y: 0 }}
end={{ x: 0, y: 1 }}
>
 <FontAwesome name={icon} size={30} color={color}/>
</LinearGradient>

</View>

 <Text style={{ marginTop: SIZES.base, color: labelColor ? labelColor : design.colors.primary, ...FONTS.body3, fontWeight:'normal', fontSize:13, textAlign: 'center'}}>{label}</Text> 


</TouchableOpacity>
)
}

    
    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: COLORS.white,
        },

        shadow: {
            shadowColor: "#000",
            shadowOffset: {
                width: 0,
                height: 2,
            },
            shadowOpacity: 0.25,
            shadowRadius: 1.84,
            
            elevation: 5,
        },

        socialBg:{
          backgroundColor:'red',
        },

        socialMediaCard: {
            paddingLeft:1,
        }
    });
    
