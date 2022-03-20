import React, { useState } from 'react';
import { Text,View, RefreshControl,SectionList,StatusBar,Image, StyleSheet} from 'react-native';
import design from '../../assets/css/styles';
import { DataTable, Divider } from 'react-native-paper';
import CustomLoader from '../components/CustomActivityIndicator';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthContext } from '../context/context';
import { icons } from '../../constants';
import Toast from 'react-native-simple-toast';


const wait = (timeout) => {
  return new Promise(resolve => setTimeout(resolve, timeout));
}


const TransactionsHistoryScreen = () => {
  
  const [transactions, setTransaction] = useState([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { getCustomerTransactions } = React.useContext(AuthContext);
  
  const EmptyFlastListMessage = ({item}) => {
    return (
      <Text
      style={styles.emptyListStyle}>
      No Transaction History Found
      </Text>
      );
    };
    
    const getDate = (date) => {
      var dateinfo = new Date(date);
      const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sept", "Oc", "Nov", "Dec"
    ];
    let day = dateinfo.getDate();
    let month = dateinfo.getMonth();
    return monthNames[month]+'-'+day;
  }
  
  const CustomDataTable = (props) => (
    <DataTable.Row>
    <DataTable.Cell>{getDate(props.item.date)}</DataTable.Cell>
    <DataTable.Cell>{props.item.type}</DataTable.Cell>
    <DataTable.Cell>{props.item.credit}</DataTable.Cell>
    <DataTable.Cell>{props.item.debt}</DataTable.Cell>
    <DataTable.Cell>{props.item.balance}</DataTable.Cell>
    </DataTable.Row>
    );
    
    const FlatListItemSeparator = () => {
      return (
        <Divider/>
        );
      }
      
      const FlatListHeader = () => {
        return (
          <>
          <DataTable.Header>
          <DataTable.Title>DATE</DataTable.Title>
          <DataTable.Title>TYPE</DataTable.Title>
          <DataTable.Title>CREDIT</DataTable.Title>
          <DataTable.Title>DEBT</DataTable.Title>
          <DataTable.Title>BALANCE</DataTable.Title>
          </DataTable.Header>
          </>
          );
        };
        
        
        const FlatListFooter = () => {
          return (
            <View style={styles.headerFooterStyle}>
            <Text style={styles.textStyle}>
            End of Transaction History
            </Text>
            </View>
            );
          };
          
          
          const fetchTransactions = async() => {
            try{
              const userProfile = await AsyncStorage.getItem("userProfile");
              const profile = JSON.parse(userProfile);
              const id = profile.id;
              const resp = await getCustomerTransactions(id);
              if(resp.statusCode == 1){
                const transactions = resp.data;
                console.log("Transactions", transactions);
                if(transactions.length > 0){
                  setTransaction(transactions);
                }
              }else{
                 Toast.show(resp.message);
              }
              setIsLoading(false);
            }catch(e){
              Toast.show(e.message);
            }
          }
          
          React.useEffect(() => {
            fetchTransactions();
          }, []);
          
          const onRefresh = React.useCallback(() => {
            setRefreshing(true);
            wait(2000).then(() =>{
              fetchTransactions();
              setRefreshing(false);
            });
          });
          
          return(
            <>
            <View style={{flex:1, width: '100%',}}>
            
            <StatusBar
            animated={true}
            backgroundColor={design.colors.primary}
            hidden={false} 
            />
            
            <View style={{height:130,backgroundColor: design.colors.primary}}>
            <View style={{alignItems: 'center', margin:20}}>
            
            <Image
            source={icons.statement}
            resizeMode="cover"
            style={{
              tintColor: '#fff',
              width:  50,
              height:  50,
            }}
            />
            
            <Text style={{color: '#fff', fontSize:18, padding:10, textTransform: 'capitalize' }}>Transactions</Text>
            </View>
            </View>
            
            <FlatListHeader/>
            { !isLoading ?
              <SectionList
              sections={transactions}
              keyExtractor={(item, index) => item + index}
              renderItem={({item, index}) => <CustomDataTable item={item}/>}
              renderSectionHeader={({ section: { year } }) => (
                <Text style={styles.header}>{year}</Text>
                )}
                SectionSeparatorComponent={FlatListItemSeparator}
                ListFooterComponent={FlatListFooter}
                ListEmptyComponent={EmptyFlastListMessage}
                refreshControl={
                  <RefreshControl
                  refreshing={refreshing}
                  onRefresh={onRefresh}
                  />}
                  />
                  : <CustomLoader color={design.colors.orange}/>
                }
                </View>
                
                
                </>
                ); 
              }
              
              export default TransactionsHistoryScreen
              
              const styles = StyleSheet.create({
                item :{
                  padding:15,
                },
                tableTitleText: {
                  fontSize:15,
                  color:'#000',
                  fontWeight:'bold', 
                },
                emptyListStyle: {
                  padding: 5,
                  fontSize: 18,
                  textAlign: 'center',
                },
                itemStyle: {
                  padding: 10,
                },
                headerFooterStyle: {
                  width: '100%',
                  height: 45,
                  backgroundColor: design.colors.primary,
                  bottom: 0, 
                  position: 'relative',
                },
                
                bottomView: {
                  width: '100%',
                  height: 50,
                  backgroundColor: '#EE5407',
                  justifyContent: 'center',
                  alignItems: 'center',
                  position: 'absolute', 
                  bottom: 0, 
                },
                
                textStyle: {
                  textAlign: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  fontSize: 14,
                  alignItems: 'center',
                  marginTop: 10,
                },
                
                item: {
                  backgroundColor: '#fff', 
                  padding: 20,
                  marginVertical: 8
                },
                header: {
                  fontSize: 20,
                  backgroundColor: "#fff",
                  fontWeight: 'bold',
                  textAlign: 'center',
                },
                title: {
                  fontSize: 24
                },
                
              });