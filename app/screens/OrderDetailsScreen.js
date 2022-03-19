import React, {useState, useContext, useEffect} from 'react';
import {Text, SafeAreaView, Image, 
  RefreshControl, View, FlatList,ScrollView,
   TouchableWithoutFeedback, StyleSheet} from 'react-native';
  import { AuthContext } from '../context/context';
  import styles from '../../assets/css/styles';
  import CustomLoader from '../components/CustomActivityIndicator';
import { icons } from '../../constants';
  import {APP_NAME, currency} from '@env';
  
  const wait = (timeout) => {
    return new Promise(resolve => setTimeout(resolve, timeout));
  }
  
  const  OrderDetailsScreen = ({route, navigation}) => {
    
    const [orderInfo, setOrderInfo] = useState([]);
    const [refreshing, setRefreshing] = React.useState(false);
    const [isLoading, setIsLoading] = React.useState(true);
 
    const { orderNo, customerId } = route.params;

    const { fetchOrderInfo } = React.useContext(AuthContext);

    
    const onRefresh = React.useCallback(() => {
      setRefreshing(true);
      wait(2000).then(() =>{
        fetchOrderDetails(orderNo, customerId);
        setRefreshing(false);
      });
    });
    
    const fetchOrderDetails = async(order_no, customer_id) => {
      try{
        const order_details = await fetchOrderInfo(order_no, customer_id);
        console.log("Order information", order_details);
        if(order_details.length > 0){
          setOrderInfo(order_details);
        }
        setIsLoading(false);
      }catch(e){
        console.log("Error on async storage", e);
      }
    }

    useEffect(() => {
      setIsLoading(true);
      fetchOrderDetails(orderNo, customerId);
    }, [orderNo, customerId])

    
    const renderComponent = (item) => {
      return ( 


        <SafeAreaView>
        <ScrollView 
        style={{flexDirection: 'column'}}
        >

        <View  style={{flex:1, flexDirection: 'row', padding:10, justifyContent:'space-between', right:10}}>
        <Image
        source={icons.parking6}
        resizeMode="contain"
        style={{
            width: 85,
            height: 85,
        }}
        />
        <View>

        <Text style={innerStyles.headerTitle}>Order</Text>
        <Text style={innerStyles.headerText}>{item.request_date}</Text>
        <Text style={innerStyles.headerText}>{APP_NAME} Wallet</Text>
        </View>

        <View>
        <Text style={innerStyles.headerTitle}>{item.amount}</Text>
        <Text style={innerStyles.headerText}>{currency}</Text> 
        </View>

        </View>


        <View style={innerStyles.orderInfoContainer}>
     
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding:10}}>
        <Text style={innerStyles.subtitle}>Names</Text>
        <Text style={innerStyles.info}>{item.name}</Text>
        </View>

        <View style={innerStyles.divider}></View>

        <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding:10}}>
        <Text style={innerStyles.subtitle}>Telephone</Text>
        <Text style={innerStyles.info}>{item.telephone_no}</Text>
        </View>

        <View style={innerStyles.divider}></View>

        <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding:10}}>
        <Text style={innerStyles.subtitle}>Order No</Text>
        <Text style={innerStyles.info}>{item.order_no}</Text>
        </View>

        <View style={innerStyles.divider}></View>

        <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding:10}}>
        <Text style={innerStyles.subtitle}>Parking Area</Text>
        <Text style={innerStyles.info}>{item.parking_area}</Text>
        </View>


        <View style={innerStyles.divider}></View>

        <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding:10}}>
        <Text style={innerStyles.subtitle}>Booking Period</Text>
        <Text style={innerStyles.info}>{item.booking_period}</Text>
        </View>

        <View style={innerStyles.divider}></View>

        <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding:10}}>
        <Text style={innerStyles.subtitle}>Total Time</Text>
        <Text style={innerStyles.info}>{item.parking_hours}</Text>
        </View>

        <View style={innerStyles.divider}></View>
        
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding:10}}>
        <Text style={innerStyles.subtitle}>Vehicle Type</Text>
        <Text style={innerStyles.info}>{item.car_type}</Text>
        </View>

        <View style={innerStyles.divider}></View>

        <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding:10}}>
        <Text style={innerStyles.subtitle}>Fee per hour</Text>
        <Text style={innerStyles.info}>{currency} {item.fee_per_hour}</Text>
        </View>

        <View style={innerStyles.divider}></View>

        <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding:10}}>
        <Text style={innerStyles.subtitle}>Total amount paid</Text>
        <Text style={innerStyles.info}>{currency} {item.amount}</Text>
        </View>
        </View>


        <View style={innerStyles.footer}>
        <TouchableWithoutFeedback onPress={() => navigation.navigate('Help')}>
            <Text style={innerStyles.helpCenterText}>Help Center</Text>
          </TouchableWithoutFeedback>
        </View>
  
        
        </ScrollView>
        
        </SafeAreaView>
        
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

          if(isLoading){
            return <CustomLoader color={styles.colors.orange}/>
          }
          
          if(!isLoading){
            return (<SafeAreaView style={{flex: 1, backgroundColor:'#fff'}}>
            <FlatList style= {{ backgroundColor:'#ffffff', height:'100%' }}
            data={orderInfo}
            renderItem={({ item }) => renderComponent(item)}
            keyExtractor={(item, index) => String(index)}
            ListEmptyComponent={<NoOrders/>} 
            ItemSeparatorComponent={FlatListItemSeparator}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh}/>}
            /> 
          </SafeAreaView>
          );
          }
      
         
          }
          
          
          export default OrderDetailsScreen; 
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

            orderInfoContainer:{
              flex: 1,
              borderWidth:1, 
              borderColor:'#e2e2e2',
              padding:10,
              margin:10,
              borderRadius:5,
              marginTop:20,
            },

        
            subtitle: {
              fontWeight:'bold',
              opacity:0.9, 
              fontSize:18, 
              color:styles.colors.parksmart,
              opacity:0.8,
            },

            info:{
              color:'#808080',
               fontSize:17
            },

            headerTitle:{
              fontSize:18,
               fontWeight: 'bold',
                color:styles.colors.primary
            },

            headerText:{
              fontSize:16,
              color: '#808080',
            },

            footer:{
               flex:1,
               alignItems: 'center',
               justifyContent: 'center',
               bottom: 0,
               marginTop: 25,
              //  position: 'absolute',
            },

            helpCenterText:{
              fontSize:22,
              fontWeight:'bold',
              color:styles.colors.orange,

            }


          });
