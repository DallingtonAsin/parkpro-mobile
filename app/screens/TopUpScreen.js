import React, {useEffect, useState,useContext } from 'react';
import { Text,
  TextInput, 
  View, 
  ScrollView,
  TouchableOpacity,
  Alert,StatusBar,KeyboardAvoidingView ,
  StyleSheet} from 'react-native';
  import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
  import design from '../../assets/css/styles';
  import { TextInput as RNTextInput, Avatar, Card, Title, Paragraph } from 'react-native-paper';
  import PushNotification, {Importance} from "react-native-push-notification";
  import { UIActivityIndicator } from 'react-native-indicators';
  import { AuthContext } from '../context/context';
  import ProfileContext from '../context/index';
  import {MIN_TOPUP_AMOUNT, MAX_TOPUP_AMOUNT} from '@env';
  import FocusAwareStatusBar  from '../components/common/FocusAwareStatusBar';
  // import ReactDOM from "react-dom";
  
  
  PushNotification.configure({
    onNotification: function (notification) {
      console.log('LOCAL NOTIFICATION ==>', notification);
    },
    
    // This line solves the problem that I was facing.
    requestPermissions: Platform.OS === 'ios',
  });
  
  PushNotification.createChannel({
    channelId: "ParkPro256", 
    channelName: "ParkPro", 
    importance: Importance.HIGH,
  },
  (created) => {}
  );
  
  
  const initialState = {
    
    // Profile state
    id: null,
    name: '',
    firstname: '',
    lastname: '',
    username: '',
    phone_number: '',
    email: '',
    
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
    
    const RechargeUserAccount = async() => {
      try{
        if(profile.id){
          
          const rechargeAmount = parseFloat(state.rechargeAmount);
          
          console.log(state.rechargeAmount);
          console.log(MIN_TOPUP_AMOUNT);
          console.log(MAX_TOPUP_AMOUNT);
          
          if (state.phone_number && state.rechargeAmount ) {
            if(rechargeAmount >= MIN_TOPUP_AMOUNT && rechargeAmount <= MAX_TOPUP_AMOUNT){
              let amount = state.rechargeAmount;
              amount = parseFloat(amount.replace(/[^\d.]+/g, ''));
              
              console.log('Mobile money', state.phone_number);
              console.log('Amount', state.rechargeAmount);
              setIsLoading(true);
              const data = {
                customer_id: state.id,
                amount: state.rechargeAmount,
                phone_number: state.phone_number,
              }
              
              await depositMoney(data).then(async res => {
                console.log("Response for top up is", res);
                const statusCode = res.statusCode;
                const message = res.message;
                
                setIsLoading(false);
                if(statusCode == 1){
                  const customer = res.data;
                  let result = await asyncCustomerProfile(state.id);
                  console.log("Async response on top up", result);
                  console.log("User data after topping up", customer);
                  
                  setProfile(customer);
                  await syncProfileData(customer);
                  await getProfile(customer);
                  
                  Alert.alert("Message", message);
                  testPushNotification();
                  setData({
                    ...state,
                    rechargeAmount: '',
                  });
                }else{
                  Alert.alert("Message", res.message);
                }
                
              }).catch(error => { 
                setIsLoading(false);
                Alert.alert("Error","Unable to topup account: " + error);
              });
              
            }else{
              Alert.alert("Message", "Enter amount greater than "+min_recharge_amount+" and less than "+max_recharge_amount+"  to top up your account.")
            }
            
          } else {
            Alert.alert("Information", "Enter amount to top up your account.")
          }
          
        } else {
          Alert.alert("Information", "Unable to get logged in user.")
        }
        
      }
      catch(error){
        console.log('mobile money error', error);
      }
    }
    
    
    const onChangeAmount = (val) => {
      setData({
        ...state,
        rechargeAmount: val
      });
    }
    
    const onChangePhoneNumber = (val) => {
      setData({
        ...state,
        phone_number: val,
      });
    }
    
    const savePhoneNumber = () => {
      setData({
        ...state,
        phone_number: state.phone_number,
        editMode: false,
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
      const phone_number = user.phone_number;
      const email = user.email;
      const account_balance = user.account_balance;
      setData({
        ...state,
        id: id,
        name: name,
        first_name: first_name,
        last_name: last_name,
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
    
    
    
    const editPhone = () => {
      setData({
        ...state,
        editMode: true
      });
    }
    
    
    return (
      
      <KeyboardAvoidingView style={styles.container}  behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 40 : -200}>
      
      <FocusAwareStatusBar barStyle="light-content" backgroundColor={design.colors.primary} />
      
      <ScrollView  style={styles.contentContainer}
      
      >
      <Card style={{ margin: 15, padding:30, borderWidth:1, borderRadius: 10, borderColor:'#e2e2e2',
      JustifyContent: 'center', backgroundColor:design.colors.primary, alignItems:'center' }}>
      <Card.Content>
      <Text style={{color:'#fff', opacity:0.7, textAlign: 'center', fontSize:22}}>Wallet Balance</Text>
      <Paragraph style={{color:'#fff', opacity:0.9, fontWeight:'bold', fontSize:19,padding:10, textAlign: 'center'}}>UGX.<Text>{profile.account_balance}</Text></Paragraph>
      </Card.Content>
      </Card>
      
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
          selectionColor={design.colors.primary}
          underlineColor={design.colors.primary}
          outlineColor={design.colors.primary}
          activeUnderlineColor={design.colors.primary}
          activeOutlineColor={design.colors.primary}
          onChangeText={(text) => { onChangeAmount(text) }}
          //  label="Topup amount"
            />
          <Text style={{ opacity: 0.5, color: state.warningColor, fontSize:15 }}>Min: {min_recharge_amount} and Max: {max_recharge_amount}</Text>
          </View>
          
          
          
          <Title style={{ fontSize: 15, opacity: 0.7, color: '#000', margin:15 }}>Mobile Money Number </Title>
          
          
          
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', margin: 15 }} >
          
          
          <TouchableOpacity>
          <Icon name="phone" style={design.helpIcon} />
          </TouchableOpacity>
          
          
          <TouchableOpacity>    
          {
            !state.editMode ? <Text style={{ fontSize: 18 }}>{state.phone_number}</Text>
            : <TextInput mode={'outlined'}
            placeholder="Your phone number"
            value={state.phone_number} 
            keyboardType='numeric'
            style={styles.inputBox}
            onChangeText={(text) => { onChangePhoneNumber(text) }}  />
          }
          </TouchableOpacity>  
          
          
          
          
          {
            !state.editMode ?  <TouchableOpacity onPress={editPhone}>
            <Text style={{ color: '#5bc0de' }}><Icon name="pencil" size={30} /></Text>
            </TouchableOpacity>
            :  <TouchableOpacity onPress={savePhoneNumber}>
            <Text style={{ color: 'green' }}><Icon name="check-circle" size={30} /></Text>
            </TouchableOpacity>
          } 
          
          </View>
          
          
          
          </ScrollView >
          
          <View style={styles.bottom}>
          <TouchableOpacity
          style={design.btnSecondary}
          onPress={RechargeUserAccount}
          disabled={false}>
          <Text style={styles.paymentButtonText}> 
          {isLoading ? <UIActivityIndicator color='#000' size={22} /> : 'CONFIRM TOP UP' }
          </Text>
          </TouchableOpacity>
          
          </View>
          
          
          
          
          </KeyboardAvoidingView>
          
          );
        }
        
        export default TopUpScreen
        
        
        const styles = StyleSheet.create({
          container:{
            flex:1,
            margin: 15, 
            borderWidth:0.8,
            borderRadius:10,
            borderColor:'#C0C0C0',
            backgroundColor:'#fff',
          },
          contentContainer:{
            flex:1,
          },
          TopupBtn: {
            alignSelf:'center' , 
          },
          
          paymentButton: {
            color: '#fff',
            borderRadius:5,
            backgroundColor: design.colors.primary,
            borderColor: design.colors.primary,
            position: 'absolute',
            bottom: 0,
            width: '90%',
          },
          
          bottom:{
            marginBottom: 30,
            flexDirection: 'row',
            alignItems: 'center',
            alignSelf: 'center',
            justifyContent: 'center',
            
          },
          paymentButtonText: {
            color: '#000',
            textTransform: 'uppercase',
          },
          
          
          textInput: {
            // fontSize: 16,
            borderBottomWidth: 1,
            backgroundColor: design.colors.white,
            fontWeight: 'normal',
            borderRadius:30,
            borderWidth:1,
          },
          inputBox: {
            borderBottomWidth: 1,
            borderBottomColor: 'gray',
         }
        })