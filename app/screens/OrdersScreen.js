import React, {useState, useContext, useEffect} from 'react';
import {Text, SafeAreaView, Image, ScrollView,RefreshControl, TouchableWithoutFeedback,
  TouchableOpacity,View, FlatList, StyleSheet} from 'react-native';
  import Icon from 'react-native-vector-icons/FontAwesome5';
  import { AuthContext } from '../context/context';
  import AsyncStorage from '@react-native-async-storage/async-storage';
  import styles from '../../assets/css/styles';
  import CustomLoader from '../components/CustomActivityIndicator';
  import FontAwesome from 'react-native-vector-icons/FontAwesome';
  import Toast from 'react-native-simple-toast';
import ProfileContext from '../context/index';
import { icons } from '../../constants';
import {APP_NAME, currency} from '@env';
  
  
  const wait = (timeout) => {
    return new Promise(resolve => setTimeout(resolve, timeout));
  }
  
  const  OrdersScreen = ({ navigation }) => {
    
    const [parkingRequests, setParkingRequests] = useState([]);
    const [refreshing, setRefreshing] = React.useState(false);
    const [isLoading, setIsLoading] = React.useState(true);
    const {profile, setProfile} = useContext(ProfileContext);

    const { fetchMyParkingRequests } = React.useContext(AuthContext);
    
    React.useEffect(() => {
      fetchOrders();
    }, []);
    
    const onRefresh = React.useCallback(() => {
      setRefreshing(true);
      wait(2000).then(() =>{
        fetchOrders();
        setRefreshing(false);
      });
    });
    
    const fetchOrders = async() => {
      try{
        const id = profile.id;
        let parkingRequests = await fetchMyParkingRequests(id);
        console.log("Parking requests", parkingRequests);
        if(parkingRequests.length > 0){
          setParkingRequests(parkingRequests);
        }
        setIsLoading(false);
      }catch(e){
        console.log("Error on async storage", e);
      }
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
        {/* <Image source={require('../../assets/icons/money.jpg')}  style={{ width:70, height:70, borderRadius:50} }  /> */}
        <Image
        source={icons.parking6}
        resizeMode="contain"
        style={{
            width: 55,
            height: 55,
        }}
        />

        </View>
        
        <View style={{ flexDirection: 'column'}}>
        <Text style={{ fontWeight:'bold',opacity:0.9, fontSize:16, color:styles.colors.parksmart }}>Order</Text>
        <Text style={{color:'#808080', fontSize:15}}>{item.request_date}</Text>
        <Text style={{color:'#808080', fontSize:15}}>{APP_NAME} Wallet</Text>
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
            <SafeAreaView style={{flex: 1, backgroundColor:'#fff'}}>
            <Text style={{fontSize:19, color:'#808080', padding:5, marginLeft:5}}>Last Orders</Text>
            {  !isLoading ?
              <FlatList style= {{ backgroundColor:'#ffffff', height:'100%' }}
              data={parkingRequests}
              renderItem={({ item }) => renderComponent(item)}
              keyExtractor={(item, index) => String(index)}
              ListEmptyComponent={<NoOrders/>} 
              ItemSeparatorComponent={FlatListItemSeparator}
              refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh}/>}
              /> 
              : <CustomLoader color={styles.colors.orange}/>
            }
            </SafeAreaView>
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
