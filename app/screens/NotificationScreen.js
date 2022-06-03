import React, {useState, useEffect, useContext} from 'react';
import {Text, SafeAreaView, Image, ScrollView,RefreshControl,
        TouchableOpacity,View, FlatList, StyleSheet} from 'react-native';
import design from '../../assets/css/styles';
import { AuthContext } from '../context/context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from '../../assets/css/styles';
import CustomLoader from '../components/CustomActivityIndicator';
import Toast from 'react-native-simple-toast';
import FocusAwareStatusBar  from '../components/common/FocusAwareStatusBar';
import ProfileContext from '../context/index';
import { useTheme } from '@react-navigation/native';


const wait = (timeout) => {
  return new Promise(resolve => setTimeout(resolve, timeout));
}

const  Notification = () => {

 const [notifications, setNotifications] = useState([]);
 const [refreshing, setRefreshing] = React.useState(false);
 const [isLoading, setIsLoading] = React.useState(true);
 const {profile, setProfile} = useContext(ProfileContext);
 const { colors } = useTheme();

 const { getCustomerNotifications } = React.useContext(AuthContext);

 React.useEffect(() => {
  fetchNotifications();
}, []);

const onRefresh = React.useCallback(() => {
  setRefreshing(true);
  wait(2000).then(() =>{
     fetchNotifications();
     setRefreshing(false);
 });
});

const fetchNotifications = async() => {
  try{
    
    const id = profile.id;
    console.log("User id", id);
    let resp = await getCustomerNotifications(id);
    console.log("API response", resp);
    setIsLoading(false);
    if(resp.statusCode == 1){
      const notificationsData = resp.data;
      if(notificationsData.length > 0){
         setNotifications(notificationsData);
      }
    }else{
      Toast.show(resp.message);
    }
  
  }catch(e){
    Toast.show(e.message);
  }
}

 
  const renderComponent = (item) => {
    let description = item.data.split('"').join('');
   return ( 
     <View style={innerStyles.container}>
     <View style={{justifyContent: 'center'}}>
     <Image source={require('../../assets/icons/money.jpg')}  style={{ width:50, height:50, borderRadius:30} }  />
     </View>
  
     <View style={{ margin:5 }}>
     <Text style={{ fontWeight:'bold',opacity:0.8 }}>{item.date}</Text>
     <Text style={innerStyles.description}>{description}.</Text>
     </View>

     </View>
  
   );
  }

  const NoNotifications = () =>{
    return (
    <View style={innerStyles.noContentContainer}>
      <Text style={innerStyles.text}>No Notifications found</Text>
    </View>
    );
  }
  const FlatListItemSeparator = () => {
    return (
      <View style={innerStyles.divider}/>
    );
  }

  return ( 
  <>
   <FocusAwareStatusBar barStyle="light-content" backgroundColor={colors.primary} />
  {  !isLoading ?
 <FlatList style= {{ backgroundColor: colors.body, height:'100%' }}
 data={notifications}
 renderItem={({ item }) => renderComponent(item)}
 keyExtractor={(item, index) => String(index)}
 ListEmptyComponent={<NoNotifications/>} 
 ItemSeparatorComponent={FlatListItemSeparator}
 refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh}/>}
/> 
: <CustomLoader color={colors.white}/>
  }
</>
  );
  }


export default Notification 
const innerStyles = StyleSheet.create({
  container:{
    flex:1,
    padding:8,
    flexDirection:'row',

  },
  noContentContainer:{
    flex:1,
    alignItems: 'center',
    justifyContent: 'center',
    padding:10,

  },
  text:{
    fontSize: 18,
    fontWeight: 'bold',
  },
  description: {
    right:15,
    left:0,

  },
  divider:{
    width:'100%',
    height:1,
    marginTop:5,
    backgroundColor:'#e2e2e2',
  },
});