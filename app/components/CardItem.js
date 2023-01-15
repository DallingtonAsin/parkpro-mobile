import React from 'react';
import LinearGradient from 'react-native-linear-gradient';
import {TouchableOpacity, Image, View, Text, StyleSheet, Dimensions} from 'react-native'
import { COLORS, FONTS, SIZES } from '../../constants';
import design from '../../assets/css/styles';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Icon5 from 'react-native-vector-icons/FontAwesome5';


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

           <Icon name={icon} size={35} color={tintColor}/>

           <Text style={{ marginTop: SIZES.base, color: labelColor ? labelColor : design.colors.primary, ...FONTS.body3, fontWeight:'normal', fontSize:15.5 }}>{label}</Text> 


        </TouchableOpacity>
        )
    }


export const AboutCardItem = ({ icon, label, onPress, color }) => {

return (

<TouchableOpacity
style={[{ flex: 1, alignItems: 'center', justifyContent: 'center' }]}
onPress={onPress}
activeOpacity={0.9}
>
    <View style={[styles.shadow, styles.socialMediaCard,  { 
    width: 70,
    height: 70,
    borderColor:'#000', 
    justifyContent: 'center',
    alignItems: 'center'
    
    }]}>
    <FontAwesome name={icon} size={30} color={color}/>
    </View>
 <Text style={{ marginTop: SIZES.base, color: '#000', ...FONTS.body3, fontWeight:'normal', fontSize:13, textAlign: 'center'}}>{label}</Text> 
</TouchableOpacity>
)
}

    
    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: COLORS.white,
        },

        shadow: {
            borderWidth:0.6,
            borderRadius: 5
        },

        socialBg:{
          backgroundColor:'red',
        },

        socialMediaCard: {
            paddingLeft:1,
        }
    });
    
