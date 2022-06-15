  import React, {useState, useEffect} from 'react';
  import {Text, SafeAreaView, Image, RefreshControl, View, FlatList, TouchableWithoutFeedback, StyleSheet} from 'react-native';
  import { AuthContext } from '../context/context';
  import styles from '../../assets/css/styles';
  import { icons } from '../../constants';
  import {APP_NAME, currency} from '@env';
  import FocusAwareStatusBar  from '../components/common/FocusAwareStatusBar';
  import { useTheme } from '@react-navigation/native';
  import AppLoader from '../components/loaders/AppLoader';
  import Toast from 'react-native-simple-toast';
  import { callHelpLine } from '../components/SharedCommons';
  import { COMPANY_LINE } from '@env';
  
  
  const wait = (timeout) => {
    return new Promise(resolve => setTimeout(resolve, timeout));
  }
  
  const OrderDetailsScreen = ({route, navigation}) => {
    
    const [orderInfo, setOrderInfo] = useState([]);
    const [isLoading, setIsLoading] = React.useState(true);
    const { colors } = useTheme();
    
    const { orderNo, customerId } = route.params;
    const { fetchOrderInfo } = React.useContext(AuthContext);
    
    const onRefresh = React.useCallback(() => {
      setIsLoading(true);
      wait(2000).then(() =>{
        fetchOrderDetails(orderNo, customerId);
        setIsLoading(false);
      });
    });
    
    const fetchOrderDetails = async(order_no, customer_id) => {
      try{
        
        const result = await fetchOrderInfo(order_no, customer_id);
        if(result.statusCode == "1"){
          const order_details = result.data; 
          console.log("Order details", order_details);
          if(order_details.length > 0){
            setOrderInfo(order_details);
          }
        }
      }catch(err){
        Toast.show(err.message, Toast.LONG);
      }
      setIsLoading(false);

    }
    
    useEffect(() => {
      setIsLoading(true);
      fetchOrderDetails(orderNo, customerId);
    }, [orderNo, customerId])
    
    
    const renderComponent = (item) => {
      return ( 
        
        <View style={{backgroundColor: '#fff' }}>
        <View  style={{flex:1, flexDirection: 'row',
        padding:10,
        justifyContent:'space-between', right:10}}>
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
        
        <View style={innerStyles.orderInfo}>
          <Text style={innerStyles.subtitle}>Names</Text>
          <Text style={innerStyles.info}>{item.name}</Text>
        </View>
        
        <View style={innerStyles.divider}></View>
        
        <View style={innerStyles.orderInfo}>
          <Text style={innerStyles.subtitle}>Telephone</Text>
          <Text style={innerStyles.info}>{item.telephone_no}</Text>
        </View>
        
        <View style={innerStyles.divider}></View>
        
        <View style={innerStyles.orderInfo}>
          <Text style={innerStyles.subtitle}>Order No</Text>
          <Text style={innerStyles.info}>{item.order_no}</Text>
        </View>
        
        <View style={innerStyles.divider}></View>
        
        <View style={innerStyles.orderInfo}>
          <Text style={innerStyles.subtitle}>Parking Area</Text>
          <Text style={innerStyles.info}>{item.parking_area}</Text>
        </View>
        
        
        <View style={innerStyles.divider}></View>
        
        <View style={innerStyles.orderInfo}>
          <Text style={innerStyles.subtitle}>Booking Period</Text>
          <Text style={innerStyles.info}>{item.booking_period}</Text>
        </View>
        
        <View style={innerStyles.divider}></View>
        
        <View style={innerStyles.orderInfo}>
          <Text style={innerStyles.subtitle}>Total Time</Text>
          <Text style={innerStyles.info}>{item.parking_hours}</Text>
        </View>
        
        <View style={innerStyles.divider}></View>
        
        <View style={innerStyles.orderInfo}>
          <Text style={innerStyles.subtitle}>Vehicle Type</Text>
          <Text style={innerStyles.info}>{item.car_type}</Text>
        </View>
        
        <View style={innerStyles.divider}></View>
        
        <View style={innerStyles.orderInfo}>
          <Text style={innerStyles.subtitle}>Fee per hour</Text>
          <Text style={innerStyles.info}>{currency} {item.fee_per_hour}</Text>
        </View>
        
        <View style={innerStyles.divider}></View>
        
        <View style={innerStyles.orderInfo}>
          <Text style={innerStyles.subtitle}>Total amount paid</Text>
          <Text style={innerStyles.info}>{currency} {item.amount}</Text>
        </View>

        </View>
        
        
        <View style={innerStyles.footer}>
          <TouchableWithoutFeedback onPress={() => {callHelpLine(COMPANY_LINE)}}>
          <Text style={innerStyles.helpCenterText}>Contact support</Text>
          </TouchableWithoutFeedback>
        </View>
        
        </View>
        
        
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
            
            
            <SafeAreaView style={{flex: 1, backgroundColor:'#fff'}}>
            <FocusAwareStatusBar barStyle="light-content" backgroundColor={colors.primary} />
            { !isLoading ?
              <FlatList style= {{ backgroundColor:'#ffffff', height:'100%' }}
              data={orderInfo}
              renderItem={({ item }) => renderComponent(item)}
              keyExtractor={(item, index) => String(index)}
              ListEmptyComponent={<NoOrders/>} 
              ItemSeparatorComponent={FlatListItemSeparator}
              refreshControl={<RefreshControl refreshing={isLoading} onRefresh={onRefresh}/>}
              /> 
              : null
            }
            </SafeAreaView>
            
            {  isLoading ?  <AppLoader /> : null }
            
            </>
            );
            
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
              backgroundColor: '#fff'
              
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
              fontSize:16
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
            },
            
            helpCenterText:{
              fontSize:22,
              fontWeight:'bold',
              color:styles.colors.orange
            },

            orderInfo: {
              flexDirection: 'row',
              justifyContent: 'space-between',
              padding:10
            },
            
            
          });
