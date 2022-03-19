import React, {useState, useContext} from 'react';
import { Text,TouchableOpacity,ScrollView,SafeAreaView, View, StyleSheet} from 'react-native';
import design from '../../assets/css/styles';
import { Avatar, Paragraph, Divider } from 'react-native-paper';
import ProfileContext from '../context/index';
import ProfilePicture from 'react-native-profile-picture';
import {APP_NAME} from '@env';

const initialState = {
  id: '',
  name: '',
  first_name: '',
  last_name: '',
  username: '',
  phone_number: '',
  email: '',
  role: APP_NAME + " User",
};

const Profile = props => {

  const [state, setData] = useState(initialState);
  const {profile, setProfile} = useContext(ProfileContext);
  const name = profile.first_name + " " + profile.last_name;
  const [image, setImage] = useState('https://dallingtonasingwire.com/img/user-profile9.png');

  
  React.useEffect(() => {
    const unsubscribe = props.navigation.addListener('focus', () => {
      getProfile();
    });
    return unsubscribe;
  }, [props.navigation]);

  const getProfile = () => {
    const id = profile.id;
    const first_name = profile.first_name;
    const last_name = profile.last_name;
    const user_name = (first_name && last_name) ? first_name + " " + last_name : '';
    const phone_number = profile.phone_number;
    const email = profile.email;
    const account_balance = profile.account_balance;

    setData({
      ...state,
      id: id,
      name: user_name,
      first_name: first_name,
      last_name: last_name,
      phone_number: phone_number,
      email: email,
      balance: account_balance
    });
}

  return(
      <SafeAreaView style={{flex: 1}}>

  
   <View style={styles.header}>

   { profile.image ?
          <ProfilePicture
          isPicture={true}
          URLPicture={profile.image}
          shape='circle'
          pictureStyle={styles.avatar} 
      />
        : <Avatar.Image size={120} style={styles.avatar} 
        source={require('../../assets/user-profile9.png')} />
   }

    </View>
               
               

    <View style={styles.body}>


    <View style={{justifyContent: 'center', alignSelf: 'center'}}>
    <Text style={styles.name}>{name}</Text>
    <Paragraph style={styles.info}>{profile.phone_number}</Paragraph>
    </View>
   
    <Divider style={ design.divider1 }/>

    <View style={styles.formData}>
    <Text style={styles.text}>FIRST NAME</Text>
    <Text style={styles.userinfo}>{profile.first_name}</Text>
    </View>
    
    <Divider style={ design.divider1 }/>
    
    <View style={styles.formData}>
    <Text style={styles.text}>LAST NAME</Text>
    <Text style={styles.userinfo}>{profile.last_name}</Text>
    </View>
    
    <Divider style={ design.divider1 }/>

    <View style={styles.formData}>
    <Text style={styles.text}>PHONE NUMBER</Text>
    <Text style={styles.userinfo}>{profile.phone_number}</Text>
    </View>


    <Divider style={ design.divider1 }/>
    
    <View style={styles.formData}>
    <Text style={styles.text}>EMAIL</Text>
    <Text style={styles.userinfo}>{profile.email}</Text>
        </View>
        <Divider style={design.divider1} />

    </View>

    <View style={styles.footer}>
    <TouchableOpacity style={design.btnPrimary}
    onPress={() => props.navigation.navigate("EditProfile")}>
    <Text style={{color:'#fff', textAlign: 'center', fontSize:15}}>Edit Profile</Text>
    </TouchableOpacity>
    </View>
    </SafeAreaView>
    );
    
    
  }
  
  
  export default Profile
  
  const styles = StyleSheet.create({
    container: {
      flex:1,
    },
    scrollView: {
      borderWidth: 0.3, 
      borderRadius: 3,
      borderColor: '#000',
      paddingHorizontal:10
    },
    header:{
      backgroundColor: design.colors.white,
      height:130,
      flex: 1,
    },
    body:{
      flex: 3,
      padding:35,
    },
    text:{
      color: design.colors.primary, 
      opacity:0.8,
      textTransform:'capitalize',
      fontWeight:'bold',
      fontSize:16,
    },
    userinfo: {
      opacity:0.7,
      fontSize:17,
    },
    avatar: {
      width: 120,
      height: 120,
      borderRadius: 70,
      borderWidth: 1,
      borderColor: "#e2e2e2",
      backgroundColor:'white',
      marginTop:40,
      position: 'absolute',
      alignSelf:'center',
    },

    avatar1: {
      borderRadius: 70,
      alignSelf:'center',
      position: 'absolute',
      marginTop:30, 
      alignSelf:'center',
    },

    name:{
      fontSize:20,
      color: "#696969",
      fontWeight: "600"
    },
    info:{
      fontSize:16,
      color: "#00BFFF",
      textAlign:'center'
    },
   
    buttonContainer: {
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

    footer:{
      marginBottom: 30,
      flexDirection: 'row',
      alignItems: 'center',
      alignSelf: 'center',
      justifyContent: 'center',
    },
  })
  
  
  
  
