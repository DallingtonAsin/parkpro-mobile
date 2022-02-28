import React, { useState } from "react";
import { SafeAreaView, StyleSheet, Alert, Text, TouchableOpacity } from "react-native";
import OTPInputView from "@twotalltotems/react-native-otp-input";
import design from '../../assets/css/styles';
import FontAwesome from 'react-native-vector-icons/FontAwesome5';
import { AuthContext } from '../context/context';
import { UIActivityIndicator } from 'react-native-indicators';

const OtpInputScreen = ({ route, navigation }) => {
 const { otp, phoneNumber } = route.params;
 const [invalidCode, setInvalidCode] = useState(false);
 const [message, setMessage] = useState("");
 const { verifyOTP, goToHomeScreen } = React.useContext(AuthContext);
 const [otpCode, setOTP] = useState("");
 const [isSending, setIsSending] = useState(false);

 const verifyOTPCode = async(code) => {
      verifyCustomerOtp(code);
 }

 const onClickContinue = () => {
      verifyCustomerOtp(otp);
 }

 const verifyCustomerOtp = async(code) => {
  if(!code){
    Alert.alert("Info", "Please enter the sent OTP");
   }else{
   const data = {
      phone_number: phoneNumber,
      otp: code
   }
   setIsSending(true);
  await verifyOTP(data).then(async(response) => {
    const statusCode = response.statusCode;
    const message = response.message;
    const data = response.data;
    console.log("Got this response", response);
    if(statusCode == 1){
      if(data.is_registered){
        await goToHomeScreen(data);
      }else{
        navigation.navigate("Signup", {userId: data.id, phoneNumber: phoneNumber });
      }
    }else{
      setInvalidCode(true);
      setMessage(message);
    }
    setIsSending(false);
   });
  }
 }

 return (
   <SafeAreaView style={styles.wrapper}>
     <Text style={styles.prompt}>Enter the code we sent you</Text>
     <Text style={styles.message}>
       {`Your phone (${phoneNumber}) will be used to protect your account each time you log in.`}
     </Text>
    
     <OTPInputView
       style={{ width: "80%", height: 200 }}
       pinCount={4}
       autoFocusOnLoad
       codeInputFieldStyle={styles.underlineStyleBase}
       codeInputHighlightStyle={styles.underlineStyleHighLighted}
       code={otp}
       onCodeFilled={(code) => {
        setOTP(otp);
        verifyOTPCode(code);
       }}
     />
     {invalidCode && <Text style={styles.error}>{message}</Text>}

     <TouchableOpacity
           style={styles.btnContinue}
           onPress={() => onClickContinue()}
         >
          
           <Text style={styles.continueText, {color: design.colors.dark}}> 
           {isSending ? <UIActivityIndicator color='black' size={27} /> : 
            <> <FontAwesome name="arrow-right" size={15} color={design.colors.dark}/> <Text>Continue</Text></>
           } 
           </Text>
       
         </TouchableOpacity>

     <TouchableOpacity
           style={styles.button}
           onPress={() => {
                navigation.goBack();
          }}
         >
           <FontAwesome name="arrow-left" size={15} color={design.colors.white}/>
           <Text style={styles.backText} >Go Back</Text>
       
         </TouchableOpacity>
   </SafeAreaView>
 );
};

const styles = StyleSheet.create({
 wrapper: {
   flex: 1,
   justifyContent: "center",
   alignItems: "center",
 },

 borderStyleBase: {
   width: 30,
   height: 45,
 },

 borderStyleHighLighted: {
   borderColor: "#03DAC6",
 },

 underlineStyleBase: {
   width: 30,
   height: 45,
   borderWidth: 0,
   borderBottomWidth: 1,
   color: "black",
   fontSize: 20,
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
  backgroundColor: design.colors.primary, 
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
  backgroundColor: design.colors.white, 
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
  borderColor: design.colors.primary,
  borderWidth:1,
},

continueText: {
  color: "white",
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
  paddingLeft:20,
  paddingRight:20,
},
});

export default OtpInputScreen;
