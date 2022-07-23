import React, {useEffect, useState,useContext, useRef } from 'react';
import { Text,
  TextInput, 
  View, 
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView ,
  StyleSheet} from 'react-native';
  import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
  import design from '../../assets/css/styles';
  import { TextInput as RNTextInput, Title } from 'react-native-paper';
  import PushNotification, {Importance} from "react-native-push-notification";
  import { AuthContext } from '../context/context';
  import ProfileContext from '../context/index';
  import {MIN_TOPUP_AMOUNT, MAX_TOPUP_AMOUNT} from '@env';
  import FocusAwareStatusBar  from '../components/common/FocusAwareStatusBar';
  import { useTheme  } from 'react-native-paper';
  import AppLoader from '../components/loaders/AppLoader';
  import Toast from 'react-native-simple-toast';
  import { numberWithCommas} from '../components/sharedHelper/AppUtils';
  import PhoneInput from "react-native-phone-number-input";
  
  
  PushNotification.configure({
    onNotification: function (notification) {
      console.log('LOCAL NOTIFICATION ==>', notification);
    },
    requestPermissions: Platform.OS === 'ios',
  });
  
  PushNotification.createChannel({
    channelId: "topup-notifications", 
    channelName: "topup-notifications", 
    importance: Importance.HIGH,
  },
  (created) => {}
  );
  
  
  const initialState = {
  
    // top up state
    hasRecharged: null,
    rechargeResponse: null,
    rechargeAmount: '',
    disabledColor: '#C1C1C1',
    topBtnDisabled: true,
    TopButtonBgColor: design.colors.primary,
    warningColor: design.colors.dark,
    animating: false,
    loading: false,
    editMode: false,
    
  }
  
  
  const TopUpScreen = () => {
    
    const [state, setData] = useState(initialState);
    const [isLoading, setIsLoading] = useState(false);
    const { asyncCustomerProfile, syncProfileData, depositMoney } = React.useContext(AuthContext);
    const {profile, setProfile} = useContext(ProfileContext);
    const min_recharge_amount = MIN_TOPUP_AMOUNT;
    const max_recharge_amount = MAX_TOPUP_AMOUNT;
    const { colors } = useTheme();
    const styles = makeStyles(colors);
    
    const phoneInput = useRef(null);
    const [value, setValue] = useState(profile.phone_number);


    const getPhoneNumberFromRef = () => {
      const phoneObj = phoneInput.current?.getNumberAfterPossiblyEliminatingZero();
      let number = phoneObj.number;
      const startsWithZero = number.startsWith("0");
      number = startsWithZero ? removeLeadingZeros(number) : number;
      return number;
    }

    const RechargeUserAccount = async() => {
      try{
        
        
        if(!state.rechargeAmount){
          Toast.show('Please enter amount to topup your account', Toast.LONG);
          return;
        }
        
        if(state.rechargeAmount){
          const rechargeAmount = parseFloat(state.rechargeAmount);
          if(rechargeAmount < MIN_TOPUP_AMOUNT){
            Toast.show(`Please enter amount greater than ${numberWithCommas(MIN_TOPUP_AMOUNT)}`, Toast.LONG);
            return;
          } 
          if(rechargeAmount > MAX_TOPUP_AMOUNT){
            Toast.show(`Please enter amount less than ${numberWithCommas(MAX_TOPUP_AMOUNT)}`, Toast.LONG);
            return;
          }
        }
        
        if(!value){
          Toast.show('Please enter phone number to withdraw from.', Toast.LONG);
          return;
        }
        
        if(value){

          let number = getPhoneNumberFromRef();
          if(number.length != 9){
            Toast.show('Please enter a valid phone number', Toast.LONG);
            return;
          }
          
        }

        if(!profile.id){
          Toast.show('Unable to capture your profile details', Toast.LONG);
          return;
        }
        
        let amount = state.rechargeAmount;
        amount = parseFloat(amount.replace(/[^\d.]+/g, ''));
        let countryCode =  phoneInput.current?.getCallingCode();
        
        
        const data = {
          customer_id: profile.id,
          amount: state.rechargeAmount,
          country_code: countryCode,
          phone_number: getPhoneNumberFromRef(),
        }

        const res = await depositMoney(data);
        console.log("Response for top up is", res);
        const statusCode = res.statusCode;
        const message = res.message;
        
        if(statusCode == 1){
          
          const customer = res.data;
          await asyncCustomerProfile(state.id);
          
          setProfile(customer);
          await syncProfileData(customer);
          await getProfile(customer);
          
          Toast.show(message);
          testPushNotification();
          setData({
            ...state,
            rechargeAmount: '',
          });
        }else{
          Toast.show(res.message, Toast.LONG);
        }
        
        setIsLoading(false);
        
      }catch(err){
        Toast.show(err.message, Toast.LONG);
      }
      setIsLoading(false);
    }
    
    
    const onChangeAmount = (val) => {
      let num = numberWithCommas(val);
      setData({
        ...state,
        rechargeAmount: val
      });
    }
    

    const testPushNotification = () => {
      PushNotification.localNotification({
        channelId: "ParkPro256",
        color: "red", 
        title: "Message", 
        message: "Transaction successful", 
        playSound: true,
        soundName: "default",
        timeoutAfter: 8000,
      });
    }
    
    
    const getProfile = (user) => {         
      const id = user.id;
      const first_name = user.first_name;
      const last_name = user.last_name;
      const name = (first_name && last_name) ? first_name + " " + last_name : '';
      const country_code = user.country_code;
      const phone_number = user.phone_number;
      const email = user.email;
      const account_balance = user.account_balance;
      setData({
        ...state,
        id: id,
        name: name,
        first_name: first_name,
        last_name: last_name,
        country_code: country_code,
        phone_number: phone_number,
        email: email,
        balance: account_balance
      });
    }
    
    useEffect(() => {

      let isMounted = true;
      if(isMounted) {
        getProfile(profile);
      }
      return () => { isMounted = false };
    }, []);
    
   
    return (
      
      <>
      <KeyboardAvoidingView style={styles.container}  behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 40 : -200}>
      
      {  isLoading ?  <AppLoader /> : null }
      
      <FocusAwareStatusBar barStyle="light-content" backgroundColor={colors.primary} />
      
      <ScrollView  style={styles.contentContainer}>
      
      
      {state.hasRecharged ?
        <Text style={{ color: design.colors.green, marginLeft: 18 }}>{state.rechargeResponse}</Text>
        : null}
        
        {state.hasRecharged == false
          ? <Text style={{ color: state.disabledColor, marginLeft: 18 }}>{state.rechargeResponse}</Text>
          : null}
          
          
          <View style={{ margin: 20 }}>
          <Text style={{ fontSize: 15, opacity: 0.7, fontWeight:'bold'  }}>Enter amount </Text>
          <RNTextInput
          mode={'outlined'}
          placeholder="Eg. 10,000"
          value={state.rechargeAmount}
          keyboardType='numeric'
          label="Topup amount"
          selectionColor={colors.primary}
          underlineColor={colors.primary}
          outlineColor={colors.primary}
          activeUnderlineColor={colors.primary}
          activeOutlineColor={colors.primary}
          onChangeText={(text) => { onChangeAmount(text) }}
          style={{backgroundColor: colors.body, color: colors.primary }}
          theme={{ colors: { text: design.colors.dark } }}
          />
          <Text style={{ opacity: 0.5, color: state.warningColor, fontSize:15 }}>Min: {numberWithCommas(min_recharge_amount)} and Max: {numberWithCommas(max_recharge_amount)}</Text>
          </View>
          
          <Title style={{ fontSize: 15, opacity: 0.7, color: '#000', margin:15 }}>Mobile Money Number </Title>
          
          <View style={{ margin: 20 }} >
          
          
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
        
        </ScrollView >
        
        <View style={styles.bottom}>
        <TouchableOpacity
        style={[design.btnPrimary, { color: '#fff',
        backgroundColor: colors.primary,
        borderColor: colors.primary}]}
        onPress={RechargeUserAccount}
        disabled={false}>
        <Text style={styles.paymentButtonText}> 
        {isLoading ? 'Loading...' : 'CONFIRM TOPUP' }
        </Text>
        </TouchableOpacity>
        
        </View>
        </KeyboardAvoidingView>
        
        </>
        
        );
      }
      
      export default TopUpScreen
      
      
      const makeStyles = (colors) => StyleSheet.create({
        container:{
          flex:1,
          borderColor:'#C0C0C0',
          backgroundColor: colors.body,
          shadowColor: '#e2e2e2',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.7,
          shadowRadius: 2,
          elevation: 1,
        },
        contentContainer:{
          flex:1,
        },
        TopupBtn: {
          alignSelf:'center' , 
        },
        
        paymentButton: {
          borderRadius:5,
          backgroundColor: colors.primary,
          borderColor: colors.primary,
          position: 'absolute',
          bottom: 0,
          width: '90%',
        },
        
        bottom:{
          // marginBottom: 30,
          flexDirection: 'row',
          alignItems: 'center',
          alignSelf: 'center',
          justifyContent: 'center',
          
        },
        paymentButtonText: {
          fontSize: 18,
          color: design.colors.white,
          textTransform: 'capitalize',
          fontWeight: 'bold'
        },
        
        textInput: {
          borderBottomWidth: 1,
          backgroundColor: design.colors.white,
          fontWeight: 'normal',
          borderRadius:30,
          borderWidth:1,
        },
        
        inputBox: {
          borderBottomWidth: 1,
          borderBottomColor: 'gray',
        },
        
        card: {
          margin: 15,
          padding:30,
          borderWidth:1,
          borderRadius: 10,
          borderColor:'#e2e2e2',
          justifyContent: 'center',
          backgroundColor: colors.primary,
          alignItems:'center'
        }
      })