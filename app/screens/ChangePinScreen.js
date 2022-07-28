import React, {useState, useContext} from 'react';
import { Text, TouchableOpacity, View, StyleSheet} from 'react-native';
import { AuthContext } from '../context/context';
import design from '../../assets/css/styles';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import ProfileContext from '../context/index';
import FocusAwareStatusBar  from '../components/common/FocusAwareStatusBar';
import { useTheme } from '@react-navigation/native';
import Toast from 'react-native-simple-toast';8
import OTPInputView from "@twotalltotems/react-native-otp-input";
import AppLoader from '../components/loaders/AppLoader';

const initialState = {
  current_pin: '',
  new_pin: '',
  confirm_pin: '',
}

const Password = () => {
  
  const [state, setState] = useState(initialState);
  const [isLoading, setIsLoading] = useState(false);
  
  const [secureCurrentPin, setSecureCurrentPin] = useState(true);
  const [secureNewPin, setSecureNewPin] = useState(true);
  const [secureConfirmPin, setSecureConfirmPin] = useState(true);
  
  
  const { changePin } = React.useContext(AuthContext);
  const { profile } = useContext(ProfileContext);
  
  
  const { colors } = useTheme();
  const styles = makeStyles(colors);
  
  const submitPin = async() => {
    
    try{
      if(!state.current_pin){
        Toast.show("Please enter your current pin", Toast.LONG);
        return;
      }
      if(!state.new_pin){
        Toast.show("Please enter your new pin", Toast.LONG);
        return;
      }
      if(!state.confirm_pin){
        Toast.show("Please confirm your new pin", Toast.LONG);
        return;
      }
      
      if(state.new_pin != state.confirm_pin){
        Toast.show("The new PINs have to be the same", Toast.LONG);
        return;
      }
      
      console.log(`Current pin:  ${state.current_pin}, New pin: ${state.new_pin} and Confirm pin ${state.confirm_pin}`);
      
      const reqParams = {
        id: profile.id,
        currentPin: state.current_pin,
        newPin: state.new_pin,
        confirmPin: state.confirm_pin
      }
      console.log("Req params", reqParams);
      setIsLoading(true);
      const response = await changePin(reqParams);
      if(response.statusCode == 200){
        setState(initialState);
        Toast.show(response.message, Toast.LONG);
      }else{
        Toast.show(response.message, Toast.LONG);
      }
      
      setIsLoading(false);
      
    }catch(err){
      Toast.show(err.message, Toast.LONG);
    }
    setIsLoading(false);
    
  }
  
  
  return(
    <>
    <View style={styles.container}>
    
    <FocusAwareStatusBar barStyle="light-content" backgroundColor={colors.primary} />
    <View style={{flex:1, padding:35}}>
    
    <Text style={styles.title}>Enter your current pin</Text>
    <View style={styles.pinView}>
    <OTPInputView
    style={styles.otpView}
    pinCount={4}
    autoFocusOnLoad
    secureTextEntry={secureCurrentPin}
    keyboardAppearance={"light"}
    keyboardType={"number-pad"}
    placeholderCharacter={"-"}
    code={state.current_pin}
    codeInputFieldStyle={styles.underlineStyleBase}
    codeInputHighlightStyle={styles.underlineStyleHighLighted}
    onCodeChanged = {code => { setState({
      ...state,
      current_pin: code
    })}}
    onCodeFilled= {(code => {
      console.log("Your current pin", code)
    })}
    />
    <TouchableOpacity onPress={() => {setSecureCurrentPin(!secureCurrentPin)}}>
    <FontAwesome name={secureCurrentPin ? "eye" : "eye-slash"} size={25} color={design.colors.orange} style={styles.pinIcon}/>
    </TouchableOpacity>
    </View>
    
    <Text style={styles.title}>Enter your new pin</Text>
    <View style={styles.pinView}>
    <OTPInputView
    style={styles.otpView}
    pinCount={4}
    autoFocusOnLoad
    secureTextEntry={secureNewPin}
    keyboardAppearance={"light"}
    keyboardType={"number-pad"}
    placeholderCharacter={"-"}
    code={state.new_pin}
    codeInputFieldStyle={styles.underlineStyleBase}
    codeInputHighlightStyle={styles.underlineStyleHighLighted}
    onCodeChanged = {code => { setState({
      ...state,
      new_pin: code
    })}}
    onCodeFilled= {(code => {
      console.log("Your new pin", code)
    })}
    />
    <TouchableOpacity onPress={() => {setSecureNewPin(!secureNewPin)}}>
    <FontAwesome name={secureNewPin ? "eye" : "eye-slash"} size={25} color={design.colors.orange} style={styles.pinIcon}/>
    </TouchableOpacity>
    </View>
    
    
    <Text style={styles.title}>Confirm your new pin</Text>
    <View style={styles.pinView}>
    <OTPInputView
    style={styles.otpView}
    pinCount={4}
    autoFocusOnLoad
    secureTextEntry={secureConfirmPin}
    keyboardAppearance={"light"}
    keyboardType={"number-pad"}
    placeholderCharacter={"-"}
    code={state.confirm_pin}
    codeInputFieldStyle={styles.underlineStyleBase}
    codeInputHighlightStyle={styles.underlineStyleHighLighted}
    onCodeChanged = {code => { setState({
      ...state,
      confirm_pin: code
    })}}
    onCodeFilled= {(code => {
      console.log("Your confirm pin", code)
    })}
    />
    <TouchableOpacity onPress={() => {setSecureConfirmPin(!secureConfirmPin)}}>
    <FontAwesome name={secureConfirmPin ? "eye" : "eye-slash"} size={25} color={design.colors.orange} style={styles.pinIcon}/>
    </TouchableOpacity>
    </View>
    
    <TouchableOpacity 
    style={[design.btnPrimary, { color: '#fff',
    backgroundColor: colors.primary,
    borderColor: colors.primary,
    alignSelf: 'center'
  }]}
  onPress={() => { submitPin() }}
  >
  {isLoading 
    ? <Text style={{color: colors.text, fontSize:15, fontWeight: 'bold'}}>Submiting...</Text>
    : <Text style={styles.changePin}>Change Pin</Text>
  }
  </TouchableOpacity>
  
  
  </View>
  </View>
  {  isLoading ?  <AppLoader /> : null }
  </>
  );
  
}



export default Password

const makeStyles = (colors) =>  StyleSheet.create({
  
  container: {
    flex: 1,
    backgroundColor: design.colors.white,
  },
  
  pinView: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  
  title: {
    fontSize: 16,
    textTransform: 'uppercase'
  },
  
  underlineStyleBase: {
    width: 55,
    height: 55,
    borderWidth: 1,
    color: design.colors.dark,
    fontSize: 20
  },
  
  underlineStyleHighLighted: {
    borderColor: "#03DAC6"
  },
  
  otpView: {
    width: "80%",
    height: 120 
  },
  
  footer:{
    marginBottom: 30,
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'center',
  },
  
  changePin: {
    color:'#fff',
    fontSize:15,
    fontWeight: 'bold',
    textTransform:'uppercase'
  },
  
  pinIcon: {
    paddingVertical: 46,
  }
  
});