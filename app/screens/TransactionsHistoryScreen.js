import React, { useState } from 'react';
import { Text,View, RefreshControl,SectionList,Image, StyleSheet} from 'react-native';
import { DataTable, Divider } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthContext } from '../context/context';
import { icons } from '../../constants';
import Toast from 'react-native-simple-toast';
import FocusAwareStatusBar  from '../components/common/FocusAwareStatusBar';
import { useTheme  } from 'react-native-paper';
import AppLoader from '../components/loaders/AppLoader';

const wait = (timeout) => {
  return new Promise(resolve => setTimeout(resolve, timeout));
}


const TransactionsHistoryScreen = () => {
  
  const [transactions, setTransaction] = useState([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { getCustomerTransactions } = React.useContext(AuthContext);
  const { colors } = useTheme();
  const styles = makeStyles(colors);

  

  const EmptyFlastListMessage = ({item}) => {
    return (
      <Text
      style={styles.emptyListStyle}>
      No Transaction History Found
      </Text>
      );
    };
    
    const getDate = (date) => {
      let dateinfo = new Date(date);
      const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sept", "Oc", "Nov", "Dec"
    ];
    const dd = String(dateinfo.getDate()).padStart(2, '0');
    const month = dateinfo.getMonth();
    return dd+'-'+monthNames[month];
  }
  
  const CustomDataTable = (props) => (
    <DataTable.Row>
    <DataTable.Cell><Text style={styles.cellText}>{getDate(props.item.date)}</Text></DataTable.Cell>
    <DataTable.Cell><Text style={styles.cellText}>{props.item.type}</Text></DataTable.Cell>
    <DataTable.Cell><Text style={styles.cellText}>{props.item.credit}</Text></DataTable.Cell>
    <DataTable.Cell><Text style={styles.cellText}>{props.item.debt}</Text></DataTable.Cell>
    <DataTable.Cell><Text style={styles.cellText}>{props.item.balance}</Text></DataTable.Cell>
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
          <DataTable.Title><Text style={styles.rowHeaderText}>DATE</Text></DataTable.Title>
          <DataTable.Title><Text style={styles.rowHeaderText}>TYPE</Text></DataTable.Title>
          <DataTable.Title><Text style={styles.rowHeaderText}>CREDIT</Text></DataTable.Title>
          <DataTable.Title><Text style={styles.rowHeaderText}>DEBT</Text></DataTable.Title>
          <DataTable.Title><Text style={styles.rowHeaderText}>BALANCE</Text></DataTable.Title>
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
            <View style={{flex:1, width: '100%', backgroundColor: colors.body}}>
            
            <FocusAwareStatusBar barStyle="light-content" backgroundColor={colors.primary} />
            
            <View style={{height:130,backgroundColor: colors.primary}}>
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
                // ListFooterComponent={FlatListFooter}
                ListEmptyComponent={EmptyFlastListMessage}
                refreshControl={
                  <RefreshControl
                  refreshing={refreshing}
                  onRefresh={onRefresh}
                  />}
                  />
                  :  null
                }
                </View>

                {  isLoading ?  <AppLoader /> : null }

                </>
                ); 
              }
              
              export default TransactionsHistoryScreen
              
              const makeStyles = (colors)  =>StyleSheet.create({
                item :{
                  padding:15,
                },
                tableTitleText: {
                  fontSize:15,
                  color: colors.bodyText,
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
                  backgroundColor: colors.body,
                  bottom: 0, 
                  position: 'relative',
                },
                
                bottomView: {
                  width: '100%',
                  height: 50,
                  // backgroundColor: '#EE5407',
                  justifyContent: 'center',
                  alignItems: 'center',
                  position: 'absolute', 
                  bottom: 0, 
                },
                
                textStyle: {
                  textAlign: 'center',
                  justifyContent: 'center',
                  color: colors.bodyText,
                  fontSize: 14,
                  alignItems: 'center',
                  marginTop: 10,
                },
                
                item: {
                  backgroundColor: colors.bodyText, 
                  padding: 20,
                  marginVertical: 8
                },
                header: {
                  fontSize: 20,
                  backgroundColor: colors.bodyText,
                  fontWeight: 'bold',
                  textAlign: 'center',
                },
                title: {
                  fontSize: 24
                },
                cellText:{
                  fontSize:16
                },
                rowHeaderText:{
                  fontWeight: 'bold',
                  color: colors.primary,
                }
                
              });