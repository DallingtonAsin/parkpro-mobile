import React, {useState, useRef} from 'react';
import { 
    View, 
    Text, 
    TouchableOpacity, 
    SafeAreaView,
    Platform,
    StyleSheet ,
    StatusBar,
    Alert
} from 'react-native';

import * as Animatable from 'react-native-animatable';
import { useTheme  } from 'react-native-paper';
import { AuthContext } from '../context/context';
import PhoneInput from "react-native-phone-number-input";
import { UIActivityIndicator } from 'react-native-indicators';
import FocusAwareStatusBar  from '../components/common/FocusAwareStatusBar';
import design from '../../assets/css/styles';
import { getDeviceId, getDeviceIpAddress, getAppVersionName } from '../components/SharedCommons';

const SigninScreen = ({ navigation }) => {
    
    const { colors } = useTheme();
    const [value, setValue] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [isSending, setIsSending] = useState(false);
    const phoneInput = useRef(null);
    const { sendSmsVerification } = React.useContext(AuthContext);
    
    const sendOTP = async() => {

        if(phoneNumber.length < 13){
            Alert.alert("Error", "Enter a valid phone number");
        }
        else{

            const phoneObj = phoneInput.current?.getNumberAfterPossiblyEliminatingZero();
            const number = phoneObj.number;
            const isNumberValid = phoneInput.current?.isValidNumber(number);
            
            if(isNumberValid){
                
                const countryIsoCode = phoneInput.current?.getCountryCode();
                const countryCode = phoneInput.current?.getCallingCode();
                
                const formattedNumber = phoneObj.formattedNumber;
                const deviceId = getDeviceId();
                const ipAddress = await getDeviceIpAddress();
                const currentVersion = getAppVersionName();
              
                const requestParams = {
                    countryIsoCode: countryIsoCode,
                    countryCode: `+${countryCode}`,
                    number: number,
                    formattedNumber: formattedNumber,
                    uniqueDeviceId: deviceId,
                    ipAddress: ipAddress,
                    currentVersion: currentVersion
                }
                setIsSending(true);
                
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
                setIsSending(false);
            }else{
                Alert.alert("Error", "Enter a valid phone number");
            }
        }
        
    }
    
    return (
        
        <>
        
        <View style={styles.container}>
        <SafeAreaView style={styles.wrapper}>
        <FocusAwareStatusBar barStyle="light-content" backgroundColor={design.colors.primary} />
        <View style={styles.header}>
        <View style={styles.header1}>
        <Text style={styles.text_header1}>Welcome!</Text>
        </View>
        <View style={styles.header2}>
        <Text style={styles.text_header2}>Register/Login</Text>
        </View>
        </View>
        
        <Animatable.View 
        animation="fadeInUpBig"
        style={[styles.body, {
            backgroundColor: colors.background
        }]}
        >
        
        
        
        <Text style={[styles.text_footer, {
            color: colors.text
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
        onPress={() => sendOTP()}
        >
        <Text style={styles.buttonText}>
        {isSending ? <UIActivityIndicator color='white' size={27} /> : 'Continue' } 
        </Text>
        </TouchableOpacity>
        
        <View style={styles.footer}>
        </View>
        
        
        </Animatable.View>
        </SafeAreaView>
        </View>
        
        </>
        );
    }
    
    export default SigninScreen
    
    const styles = StyleSheet.create({
        container: {
            flex: 1, 
            backgroundColor: '#273746'
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
            color: '#fff',
            fontWeight: 'bold',
            fontSize: 30,
            textAlign: 'center',
        },
        
        text_header2: {
            color: '#fff',
            fontWeight: 'bold',
            fontSize: 25,
            textAlign: 'center',
            
        },
        buttonText:{
            color: "#fff",
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
            color: '#fff',
            borderRadius:25,
            height:60,
            backgroundColor: '#273746',
            borderColor: '#273746',
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
    