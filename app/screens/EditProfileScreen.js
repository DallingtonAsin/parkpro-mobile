import React, {useState, useEffect, useContext} from 'react';
import { Text,TextInput, TouchableOpacity, View, StyleSheet, SafeAreaView, Alert, Platform} from 'react-native';
import design from '../../assets/css/styles';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { Avatar } from 'react-native-paper';
import { AuthContext } from '../context/context';
import { UIActivityIndicator } from 'react-native-indicators';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import ProfileContext from '../context/index';
import ImagePicker from 'react-native-image-crop-picker';
import Toast from 'react-native-simple-toast';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BottomSheet } from 'react-native-btr';
import {APP_NAME} from '@env';;
import FocusAwareStatusBar  from '../components/common/FocusAwareStatusBar';
import { useTheme } from '@react-navigation/native';
import AppLoader from '../components/loaders/AppLoader';
import { isValidateEmail } from '../components/sharedHelper/AppUtils';

var mime = require('mime-types');


const initialState = {
  user_id: '',
  first_name: '',
  last_name: '',
  name: '',
  username: '',
  country_code: '',
  phone_number: '',
  email: '',
  role: APP_NAME + " Customer",
  image: '', 
  balance:0,
  
}


const EditProfile = () => {
  
  const [state, setData] = useState(initialState);
  const [isLoading, setIsLoading] = useState(false);
  const [isUpdatingImage, setIsUpdatingImage] = useState(false);
  const [visible, setVisible] = useState(false);
  const {profile, setProfile} = useContext(ProfileContext);
  
  const { updateProfile, UpdateProfileImage, syncProfileData, deleteProfilePicture } = React.useContext(AuthContext);
  
  const { colors } = useTheme();
  const styles = makeStyles(colors);
  
  const [image, setImage] = useState('https://dallingtonasingwire.com/img/user-profile9.png');
  
  const toggleBottomNavigationView = () => {
    setVisible(!visible);
  };
  
  const takePhotoFromCamera = async() => {
    ImagePicker.openCamera({
      width: 300,
      height: 400,
      cropping: true,
      compressImageQuality: 0.7,
    }).then(async image => {
      console.log("Camera image object",image);
      await SubmitProfileUpdateDetails(image);
    });
  }
  
  const choosePhotoFromLibrary = async() => {
    ImagePicker.openPicker({
      width: 300,
      height: 400,
      cropping: true,
    }).then( async(image) => {
      console.log("Gallery image object",image);
      await SubmitProfileUpdateDetails(image);
    });
  }
  
  
  const SubmitProfileUpdateDetails = async(image) => {
    

    try{

    const imagePath = image.path;
    const mimeType = image.mime;
    const fileExtension = mime.extension(mimeType);
    
    setImage(imagePath);
    const ImageData = {
      uri: imagePath,
      type: mimeType,
      size: image.size,
      extension: fileExtension,
      name: 'profile_pic',
    }
    
    let formData = new FormData();
    const user_id = state.user_id;
    const phone_number = state.phone_number;
    const country_code = state.country_code;
    
    if(user_id && phone_number){
      
      formData.append('id', user_id);
      formData.append('country_code', country_code);
      formData.append('phone_number', phone_number);
      formData.append('extension', fileExtension);
      formData.append('image', ImageData);
      
      setIsUpdatingImage(true);
      
      let result = await UpdateProfileImage(formData);
      const statusCode = result.statusCode;
      const message = result.message;
      
      if(statusCode == 200){
        
        const customer = result.data;
        console.log("Profile data after updating profile", customer);
        
        setProfile(customer);
        await syncProfileData(customer);
        await updateUserProfile(customer);
        Toast.show(message);
        
      }else{
        Toast.show(message, Toast.LONG);
      }
      
      setVisible(false);
      
    }else{
      Toast.show("Unable to get your profile details", Toast.LONG);
    }
  }catch(err){
    Toast.show(err.message, Toast.LONG);
  }
  setIsUpdatingImage(false);

  }
  
  
  const handleProfileUpdate = async() => {
    
    
    try{
      
      const user_id = state.user_id;
      const first_name = state.first_name;
      const last_name = state.last_name;
      const country_code = state.country_code;
      const phone_number = state.phone_number;
      const email = state.email;
      
      if(!first_name){
        alert("Enter a valid first name");
        return;
      }
      
      if(!last_name){
        alert("Enter a valid last name");
        return;
      }
      
      if(!phone_number){
        alert("Enter a valid last name");
        return;
      }
      
      if(!user_id){
        alert("Unable to get your identity");
        return;
      }
      
      if(email){
        if(!isValidateEmail(email)){
          alert("Enter a valid email");
          return;
        }
      }
      
      if(user_id && first_name && last_name && phone_number) {
        const reqParams = {
          id: user_id,
          first_name: first_name,
          last_name: last_name,
          country_code: country_code,
          phone_number: phone_number,
          email: email,
        }
        
        setIsLoading(true);
        let response = await updateProfile(reqParams);
        const message = response.message
        const statusCode = response.statusCode;
        
        if(statusCode == 0){
          Alert.alert("Message", message);
        }
        if(statusCode == 200){
          const customer = response.data;
          setProfile(customer);
          await syncProfileData(customer);
          await updateUserProfile(customer);
          Toast.show(message, Toast.LONG);
        }
       
      }else{
        Alert.alert("Profile Update Error", 'Unable to capture data to update profile');
      }
      
    }catch(err){
      Toast.show(err.message, Toast.LONG);
    }
    setIsLoading(false);
  }
  
  const updateUserProfile = async() => {

    try{

      const profile = JSON.parse(await AsyncStorage.getItem("userProfile"));

      if(profile){
        const user_id = profile.id;
        const first_name = profile.first_name;
        const last_name = profile.last_name;
        const name = (first_name && last_name) ? first_name + " " + last_name : '';
        const country_code = profile.country_code;
        const phone_number = profile.phone_number;
        const email = profile.email;
        const balance = profile.account_balance;
        const image = profile.image;
        setData({
          ...state,
          user_id: user_id,
          name: name,
          first_name: first_name,
          last_name: last_name,
          country_code: country_code,
          phone_number: phone_number,
          email: email,
          account_balance: balance,
          image: image,
        });
      }
    }catch(e){
      Toast.show("Error on async storage", Toast.LONG);
    }
  }
  
  
  const removeProfilePicture = async() => {

    try{

    if(profile.id && profile.phone_number){
      const data = {
        id: profile.id,
        country_code: profile.country_code,
        phone_number: profile.phone_number
      }
      setIsUpdatingImage(true);
      
      const response = await deleteProfilePicture(data);
      const statusCode = response.statusCode;
      const message = response.message;
      
      if(statusCode == 200){
        const customer = response.data;
        console.log("Data on removing profile image", customer);
        setProfile(customer);
        await syncProfileData(customer);
        await updateUserProfile(customer);
        Toast.show(message);
      }else{
        alert(message);
      }
    }else{
      alert("Unable to get your identity");
    }
  }catch(err){
    Toast.show(err.message, Toast.LONG);
  }
    setIsUpdatingImage(false);
  }
  
  const confirmRemovePicture = () => {
    
    Alert.alert(
      "Warning",
      "Are you sure you want to remove your profile picture?",
      [
        {
          text: "OK",
          onPress: () => removeProfilePicture(), 
          style: "cancel",
        },
      ],
      {
        cancelable: true,
      }
      );
      
      
    }
    
    useEffect(() => {
      let isMounted = true;
      if(isMounted) {
        updateUserProfile();
      }
      return () => { isMounted = false };
    }, []);
    
    
    return(
      <>
      
      <SafeAreaView style={styles.container}>
      
      <FocusAwareStatusBar barStyle="light-content" backgroundColor={colors.primary} />
      
      <BottomSheet
      visible={visible}
      onBackButtonPress={toggleBottomNavigationView}
      onBackdropPress={toggleBottomNavigationView}
      >
      <View style={styles.panel} elevation={5}>
      
      <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
      <View>
      <Text style={styles.panelTitle}>Profile Picture</Text>
      <Text style={styles.panelSubtitle}>Change profile photo</Text>
      </View>
      
      {
        profile.image ? 
        <TouchableOpacity style={{marginLeft: 55}} onPress={() =>  confirmRemovePicture()}>
        <FontAwesome name={"trash"} size={30} color={design.colors.red} />
        </TouchableOpacity>
        : null
      }
      
      </View>
      
      
      <View style={{
        flexDirection: 'row',
         alignItems: 'center',
          margin:30,
           justifyContent: 'space-evenly'}}>
      
      <View style={styles.uploadOptions}>
      <TouchableOpacity onPress={()=> setVisible(false) } style={[styles.icon, {borderColor:'red', backgroundColor: 'red'}]} >
      <FontAwesome name={"trash"} size={22} color={"#fff"} />
      </TouchableOpacity>
      <Text>Cancel</Text>
      </View>
      
      <View style={styles.uploadOptions}>
      <TouchableOpacity  style={[styles.icon, {borderColor:'purple', backgroundColor: 'purple'}]}>
      <FontAwesome name={"photo"} size={25}  color={"#fff"}  onPress={() => choosePhotoFromLibrary()}/>
      </TouchableOpacity>
      <Text>Gallery</Text>
      </View>
      
      <View style={styles.uploadOptions}>
      <TouchableOpacity onPress={() => takePhotoFromCamera()} style={[styles.icon, {borderColor:'green', backgroundColor: 'green'}]}> 
      <FontAwesome name={"camera"} size={25} color={"#fff"}/>
      </TouchableOpacity>
      <Text>Camera</Text>
      </View>
      
      </View>
      
      </View>
      </BottomSheet>
      
      
      <View style={styles.header}>
          {
            !isUpdatingImage ? 
            state.image ?
            <Avatar.Image size={120} style={styles.avatar} 
            source={{uri: state.image }} />
            : <Avatar.Image size={120} style={styles.avatar} 
            source={require('../../assets/user-profile9.png')} />
            : 
            <View style={styles.avatar1}>
            <UIActivityIndicator color='black' size={27}/>
            </View>
          } 
          <TouchableOpacity onPress={toggleBottomNavigationView} style={styles.camera}>
          <Icon name="camera" color={design.colors.white}  size={18}/>
          </TouchableOpacity>    
      </View>
      
      
      <View style={styles.body}>
      
      <View style={styles.form}>
      <Text style={styles.text}>FIRST NAME</Text>
      <TextInput value={state.first_name} 
      placeholder="First Name"
      style={styles.input} 
      spellCheck={false}
      autoCorrect={false}
      onChangeText={(val) => setData({...state, first_name: val})}
      />
      </View>
      
      <View style={styles.form}>
      <Text style={styles.text}>LAST NAME</Text>
      <TextInput value={state.last_name}
      placeholder="Last Name"
      style={styles.input} 
      spellCheck={false}
      autoCorrect={false}
      onChangeText={(val) => setData({...state, last_name: val})}
      />
      </View>
 
      <View style={styles.form}>
      <Text style={styles.text}>Email</Text>
      <TextInput 
      value={state.email}
      placeholder="Email address"
      style={styles.input}
      spellCheck={false}
      autoCorrect={false}
      onChangeText={(val) => setData({...state, email: val})}
      />
      </View>
      </View>
      
      <View style={styles.footer}>
      <TouchableOpacity 
      style={[design.btnPrimary, { color: '#fff',
      backgroundColor: colors.primary,
      borderColor: colors.primary}]}
      onPress={handleProfileUpdate}>
      <Text style={design.buttonText}>
      {isLoading ? 'Updating...' : 'Save Profile' } 
      </Text>
      </TouchableOpacity>
      </View>
      
      </SafeAreaView>
      
      
      {  isLoading ?  <AppLoader /> : null }
      
      </>
      );
      
      
    }
    
    
    export default EditProfile
    
    const makeStyles = (colors) => StyleSheet.create({
      container: {
        flex:1,
        backgroundColor: colors.body,
      },
      
      header:{
        flex: 2,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: design.colors.white,
        flexDirection: 'row',
      },
      
      body:{
        flex: 3,
        padding:15,
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

      avatar: {
        width: 120,
        height: 120,
        borderRadius: 70,
        borderWidth: 1,
        borderColor: "#e2e2e2",
        backgroundColor:'white',
        position: 'absolute',
      },
      
      avatar1: {
        width: 120,
        height: 120,
        borderRadius: 70,
        alignSelf:'center',
        position: 'absolute',
        marginTop:90, 
        backgroundColor: design.colors.white,
        borderWidth: 2,
        borderColor: "white",
      },
      
      imageStyle: {
        width: 200,
        height: 200,
        margin: 5,
      },
      
      name:{
        fontSize:20,
        color: "#696969",
        fontWeight: "600"
      },
      
      form: {
        padding: 12,
      },
      
      divider:{
        width:'90%',
        height:1,
        margin:15,
        backgroundColor:'#e2e2e2',
      },
      
      input:{
        borderBottomColor: 'lightblue',
        borderBottomWidth:1,
        fontSize:17,
        color: design.colors.dark
      },
      green:{
        color:'green'
      },
      
      red:{
        color:'red'
      },
      
      panel: {
        padding: 20,
        backgroundColor: '#FFFFFF',
        paddingTop: 20,
        height: 300,
      },
      
      panelTitle: {
        fontSize: 22,
        height: 35,
        textAlign: 'center',
      },

      panelSubtitle: {
        fontSize: 14,
        color: 'gray',
        height: 30,
        marginBottom: 10,
        textAlign: 'center',
        
      },
      
      
      bottomSheetHeader: {
        backgroundColor: '#FFFFFF',
        shadowColor: '#333333',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
      },
      
      panelHeader: {
        alignItems: 'center',
      },
      
      panelHandle: {
        width: 40,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#00000040',
        marginBottom: 10,
      },
      
      
      panelButton: {
        padding: 13,
        borderRadius: 150 / 2,
        backgroundColor: '#FF6347',
        alignItems: 'center',
        marginVertical: 7,
      },
      
      panelButtonTitle: {
        fontSize: 17,
        fontWeight: 'bold',
        color: 'white',
      },
      
      action: {
        flexDirection: 'row',
        marginTop: 20,
        marginBottom: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#f2f2f2',
        paddingBottom: 5,
      },
      
      actionError: {
        flexDirection: 'row',
        marginTop: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#FF0000',
        paddingBottom: 5,
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
      
      image: {
        flex: 1,
        justifyContent: "center"
      },
      
      camera: {
        marginLeft:120,
        backgroundColor: design.colors.success,
        padding:10, borderRadius:50,
        borderColor:'#f4f4f4'
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
      
      
    })
    
    
    
    
    