import React from 'react';
import { Text,StyleSheet,FlatList, View, TouchableOpacity} from 'react-native';
import design from '../../assets/css/styles';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {callHelpLine, SendEmail, SendSms, inboxFromWhatsapp} from '../components/sharedHelper/AppUtils';
import {COMPANY_LINE, COMPANY_WHATSAP_LINE, COMPANY_EMAIL} from '@env';
import FocusAwareStatusBar  from '../components/common/FocusAwareStatusBar';
import { useTheme } from '@react-navigation/native';


  const ContactUs = ({navigation}) => {
    
    const { colors } = useTheme();
    const styles = makeStyles(colors);
  
    const communicationChannels = [
      {id: 1, iconName: "phone-alt", name:'Phone', text: COMPANY_LINE, 'method': () => {callHelpLine(COMPANY_LINE)}},
      {id: 2, iconName: "whatsapp", name:'Whatsap', text: COMPANY_WHATSAP_LINE, 'method': () => {inboxFromWhatsapp(COMPANY_WHATSAP_LINE)}},
      // {id: 3, iconName: "sms", name:'SMS', text: 'Report a problem via sms', 'method': () => {SendSms(COMPANY_LINE)}},
      {id: 4, iconName: "envelope", name:'Email', text: COMPANY_EMAIL, 'method': () => {SendEmail(COMPANY_EMAIL)}},
      {id: 5, iconName: "comments", name:'Feedback', text: 'Suggest something to us', 'method': () => navigation.navigate('Feedback')},
      
    ];

    const CardComponent = ({info}) => (
      <TouchableOpacity  style={{ backgroundColor:'#ffffff', borderWidth:1, borderColor:'#e2e2e2',margin:5, borderRadius:6 }} onPress={info.method}>
      <View style = { design.helpContainer} >
        <Icon name={info.iconName} style={[design.helpIcon, {color: colors.icon, borderColor: colors.icon}]} size={20}/>
        <View style={{flexDirection: 'column', marginLeft:15}}>
          <Text style={styles.channel}>{info.name}</Text>
          <Text style={{fontSize:16}}>{info.text}</Text>
        </View>
      </View>
      </TouchableOpacity>
      );
      
    
    return(
      
      <View style={styles.container}>
      <FocusAwareStatusBar barStyle="light-content"
      backgroundColor={colors.primary}
      />
      <View style={styles.top}>
          <Icon name={'question-circle'} size={65} color={design.colors.white}/>
      </View>
      <View style={styles.body}>
          <Text style={{fontSize: 16, color: '#000', textAlign: 'center', paddingTop:5, paddingBottom:15,
            }}>Kindly contact us for any kind of assistance.</Text>
          <FlatList
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          data={communicationChannels}
          renderItem={({item}) => <CardComponent info={item} />}
          />
      </View>
      </View>
    
    );
    
    
  }
  
  export default ContactUs
  
  const makeStyles = (colors) => StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.primary,
      marginBottom:30
    },
    
    top:{
      flex:1,
      justifyContent: 'center', 
      alignItems: 'center',
      padding:20,
      
    },
    
    body:{
      flex:5,
      borderTopLeftRadius: 40,
      borderTopRightRadius: 40,
      padding:30,
      backgroundColor: design.colors.white,
      
    },

    card: {
      margin:15,
      color:'#fff'
      
    },
    
    mediaGroup:{
      padding:10,
      borderRadius:10,
      justifyContent: 'center',
      margin:10,
      
    },
    
    channel:{
      fontWeight: 'bold',
      fontSize: 16, 
    }
  });