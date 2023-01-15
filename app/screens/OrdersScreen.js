import React, {useState, useContext } from 'react';
import {Text, SafeAreaView,RefreshControl,
  TouchableOpacity,View, FlatList, StyleSheet} from 'react-native';
  import { AuthContext } from '../context/context';
  import styles from '../../assets/css/styles';
  import FontAwesome from 'react-native-vector-icons/FontAwesome';
  import Toast from 'react-native-simple-toast';
  import ProfileContext from '../context/index';
  import { currency} from '@env';
  import FocusAwareStatusBar  from '../components/common/FocusAwareStatusBar';
  import { useTheme } from '@react-navigation/native';
import AppLoader from '../components/loaders/AppLoader';
import Icon from 'react-native-vector-icons/FontAwesome5';
  

  const wait = (timeout) => {
    return new Promise(resolve => setTimeout(resolve, timeout));
  }
  
  const  OrdersScreen = ({ navigation }) => {
    
    const [parkingRequests, setParkingRequests] = useState([]);
    const [isLoading, setIsLoading] = React.useState(true);
    const { profile } = useContext(ProfileContext);
    const { colors } = useTheme();

    
    const { fetchMyParkingRequests } = React.useContext(AuthContext);
    
    React.useEffect(() => {
      fetchOrders();
    }, []);
    
    const onRefresh = React.useCallback(() => {
      setIsLoading(true);
      wait(2000).then(() =>{
        fetchOrders();
        setIsLoading(false);
      });
    });
    
    const fetchOrders = async() => {
      try{

        const id = profile.id;
        let resp = await fetchMyParkingRequests(id);
       
        if(resp.statusCode == 200){
          const data = resp.data;
          if(data.length > 0){
            setParkingRequests(data);
          }
        }else{
          Toast.show(resp.message);
        }
        
      }catch(err){
        Toast.show(err.message);
      }
      setIsLoading(false);
    }
    
    const showOrderInfo =(item) => {
      const order_no = item.order_no;
      const customer_id = item.customer_id;
      navigation.navigate('OrderDetails', {
        screen: 'OrderDetails',
        params: { orderNo: order_no,  customerId: customer_id},
      });
      
    }
    
    
    const renderComponent = (item) => {
      
      return ( 
        <TouchableOpacity 
        style={{flexDirection: 'row', justifyContent: 'space-around', padding:5}}
        onPress={() => showOrderInfo(item) }
        >
        <View>
          <Icon name={'parking'} size={45} color={colors.icon}/>
        </View>
        
        <View style={{ flexDirection: 'column'}}>
        <Text style={{ fontWeight:'bold',opacity:0.9, fontSize:16, color:styles.colors.parksmart }}>Order</Text>
        <Text style={{color:'#808080', fontSize:15}}>{item.request_date}</Text>
        <Text style={{color:'#808080', fontSize:15}}>{item.parking_area}</Text>
        </View>
        
        <View style={{ flexDirection: 'column'}}>
        <View>
        <Text style={{ fontWeight:'bold',opacity:0.8, fontSize:16 }}>{item.amount}</Text>
        </View>
        <View style={{ justifyContent: 'flex-end', alignItems: 'flex-end'}}>
        <FontAwesome name="angle-right" size={25} style={{right:0}} color={styles.colors.orange}/>
        </View>
        <View>
        <Text style={{color:'#808080', fontSize:15}}>{currency}</Text>
        </View>
        
        </View>
        
        </TouchableOpacity>
        
        
        
        );
      }
      
      const NoOrders = () =>{
        return (
          <View style={innerStyles.noContentContainer}>
          <Text style={innerStyles.text}>No Orders found</Text>
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
            {  isLoading ?  <AppLoader /> : null }

            <SafeAreaView style={{flex: 1, backgroundColor:'#fff'}}>
              <FocusAwareStatusBar barStyle="light-content" backgroundColor={colors.primary} />
            <Text style={{fontSize:19, color:'#808080', padding:5, marginLeft:5}}>Last Orders</Text>
            {  !isLoading ?
              <FlatList style= {{ backgroundColor:'#ffffff', height:'100%' }}
              data={parkingRequests}
              renderItem={({ item }) => renderComponent(item)}
              keyExtractor={(item, index) => String(index)}
              ListEmptyComponent={<NoOrders/>} 
              ItemSeparatorComponent={FlatListItemSeparator}
              refreshControl={<RefreshControl refreshing={isLoading} onRefresh={onRefresh}/>}
              /> 
              : null
            }
            </SafeAreaView>
            
            </>
            );
          }
          
          
          export default OrdersScreen 
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
