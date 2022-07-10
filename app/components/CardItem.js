import React from 'react';
import LinearGradient from 'react-native-linear-gradient';
import {TouchableOpacity, Image, View, Text, StyleSheet, Pressable} from 'react-native'
import { COLORS, FONTS, SIZES } from '../../constants';
import design from '../../assets/css/styles';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

const CardItem = ({ bgColor, icon, label, tintColor, borderRadius,
                    onPress, labelColor, iconWidth, iconHeight,
                    XWidth, YHeight, isSocialMedia, color }) => {

    return (

        <TouchableOpacity
        style={[{ flex: 1, alignItems: 'center', justifyContent: 'center' }]}
        onPress={onPress}
        activeOpacity={0.9}
        >
        <View style={[styles.shadow, isSocialMedia ? styles.socialMediaCard: '',  { 
             width: XWidth ? XWidth : 120,
             height: YHeight ? YHeight: 120,
             borderColor:'#000',
             
             }]}>

        <LinearGradient
        style={[{ flex: 1, alignItems: 'center', justifyContent: 'center',
        borderRadius: borderRadius ? borderRadius : 10,
        backgroundColor: 'red' }]}
        colors={bgColor}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        >
        
        { isSocialMedia
            ? <FontAwesome name={icon} size={30} color={color}/>
            : <Image
            source={icon}
            resizeMode="cover"
            style={{
                tintColor: tintColor ? tintColor : '#fff',
                width: iconWidth ? iconWidth : 45,
                height: iconHeight ? iconHeight : 45,
            }}
            />
              
        } 

          { !isSocialMedia &&  <Text style={{ marginTop: SIZES.base, color: labelColor ? labelColor : design.colors.primary, ...FONTS.body3, fontWeight:'normal', fontSize:15.5 }}>{label}</Text> }

        </LinearGradient>

        </View>

        { isSocialMedia &&  <Text style={{ marginTop: SIZES.base, color: labelColor ? labelColor : design.colors.primary, ...FONTS.body3, fontWeight:'normal', fontSize:13, textAlign: 'center'}}>{label}</Text> }
         
       
        </TouchableOpacity>
        )
    }

export default CardItem;
    
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
    
