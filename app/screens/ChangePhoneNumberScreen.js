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


const ChangePhoneNumberScreen = () => {
  
  const [isLoading, setIsLoading] = useState(false);
  const { profile } = useContext(ProfileContext);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [value, setValue] = useState("");
  const phoneInput = useRef(null);
  
  const { verifyChangePhoneNumber } = React.useContext(AuthContext);
  
  const { colors } = useTheme();
  const styles = makeStyles(colors);
  
  const confirmChangePhoneNumber = () => {
    
    const phoneObj = phoneInput.current?.getNumberAfterPossiblyEliminatingZero();
    let number = phoneObj.number;
    
    const startsWithZero = number.startsWith("0");
    if(startsWithZero){
      number = removeLeadingZeros(number);
    }
    
    if(phoneNumber.length < 13){
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
        
        const changePhoneDetails = {
          userId: profile.id,
          number: number,
          countryCode: phoneInput.current?.getCallingCode(),
          formattedNumber: formattedNumber
        }
        
        Alert.alert(
          null, 
          `We will be verifying your new phone number ${formattedNumber}. is this OK, or would like to edit the number?`,
          [
            {text: 'Edit', onPress: () => console.log('Edit Pressed')},
            {text: 'OK', onPress: async() => await verifyChangePhoneNumber(changePhoneDetails) },
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
      onChangeFormattedText={(text) => {
        setPhoneNumber(text);
      }}
      countryPickerProps={{ withAlphaFilter: true }}
      withShadow
      autoFocus
      />
      
      </View>
      
      </View>
      
      <View style={styles.footer}>
      <TouchableOpacity 
      style={[design.btnPrimary, { color: '#fff',
      backgroundColor: colors.primary,
      borderColor: colors.primary}]}
      onPress={confirmChangePhoneNumber}>
      <Text style={{color:'#fff', textTransform:'capitalize', fontSize:16, fontWeight: 'bold'}}>
      {isLoading ? 'Updating...' : 'Submit' } 
      </Text>
      </TouchableOpacity>
      </View>
      
      </SafeAreaView>
      
      
      {  isLoading ?  <AppLoader /> : null }
      
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
      
      
    })
    
    
    
    
    