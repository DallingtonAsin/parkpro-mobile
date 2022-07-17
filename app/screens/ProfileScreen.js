import React, {useState, useContext} from 'react';
import { Text,TouchableOpacity, View, StyleSheet} from 'react-native';
import design from '../../assets/css/styles';
import { Avatar, Paragraph, Divider } from 'react-native-paper';
import ProfileContext from '../context/index';
import ProfilePicture from 'react-native-profile-picture';
import {APP_NAME} from '@env';
import FocusAwareStatusBar  from '../components/common/FocusAwareStatusBar';
import { useTheme } from '@react-navigation/native';


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

const Profile = (props) => {
  
  const [state, setData] = useState(initialState);
  const { profile } = useContext(ProfileContext);
  const name = profile.first_name + " " + profile.last_name;
  const [image, setImage] = useState('https://dallingtonasingwire.com/img/user-profile9.png');
  const { colors } = useTheme();
  const styles = makeStyles(colors);
  
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
    <View style={styles.container}>
    
    <FocusAwareStatusBar barStyle="light-content" 
    backgroundColor={colors.primary}/>
    
    <View style={styles.header}>
    
    { profile.image ?
      <ProfilePicture
      isPicture={true}
      URLPicture={profile.image}
      shape='circle'
      pictureStyle={styles.avatar} 
      />
      : <Avatar.Image 
      size={120}
       style={styles.avatar} 
      source={require('../../assets/user-profile9.png')} />
    }

      <Text style={styles.name}>{name}</Text>
      <Text style={styles.name}>{`${profile.country_code}${profile.phone_number}`}</Text>
  
    </View>
  
  
    <View style={styles.body}>
    
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
    <Text style={styles.text}>EMAIL</Text>
    <Text style={styles.userinfo}>{profile.email}</Text>
    </View>
    <Divider style={design.divider1} />
    
    </View>
    
    <View style={styles.footer}>
    <TouchableOpacity 
    style={[design.btnPrimary, { color: '#fff',
    backgroundColor: colors.primary,
    borderColor: colors.primary}]}
    onPress={() => props.navigation.navigate("EditProfile")}>
    <Text style={design.buttonText}>Edit Profile</Text>
    </TouchableOpacity>
    </View>
    
    </View>
    );
    
    
  }
  
  
  export default Profile
  
  const makeStyles = (colors) => StyleSheet.create({
    container: {
      flex:1,
      backgroundColor: colors.body
    },
    
    header:{
      flex: 2,
      flexDirection: 'column',
      alignItems: 'center',
      marginTop:15
    },
    
    body:{
      flex: 3,
      padding:35,
    },
    
    footer:{
      flex:1,
      // marginBottom: 30,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
    },
    
    
    text:{
      color: colors.dark, 
      opacity:0.7,
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
      backgroundColor: colors.primary,
      borderColor: colors.primary,
      position: 'absolute',
      bottom: 0,
      width: '90%',
      justifyContent: 'center',
      alignItems: 'center',
    },
    
    
  })
  
  
  
  
