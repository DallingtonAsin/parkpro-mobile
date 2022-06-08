import React, {useState, useRef} from 'react';
import { 
    View, 
    Text, 
    TouchableOpacity, 
    SafeAreaView,
    Platform,
    StyleSheet,
    Alert,
    Modal
} from 'react-native';

import * as Animatable from 'react-native-animatable';
import { useTheme  } from 'react-native-paper';
import { AuthContext } from '../context/context';
import Toast from 'react-native-simple-toast';
import PhoneInput from "react-native-phone-number-input";
import FocusAwareStatusBar  from '../components/common/FocusAwareStatusBar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getDeviceId, getDeviceIpAddress, getAppVersionName } from '../components/SharedCommons';
import AppLoader from '../components/loaders/AppLoader';
import { ApiKeys } from '../network/ApiKeys';


const SigninScreen = ({ navigation }) => {
    
    const { colors } = useTheme();
    const styles = makeStyles(colors);
    const [value, setValue] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const phoneInput = useRef(null);
    const { sendSmsVerification } = React.useContext(AuthContext);
    
    
    const confirmPhoneNumber = () => {
        
        if(phoneNumber.length < 13){
          Toast.show('Please enter a valid phone number', Toast.LONG);
        }else{
            
            const phoneObj = phoneInput.current?.getNumberAfterPossiblyEliminatingZero();
            const number = phoneObj.number;
            const isNumberValid = phoneInput.current?.isValidNumber(number);
            
            if(isNumberValid){
                
                const formattedNumber = phoneObj.formattedNumber;
                const phoneDetails = {
                    number: phoneObj.number,
                    countryIsoCode: phoneInput.current?.getCountryCode(),
                    countryCode: phoneInput.current?.getCallingCode(),
                    formattedNumber: phoneObj.formattedNumber
                }
                
                Alert.alert(
                    null, // `Verification`,
                    `We will be verifying the phone number ${formattedNumber}. is this OK, or would like to edit the number?`,
                    [
                        {text: 'Edit', onPress: () => console.log('Edit Pressed')},
                        {text: 'OK', onPress: async() => await sendOTP(phoneDetails) },
                    ],
                    { cancelable: false }
                    );
                    
                }else{
                    Toast.show('Please enter a valid phone number', Toast.LONG);
                }
            }
        }
        
        const sendOTP = async(phone) => {
            
            const deviceId = getDeviceId();
            let deviceInfo = await AsyncStorage.getItem(ApiKeys.DEVICE_INFO);
            deviceInfo = JSON.parse(deviceInfo);
            const deviceToken =  deviceInfo[`${ApiKeys.DEVICE_TOKEN}`];
            const deviceLanguage =  deviceInfo[`${ApiKeys.DEVICE_LANGUAGE}`];
            const ipAddress = await getDeviceIpAddress();
            const currentVersion = getAppVersionName();
            
            const requestParams = {
                countryIsoCode: phone.countryIsoCode,
                countryCode: `+${phone.countryCode}`,
                number: phone.number,
                formattedNumber: phone.formattedNumber,
                uniqueDeviceId: deviceId,
                deviceToken: deviceToken,
                ipAddress: ipAddress,
                currentVersion: currentVersion,
                deviceLanguage: deviceLanguage,
            }
            console.log("Request parameters", requestParams);
            
            setIsLoading(true);
            
            let response = await sendSmsVerification(requestParams);
            console.log("API response", response);
            if(response.statusCode == 1){
                navigation.navigate("Otp",{
                    countryCode: response.data.country_code,
                    phoneNumber: response.data.phone_number,
                    otp: response.data.otp
                });
            }else{
                Alert.alert("Message", response.message);
            }
            setIsLoading(false);
            
        }
        
        return (
            
            <>
            
            <View style={styles.container}>
            <SafeAreaView style={styles.wrapper}>
            <FocusAwareStatusBar barStyle="light-content" backgroundColor={colors.primary} />
            <View style={styles.header}>
            <Text style={styles.text_header1}>Welcome!</Text>
            </View>
            
            <Animatable.View 
            animation="fadeInUpBig"
            style={[styles.body, {
                backgroundColor: colors.secondary
            }]}
            >
            
            <Text style={[styles.text_footer, {
                color: colors.dark
            }]}>Enter your Phone Number</Text>
            <View style={styles.action2}>
            
            
            <PhoneInput
            ref={phoneInput}
            defaultValue={value}
            defaultCode="UG"
            layout="first"
            onChangeText={(text) => {
                setValue(text);
            }}
            onChangeFormattedText={(text) => {
                setPhoneNumber(text);
            }}
            countryPickerProps={{ withAlphaFilter: true }}
            withShadow
            autoFocus
            />
            
            </View>
            
            <TouchableOpacity 
            style={styles.btnPrimary}
            onPress={() => confirmPhoneNumber()}
            >
            <Text style={styles.buttonText}>
            {isLoading ?  'Loading...' : 'Continue' } 
            </Text>
            </TouchableOpacity>
            
            <View style={styles.footer}>
            </View>
            
            
            </Animatable.View>
            </SafeAreaView>
            </View>
            
            {  isLoading ?  <AppLoader /> : null }
            
            </>
            );
        }
        
        export default SigninScreen
        
        const makeStyles = (colors) => StyleSheet.create({
            container: {
                flex: 1, 
                backgroundColor: colors.primary
            },
            wrapper: {
                flex: 1,
            },
            
            header: {
                flex: 1,
                justifyContent: 'flex-end',
                paddingHorizontal: 20,
                paddingBottom: 100
            },
            
            body: {
                flex: 3,
                borderTopLeftRadius: 30,
                borderTopRightRadius: 30,
                paddingHorizontal: 20,
                paddingVertical: 30,
                justifyContent: 'center',
                alignItems: 'center',
            },
            
            footer: {
                flex: 3,
                borderTopLeftRadius: 30,
                borderTopRightRadius: 30,
                paddingHorizontal: 20,
                paddingVertical: 30,
                justifyContent: 'center',
                alignItems: 'center',
            },
            
            header1: {
                paddingTop:20,
            },
            
            header2: {
                paddingTop:20,
            },
            
            
            text_header1: {
                color: colors.text,
                fontWeight: 'bold',
                fontSize: 30,
                textAlign: 'left',
            },
            
            text_header2: {
                color: colors.text,
                fontWeight: 'bold',
                fontSize: 25,
                textAlign: 'center',
                
            },
            buttonText:{
                color: colors.text,
                textTransform: 'capitalize',
                fontSize:18,
                fontWeight: 'bold',
            },
            
            text_footer: {
                color: '#05375a',
                fontSize: 16,
                fontWeight: 'bold',
                opacity:0.7,
            },
            action: {
                flexDirection: 'row',
                marginTop: 10,
                borderBottomWidth: 1,
                borderBottomColor: '#f2f2f2',
                paddingBottom: 5
            },
            action2: {
                // flexDirection: 'space-between',
                marginTop: 10,
                borderBottomWidth: 1,
                borderBottomColor: '#f2f2f2',
                paddingBottom: 5
            },
            actionError: {
                flexDirection: 'row',
                marginTop: 10,
                borderBottomWidth: 1,
                borderBottomColor: '#FF0000',
                paddingBottom: 5
            },
            textInput: {
                flex: 1,
                marginTop: Platform.OS === 'ios' ? 0 : -12,
                paddingLeft: 10,
                color: '#05375a',
                fontSize: 16,
            },
            errorMsg: {
                color: '#FF0000',
                fontSize: 14,
            },
            button: {
                alignItems: 'center',
                marginTop: 40
            },
            signIn: {
                width: '100%',
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: 8,
            },
            btnPrimary: {
                color: colors.text,
                borderRadius:25,
                height:55,
                backgroundColor: colors.primary,
                borderColor: colors.primary,
                position: 'absolute',
                bottom: 0,
                width: '100%',
                justifyContent: 'center',
                alignItems: 'center',
                fontWeight: 'bold',
                marginBottom: 40,
            },
            textSign: {
                fontSize: 17,
                fontWeight: 'bold'
            }
        });
        