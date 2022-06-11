  import React, {useState, useContext} from 'react';
  import {Text, Image, RefreshControl, View, FlatList, StyleSheet} from 'react-native';
  import { AuthContext } from '../context/context';
  import Toast from 'react-native-simple-toast';
  import FocusAwareStatusBar  from '../components/common/FocusAwareStatusBar';
  import ProfileContext from '../context/index';
  import { useTheme } from '@react-navigation/native';
  import AppLoader from '../components/loaders/AppLoader';
  
  const wait = (timeout) => {
    return new Promise(resolve => setTimeout(resolve, timeout));
  }
  
  const  Notification = () => {
    
    const [notifications, setNotifications] = useState([]);
    const [isLoading, setIsLoading] = React.useState(true);
    const { profile } = useContext(ProfileContext);
    
    const { colors } = useTheme();
    const styles = makeStyles(colors);
    
    const { getCustomerNotifications } = React.useContext(AuthContext);
    
    React.useEffect(() => {
      fetchNotifications();
    }, []);
    
    const onRefresh = React.useCallback(() => {
      setIsLoading(true);
      wait(2000).then(() =>{
        fetchNotifications();
        setIsLoading(false);
      });
    });
    
    const fetchNotifications = async() => {
      try{
        
        const id = profile.id;
        let resp = await getCustomerNotifications(id);
        
        setIsLoading(false);
        
        if(resp.statusCode == 1){
          const notificationsData = resp.data;
          if(notificationsData.length > 0){
            setNotifications(notificationsData);
          }
        }else{
          Toast.show(resp.message);
        }
        
      }catch(err){
        Toast.show(err.message);
      }
    }
    
    
    const renderComponent = (item) => {
      let description = item.data.split('"').join('');
      return ( 
        <View style={styles.container}>
        <View style={{justifyContent: 'center'}}>
        <Image source={require('../../assets/icons/money.jpg')}  style={{ width:50, height:50, borderRadius:30} }  />
        </View>
        
        <View style={{ margin:5 }}>
        <Text style={{ fontWeight:'bold',opacity:0.8 }}>{item.date}</Text>
        <Text style={styles.description}>{description}.</Text>
        </View>
        
        </View>
        
        );
      }
      
      const NoNotifications = () =>{
        return (
          <View style={styles.noContentContainer}>
          <Text style={styles.text}>No Notifications found</Text>
          </View>
          );
        }
        const FlatListItemSeparator = () => {
          return (
            <View style={styles.divider}/>
            );
          }
          
          return ( 
            <>
              <View style= {{ backgroundColor: colors.body, height:'100%' }}>
               <FocusAwareStatusBar barStyle="light-content" backgroundColor={colors.primary} />
            {  !isLoading ?
              <FlatList 
              data={notifications}
              renderItem={({ item }) => renderComponent(item)}
              keyExtractor={(item, index) => String(index)}
              ListEmptyComponent={<NoNotifications/>} 
              ItemSeparatorComponent={FlatListItemSeparator}
              refreshControl={<RefreshControl refreshing={isLoading} onRefresh={onRefresh}/>}
              /> 
              : null
            }
              </View>
            
            {  isLoading ?  <AppLoader /> : null }
            
            </>
            );
          }
          
          
          export default Notification;
          
          const makeStyles = (colors) => StyleSheet.create({
            
            container:{
              flex:1,
              padding:8,
              flexDirection:'row',
              backgroundColor: colors.body
              
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