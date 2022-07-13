import React, {useState, useContext,  useRef} from 'react';
import { Text,TextInput, TouchableOpacity, View, StyleSheet, SafeAreaView, Alert, Platform} from 'react-native';
import design from '../../assets/css/styles';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { AuthContext } from '../context/context';
import { UIActivityIndicator } from 'react-native-indicators';
import ProfileContext from '../context/index';
import Toast from 'react-native-simple-toast';
import FocusAwareStatusBar  from '../components/common/FocusAwareStatusBar';
import { useTheme } from '@react-navigation/native';
import AppLoader from '../components/loaders/AppLoader';
import PhoneInput from "react-native-phone-number-input";
import { removeLeadingZeros } from '../components/sharedHelper/AppUtils';
import OTPInputView from "@twotalltotems/react-native-otp-input";

const ChangePhoneNumberScreen = ({ navigation }) => {
  
  const [isLoading, setIsLoading] = useState(false);
  const { profile, setProfile } = useContext(ProfileContext);
  
  const [newCountryCode, setNewCountryCode] = useState("");
  const [newPhoneNumber, setNewPhoneNumber] = useState("");
  
  const [value, setValue] = useState("");
  const [otpCode, setOTP] = useState("");
  
  const [isOtpSent, setIsOtpSent] = useState(false);
  
  const phoneInput = useRef(null);
  
  const { verifyChangePhoneNumber, changePhoneNumber, syncProfileData } = React.useContext(AuthContext);
  
  const { colors } = useTheme();
  const styles = makeStyles(colors);
  
  const sendChangePhoneNumberReq = (data) => {
    try{
      
      if(!data.countryCode){
        Toast.show(`Please select country code`, Toast.LONG);
        return;
      }
      
      if(!data.phoneNumber){
        Toast.show(`Please your new phone number`, Toast.LONG);
        return;
      }
      
      if(!profile.id){
        Toast.show(`Please select country code`, Toast.LONG);
        return;
      }
      
      let phoneDetails = {
        id: profile.id,
        countryCode: data.countryCode,
        phoneNumber: data.phoneNumber
      }
      console.log("Phone details opps", phoneDetails);
 
      setIsLoading(true);
      
      verifyChangePhoneNumber(phoneDetails).then((response) => {
        setIsLoading(false);
        
        if(response.statusCode == '1'){
          setIsOtpSent(true);
          setOTP(response.data.otp);
        }else{
          Toast.show(response.message, Toast.LONG);
        }
        
      }).catch(err => {
        setIsLoading(false);
        Toast.show(err.message);
      });
      
    }catch(err){
      setIsLoading(false);
      Toast.show(err.message);
    }
  }
  
  const changeUserPhoneNumber = () => {
    try{
      
      if(!otpCode){
        Toast.show(`Please enter otp`, Toast.LONG);
        return;
      }
      
      const data = {
        id: profile.id,
        countryCode: newCountryCode,
        phoneNumber: newPhoneNumber,
        otp: otpCode,
      }
      
      setIsLoading(true);
      
      changePhoneNumber(data).then(async (response) => {
        setIsLoading(false);

        if(response.statusCode == '1'){

          setIsOtpSent(false);
          const customer = response.data;
          setProfile(customer);
          await syncProfileData(customer);
          setNewCountryCode("");
          setNewPhoneNumber("");
          navigation.navigate(`Home`);
          
        }else{
          Toast.show(response.message, Toast.LONG);
        }
      
      }).catch(err => {
        setIsLoading(false);
        Toast.show(err.message)
      });
      
    }catch(err){
      setIsLoading(false);
      Toast.show(err.message);
    }
  }
  
  const confirmChangePhoneNumber = () => {
    
    const phoneObj = phoneInput.current?.getNumberAfterPossiblyEliminatingZero();
    let number = phoneObj.number;
    
    const startsWithZero = number.startsWith("0");
    if(startsWithZero){
      number = removeLeadingZeros(number);
    }
    
    if(value.length != 9){
      Toast.show('Please enter a valid phone number', Toast.LONG);
    }else{
      
      const isNumberValid = phoneInput.current?.isValidNumber(number);
      if(isNumberValid){
        
        const currentPhoneNumber = `${profile.country_code}${profile.phone_number}`;
        const formattedNumber = `+${phoneInput.current?.getCallingCode()}${number}`// phoneObj.formattedNumber;
        
        if(currentPhoneNumber == formattedNumber){
          Toast.show(`Your new phone number is similar to the current phone number.`, Toast.LONG);
          return;
        }
        
        let countryCode =  phoneInput.current?.getCallingCode();
        console.log("country code", countryCode);

        setNewCountryCode(`+${countryCode}`);
        setNewPhoneNumber(number);
        
        const changePhoneDetails = {
          id: profile.id,
          countryCode: `+${countryCode}`,
          phoneNumber: number,
        }
        
        console.log(`change phone number details`, changePhoneDetails);
        
        Alert.alert(
          null, 
          `We will be verifying your new phone number ${formattedNumber}. is this OK, or would like to edit the number?`,
          [
            {text: 'Edit', onPress: () => console.log('Edit Pressed')},
            {text: 'OK', onPress: async() => await sendChangePhoneNumberReq(changePhoneDetails) },
          ],
          { cancelable: false }
          );
          
        }else{
          Toast.show('Please enter a valid phone number', Toast.LONG);
        }
      }
    }
    
    
    return(
      <>
      
      <SafeAreaView style={styles.container}>
      
      <FocusAwareStatusBar barStyle="light-content" backgroundColor={colors.primary} />
      
      { !isOtpSent &&
        
        <View style={styles.body}>
        <Text style={[styles.text_footer, {
          color: colors.dark
        }]}>Enter your new phone number</Text>
        
        <View style={styles.action2}>
        <PhoneInput
        ref={phoneInput}
        defaultValue={value}
        defaultCode="UG"
        layout="first"
        onChangeText={(text) => {
          setValue(text);
        }}
        countryPickerProps={{ withAlphaFilter: true }}
        withShadow
        autoFocus
        />
        </View>
        </View>
        
      }
      
      
      { isOtpSent &&  <View style={styles.body}>
      
      <Text style={styles.prompt}>Enter the code we sent you</Text>
      <Text style={styles.message}> {`Please enter the OTP sent to your phone number (${newCountryCode}${newPhoneNumber}).`}</Text>
      
      <OTPInputView
      style={{ width: "80%", height: 200, alignSelf: 'center' }}
      pinCount={4}
      autoFocusOnLoad
      code={otpCode}
      codeInputFieldStyle={styles.underlineStyleBase}
      codeInputHighlightStyle={styles.underlineStyleHighLighted}
      onCodeFilled= {(code => {
        setOTP(code)
      })}
      />
      </View>
    }
    
    <View style={styles.footer}>
    
    {
      !isOtpSent && !isLoading && <TouchableOpacity 
      style={[design.btnPrimary, styles.submit]}
      onPress={confirmChangePhoneNumber}>
      <Text style={styles.submitText}>{isLoading ? 'Updating...' : 'Submit' }</Text>
      </TouchableOpacity>
    }  
    
    {
      isOtpSent && !isLoading && <TouchableOpacity 
      style={[design.btnPrimary, styles.submit]}
      onPress={changeUserPhoneNumber}>
      <Text style={styles.submitText}>{ isLoading ? 'Updating...' : 'Verify OTP' }</Text>
      </TouchableOpacity>
    }  
    
    
    </View>
    
    
    
    </SafeAreaView>
    
    
    {  isLoading &&  <AppLoader />  }
    
    </>
    );
    
    
  }
  
  
  export default ChangePhoneNumberScreen
  
  const makeStyles = (colors) => StyleSheet.create({
    container: {
      flex:1,
      backgroundColor: colors.body,
    },
    
    header:{
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: design.colors.silver,
      flexDirection: 'row',
    },
    
    body:{
      flex: 3,
      padding:15,
      alignSelf: 'center',
      justifyContent: 'center'
    },
    
    footer:{
      flex:1,
      // marginBottom: 30,
      flexDirection: 'row',
      alignItems: 'center',
      alignSelf: 'center',
      justifyContent: 'center',
    },
    
    text:{
      color: colors.dark, 
      fontWeight: 'bold',
      opacity:0.7,
      textTransform:'capitalize',
      fontSize:16,
    },
    
    
    name:{
      fontSize:20,
      color: "#696969",
      fontWeight: "600"
    },
    
    form: {
      padding: 12,
    },
    
    input:{
      borderBottomColor: 'lightblue',
      borderBottomWidth:1,
      fontSize:17,
      color: design.colors.dark
    },
    
    
    textInput: {
      flex: 1,
      marginTop: Platform.OS === 'ios' ? 0 : -4,
      paddingLeft: 10,
      color: 'green',
      marginLeft: 10,
      fontSize:15,
    },
    
    icon: {
      padding: 20,
      borderWidth: 1,
      borderRadius: 50,
    },
    
    uploadOptions:{
      flexDirection: 'column', 
      justifyContent: 'center',
      alignItems: 'center'
    },
    
    
    button: {
      color: '#fff',
      borderRadius:5,
      padding:15,
      backgroundColor: design.colors.primary,
      borderColor: design.colors.primary,
      position: 'absolute',
      bottom: 0,
      width: '90%',
      justifyContent: 'center',
      alignItems: 'center',
    },
    
    text_footer: {
      color: '#05375a',
      fontSize: 16,
      fontWeight: 'bold',
      opacity:0.7,
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
      fontSize: 22,
      paddingHorizontal: 30,
      paddingBottom: 20,
    },
    
    message: {
      textAlign: 'center',
      fontSize: 16,
      paddingHorizontal: 30,
    },
    
    submit:{
      color: '#fff',
      backgroundColor: colors.primary,
      borderColor: colors.primary
    },
    
    submitText:{
      color:'#fff',
      textTransform:'uppercase',
      fontSize:18,
      fontWeight: 'bold'
    }
    
    
  })
  
  
  
  
  