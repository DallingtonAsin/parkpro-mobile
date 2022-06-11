import React, { useState } from "react";
import { SafeAreaView, View, StyleSheet, Alert, Text, TouchableOpacity } from "react-native";
import OTPInputView from "@twotalltotems/react-native-otp-input";
import design from '../../assets/css/styles';
import FontAwesome from 'react-native-vector-icons/FontAwesome5';
import { AuthContext } from '../context/context';
import FocusAwareStatusBar  from '../components/common/FocusAwareStatusBar';
import { useTheme } from '@react-navigation/native';
import AppLoader from '../components/loaders/AppLoader';
import Toast from 'react-native-simple-toast';
import CountDown from 'react-native-countdown-component';


const OtpInputScreen = ({ route, navigation }) => {

  const { otp, countryCode, phoneNumber } = route.params;
  const [invalidCode, setInvalidCode] = useState(false);
  const [message, setMessage] = useState("");
  const { verifyOTP, goToHomeScreen, resendSignupOTP } = React.useContext(AuthContext);
  const [otpCode, setOTP] = useState(otp);
  const [isLoading, setIsLoading] = useState(false);
  const [isTimerOn, setIsTimerOn] = useState(true);
  
  const { colors } = useTheme();
  const styles = makeStyles(colors);
  
  const submitOTP = async() => {
    try{
      if(otpCode){
        await verifyCustomerOtp(otpCode);
      }else{
        Toast.show('Please enter otp', Toast.LONG);
      }
    }catch(err){
      Toast.show(err.message, Toast.LONG);
    }
  }
  
  const resendOTP = async() => {
    try{
      
      if(countryCode && phoneNumber){
        
        const reqParams = {
          countryCode: countryCode,
          phoneNumber: phoneNumber
        }
        setIsTimerOn(true);
        const result = await resendSignupOTP(reqParams);
        console.log("Resend otp response", result);
        if(result.statusCode == "1"){
          const newOTP = result.data.otp;
          setOTP(newOTP);
        }else{
          Toast.show(result.message, Toast.LONG);
        }
        
      }else{
        Toast.show('Unable to capture your phone number', Toast.LONG);
      }
    }catch(err){
      Toast.show(err, Toast.LONG);
    }
    
  }
  
  const verifyCustomerOtp = async(code) => {

    try{

    if(!code){
      Toast.show('Please enter the sent OTP', Toast.LONG);
    }else{
      
      const reqParams = {
        country_code: countryCode,
        phone_number: phoneNumber,
        otp: code
      }
      setIsLoading(true);
      let response = await verifyOTP(reqParams); 
      const statusCode = response.statusCode;
      const message = response.message;
      const data = response.data;
      
      if(statusCode == 1){
        if(data.is_registered){
          await goToHomeScreen(data);
        }else{
          
          navigation.navigate("Signup",
          {userId: data.id,
            countryCode: data.country_code,
            phoneNumber: data.phone_number, 
          });
        }
      }else{
        setInvalidCode(true);
        setMessage(message);
      }
      setIsLoading(false);
    }
  }catch(err){
    Toast.show(err.message);
  }
  }
  
  return (
    <>
    <SafeAreaView style={styles.wrapper}>
    
    <TouchableOpacity onPress={() => { navigation.goBack() }} style={styles.goBackBtn} >
    <FontAwesome name="arrow-left" size={20} color={colors.primary}/> 
    </TouchableOpacity>
    
    <FocusAwareStatusBar barStyle="light-content" backgroundColor={colors.primary} />
    <Text style={styles.prompt}>Enter the code we sent you</Text>
    <Text style={styles.message}>
    {`Please enter the OTP sent to your phone number (${countryCode}${phoneNumber}).`}
    </Text>
    
    <OTPInputView
    style={{ width: "80%", height: 200 }}
    pinCount={4}
    autoFocusOnLoad
    code={otpCode ? otpCode :  otp }
    codeInputFieldStyle={styles.underlineStyleBase}
    codeInputHighlightStyle={styles.underlineStyleHighLighted}
    onCodeFilled= {(code => {
     setOTP(code)
    })}
    />

    <View style={{paddingRight:30, top: -60 , alignSelf: 'flex-end'}}>
    {
      isTimerOn ?
      <CountDown
      until={30}
      size={18}
      onFinish={() => setIsTimerOn(false)}
      digitStyle={{backgroundColor: '#FFF', borderWidth: 1, borderColor: design.colors.orange}}
      digitTxtStyle={{color: design.colors.orange, fontWeight: 'bold'}}
      timeLabelStyle={{color: design.colors.dark, fontWeight: 'normal', fontSize:14}}
      timeToShow={['S']}
      timeLabels={{ s: 'secs'}}
      />
      :<View style={{flexDirection: 'row', margin:10}}> 
      <Text style={{ fontSize:18 }}>Didn't receive any OTP? </Text>
      <TouchableOpacity style={{ marginLeft:8 }} onPress={() =>  resendOTP()}>
      <Text style={styles.underlinedText}>Resend now</Text>
      </TouchableOpacity>
      </View>
    }
    
    </View>
    
    
    {invalidCode && <Text style={styles.error}>{message}</Text>}
    
    <TouchableOpacity style={[design.btnPrimary, { color: '#fff',
    backgroundColor: colors.primary,
    borderColor: colors.primary}]} onPress={() => submitOTP()}>
    <Text style={styles.continueText}> 
    { isLoading 
    ? <Text>Loading...</Text> 
    : <Text style={{ textTransform: 'uppercase', fontWeight: 'bold'}}>Verify</Text> } 
    </Text>
    </TouchableOpacity>
    </SafeAreaView>
    {  isLoading ?  <AppLoader /> : null }
    
    </>
    );
  };
  
  const makeStyles = (colors) => StyleSheet.create({
    wrapper: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: colors.body,
    },
    
    borderStyleBase: {
      width: 30,
      height: 45,
    },
    
  
    underlineStyleBase: {
      width: 70,
      height: 70,
      borderWidth: 1,
      color: design.colors.dark,
      fontSize: 20
    },
    
    underlineStyleHighLighted: {
      borderColor: "#03DAC6",
    },
    
    prompt: {
      fontSize: 24,
      paddingHorizontal: 30,
      paddingBottom: 20,
    },
    
    message: {
      textAlign: 'center',
      fontSize: 16,
      paddingHorizontal: 30,
    },
    
    error: {
      color: "red",
      fontSize:16,
    },
    
    button: {
      marginTop: 20,
      height: 60,
      width: 330,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: colors.primary, 
      shadowColor: "rgba(0,0,0,0.4)",
      shadowOffset: {
        width: 1,
        height: 5,
      },
      shadowOpacity: 0.34,
      shadowRadius: 6.27,
      elevation: 20,
      borderRadius:5,
      flexDirection: 'row',
    },
    
    btnContinue: {
      marginTop: 20,
      height: 60,
      width: 330,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: colors.secondary, 
      shadowColor: "rgba(0,0,0,0.4)",
      shadowOffset: {
        width: 1,
        height: 5,
      },
      shadowOpacity: 0.34,
      shadowRadius: 6.27,
      elevation: 20,
      borderRadius:5,
      flexDirection: 'row',
      borderColor: colors.primary,
      borderWidth:1,
    },
    
    continueText: {
      color: design.colors.white,
      fontSize: 18,
      textAlign: 'center',
      marginLeft:10,
    },
    
    backText: {
      color: "white",
      fontSize: 18,
      textAlign: 'center',
      left:20,
    },
    
    goBackBtn: {
      position: 'absolute',
      left: 25,
      top: 30
    },
    
    underlinedText: {
      textAlign: 'center',
      fontWeight: 'bold',
      fontStyle: 'italic',
      fontSize: 18,
      textDecorationLine: 'underline'
    }
    
    
  });
  
  export default OtpInputScreen;
