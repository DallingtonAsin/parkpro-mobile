import React, { useState } from 'react';
import { View, Text, Alert, TouchableOpacity, TextInput, Platform, StyleSheet, ScrollView} from 'react-native';
import * as Animatable from 'react-native-animatable';
import LinearGradient from 'react-native-linear-gradient';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Feather from 'react-native-vector-icons/Feather';
import { AuthContext } from '../context/context';
import FocusAwareStatusBar  from '../components/common/FocusAwareStatusBar';
import { useTheme  } from 'react-native-paper';
import AppLoader from '../components/loaders/AppLoader';
import { isValidateEmail } from '../components/SharedCommons';


const initialState = {
    first_name: '',
    last_name: '',
    email: '',
    isValidFName: false,
    isValidLName: false,
}


const SignupScreen = ({route, navigation}) => {
    
    const { userId, countryCode, phoneNumber } = route.params;
    const [state, setData] = useState(initialState);
    const { createProfile, goToHomeScreen } = React.useContext(AuthContext);
    const [isLoading, setIsLoading] = useState(false);
    const { colors } = useTheme();
    const styles = makeStyles(colors);
    
    
    const handleFirstNameInputChange = (val) => {
        if( val.length >= 3 ) {
            setData({
                ...state,
                first_name: val,
                isValidFName: true
            });
        } else {
            setData({
                ...state,
                first_name: val,
                isValidFName: false
            });
        }
    }
    
    const handleLastNameInputChange = (val) => {
        if( val.length >= 3 ) {
            setData({
                ...state,
                last_name: val,
                isValidLName: true
            });
        } else {
            setData({
                ...state,
                last_name: val,
                isValidLName: false
            });
        }
    }
    

    const handleEmailInputChange = (val) => {
        if( val.length >= 3 ) {
            setData({
                ...state,
                email: val,
                isValidEmail: true
            });
        } else {
            setData({
                ...state,
                email: val,
                isValidEmail: false
            });
        }
    }
    
    const handleCustomerRegistration = async() =>{
        const first_name = state.first_name;
        const last_name = state.last_name;
        const email = state.email;
        const isValidFName = state.isValidFName;
        const isValidLName = state.isValidLName;
        
        if(!first_name || !isValidFName){
            alert("Enter a valid first name");
            return;
        }
        
        if(!last_name || !isValidLName){
            alert("Enter a valid last name");
            return;
        }
        
        if(email){
            if(!isValidateEmail(email)){
                alert("Enter a valid email");
                return;
            }
        }
        
        if(!userId){
            alert("Unable to get your identity");
            return;
        }
        
        if(!phoneNumber){
            alert("Unable to get your phone number");
            return;
        }
        
        if(first_name && last_name) {
            
            const reqParams = {
                id: userId,
                first_name: first_name,
                last_name: last_name,
                country_code: countryCode,
                phone_number: phoneNumber,
                email: email,
            }
            
            setIsLoading(true);
            let response = await createProfile(reqParams);
            let message = response.message
            let statusCode = response.statusCode;
            if(statusCode == 1){
                let user = response.data;
                
                setIsLoading(false);
                await goToHomeScreen(user);
            }else{
                setIsLoading(false);
                Alert.alert("Message", "Registration failed: "+message+"");
            }
            
        }
    }
    
    return (

        <>
        <View style={styles.container}>
        <FocusAwareStatusBar barStyle="light-content" backgroundColor={colors.primary} />
        <View style={styles.header}>
        <Text style={styles.text_header}>Register Now!</Text>
        </View>
        <Animatable.View 
        animation="fadeInUpBig"
        style={styles.footer}
        >
        <ScrollView>
        
        <Text style={styles.text_footer}>Phone Number  <Text style={{color: 'red'}}>*</Text></Text>
        <View style={styles.action}>
        <FontAwesome 
        name="phone"
        color={styles.icon}
        size={20}
        />
        <TextInput 
        style={styles.textInput}
        autoCapitalize="none"
        value={`${countryCode}${phoneNumber}`}
        editable={false}
        selectTextOnFocus={false}
        />
        
        {state.check_firstNameChange ? 
            <Animatable.View
            animation="bounceIn"
            >
            <Feather 
            name="check-circle"
            color="green"
            size={20}
            />
            </Animatable.View>
            : null}
            </View>
            
            <Text style={styles.text_footer}>First Name  <Text style={{color: 'red'}}>*</Text></Text>
            <View style={styles.action}>
            <FontAwesome 
            name="user"
            color={styles.icon}
            size={20}
            />
            <TextInput 
            placeholder="Enter your First Name"
            style={styles.textInput}
            autoCapitalize="none"
            value={state.first_name}
            onChangeText={(val) => handleFirstNameInputChange(val)}
            />
            
            {state.check_firstNameChange ? 
                <Animatable.View
                animation="bounceIn"
                >
                <Feather 
                name="check-circle"
                color="green"
                size={20}
                />
                </Animatable.View>
                : null}
                </View>
                
                <Text style={[styles.text_footer, {marginTop: 15}]}>Last Name  <Text style={{color: 'red'}}>*</Text></Text>
                <View style={styles.action}>
                <FontAwesome 
                name="user"
                color={styles.icon}
                size={20}
                />
                <TextInput 
                placeholder="Enter you Last Name"
                style={styles.textInput}
                autoCapitalize="none"
                value={state.last_name}
                onChangeText={(val) => handleLastNameInputChange(val)}
                />
                
                {state.check_lastNameInputChange ? 
                    <Animatable.View
                    animation="bounceIn"
                    >
                    <Feather 
                    name="check-circle"
                    color="green"
                    size={20}
                    />
                    </Animatable.View>
                    : null}
                    </View>
                    
                    
                    
                    <Text style={[styles.text_footer, {marginTop: 15}]}>Email </Text>
                    <View style={styles.action}>
                    <FontAwesome5 
                    name="envelope"
                    color={styles.icon}
                    size={20}
                    />
                    <TextInput 
                    placeholder="Enter your Email"
                    style={styles.textInput}
                    autoCapitalize="none"
                    value={state.email}
                    onChangeText={(val) => handleEmailInputChange(val)}
                    />
                    
                    {state.check_lastNameInputChange ? 
                        <Animatable.View
                        animation="bounceIn"
                        >
                        <Feather 
                        name="check-circle"
                        color="green"
                        size={20}
                        />
                        </Animatable.View>
                        : null}
                        </View>
                        
                        <View>
                        { state.isValidForm === false ? 
                            <Animatable.View animation="fadeInLeft" duration={500}>
                            { state.formMessage ?   <Text style={styles.errorMsg}>{state.formMessage}</Text>  : null }
                            </Animatable.View>
                            : null
                        }
                        {state.registrationResponse != null ?
                            <Text style={{color:'green'}}>{state.registrationResponse}</Text>
                            : null
                        }
                        </View>
                        <View style={styles.textPrivate}>
                        <Text style={styles.color_textPrivate}>
                        By signing up you agree to our
                        </Text>
                        <Text style={[styles.color_textPrivate, {fontWeight: 'bold'}]}>{" "}Terms of service</Text>
                        <Text style={styles.color_textPrivate}>{" "}and</Text>
                        <Text style={[styles.color_textPrivate, {fontWeight: 'bold'}]}>{" "}Privacy policy</Text>
                        </View>
                        
                        <View style={styles.button}>
                        <TouchableOpacity
                        style={styles.signIn}
                        onPress={handleCustomerRegistration}
                        >
                        <LinearGradient
                        colors={[colors.btnLinearGradient1, colors.btnLinearGradient2]}
                        style={styles.signIn}
                        >
                        <Text style={[styles.textSign, {
                            color:'#fff',
                        }]}>
                        {isLoading ? 'Registering...' : 'Submit' } 
                        </Text>
                        </LinearGradient>
                        </TouchableOpacity>
                        
                        
                        </View>
                        </ScrollView>
                        </Animatable.View>
                        </View>

                        {  isLoading ?  <AppLoader /> : null }

                        </>
                        );
                        
                    };
                    
                    
                    
                    export default SignupScreen;
                    
                    
                    
                    const makeStyles = (colors) => StyleSheet.create({
                        container: {
                            flex: 1, 
                            backgroundColor: colors.primary
                        },
                        header: {
                            flex: 1,
                            justifyContent: 'flex-end',
                            paddingHorizontal: 20,
                            paddingBottom: 30
                        },
                        footer: {
                            flex: Platform.OS === 'ios' ? 3 : 5,
                            backgroundColor: colors.secondary,
                            borderTopLeftRadius: 30,
                            borderTopRightRadius: 30,
                            paddingHorizontal: 20,
                            paddingVertical: 30
                        },
                        text_header: {
                            color: '#fff',
                            fontWeight: 'bold',
                            fontSize: 30
                        },
                        text_footer: {
                            color: '#05375a',
                            fontSize: 16
                        },
                        action: {
                            flexDirection: 'row',
                            marginTop: 10,
                            borderBottomWidth: 1,
                            borderBottomColor: '#f2f2f2',
                            paddingBottom: 5
                        },
                        textInput: {
                            flex: 1,
                            marginTop: Platform.OS === 'ios' ? 0 : -12,
                            paddingLeft: 10,
                            color: '#05375a',
                            fontSize: 15,
                        },
                        button: {
                            alignItems: 'center',
                        },
                        signIn: {
                            width: '100%',
                            height: 50,
                            justifyContent: 'center',
                            alignItems: 'center',
                            borderRadius: 8,
                            margin:5,
                        },
                        textSign: {
                            fontSize: 16,
                            fontWeight: 'bold'
                        },
                        textPrivate: {
                            flexDirection: 'row',
                            flexWrap: 'wrap',
                            marginTop: 20
                        },
                        color_textPrivate: {
                            color: 'grey'
                        },
                        errorMsg: {
                            color: '#FF0000',
                            fontSize: 16,
                        },
                        icon: {
                            color: '#05375a'
                        }
                    });