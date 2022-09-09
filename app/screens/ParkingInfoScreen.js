import React, {useState, useEffect} from 'react';
import {StyleSheet, RefreshControl,Text, Image, View,TouchableOpacity, Alert, FlatList } from 'react-native';
import design from '../../assets/css/styles';
import { DataTable, Divider } from 'react-native-paper';
import { Card, Title } from 'react-native-paper';
import {Monetize} from '../components/sharedHelper/AppUtils';
import {callHelpLine} from '../components/sharedHelper/AppUtils';
import { AuthContext } from '../context/context';
import Toast from 'react-native-simple-toast';
import FocusAwareStatusBar  from '../components/common/FocusAwareStatusBar';
import { useTheme } from '@react-navigation/native';
import AppLoader from '../components/loaders/AppLoader';
import { assets } from '../constants';
import { CircleButton } from '../components';
import { RequestScreen } from '../components';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

const dbParkingHelper = require("../database/favouriteParkings");

const ParkingInfoScreen = ({ route }) => {
    
    const { item } = route.params; 
    const { id: parking_area_id, address, name, photo, phone_number } = item;
    const [fees, setFees] = useState([]);
    const [isAdding, setIsAdding] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isFavourite, setIsFavourite] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    
    const { colors } = useTheme();
    
    
    dbParkingHelper.doesParkingExistinFavourites(parking_area_id, exists => {
        if(exists){
            setIsFavourite(true);
        }else{
            setIsFavourite(false);
        }
    });

    const removeFromFavourites = (parking) => {

        console.log("Parking area id", parking);
        
        try{

          if(!parking.id){
            Toast.show('Please unable to get parking area id', Toast.LONG);
            return;
          }

          dbParkingHelper.removeParkingFromFavourites(parking, isDeleted => {
            if(isDeleted){
                setIsFavourite(false);
                Toast.show('Parking area '+parking.name+' successfully removed from favourites.', Toast.LONG);
            }else{
                Toast.show('Unable to remove parking area from favourites', Toast.LONG);
            }
          });
        }catch(err){
          console.log("Error on removing favourite parking", err);
        }
      }
      
     
        const confirmRemoveFromFavourites = (item) => {
          Alert.alert(
            'Confirm Remove',
            `Are you sure you want to remove  ${item.name} from your favourite parkings?`,
            [
              {
                text: 'Yes',
                onPress: () => {
                  removeFromFavourites(item);
                }
              },
              {
                text: 'No',
                onPress: () => {
                  
                }
              },
            ],
            { cancelable: true }
            );
          }
    
    const [searchQuery, setSearchQuery] = React.useState('');
    const onChangeSearch = query => setSearchQuery(query);
    const { fetchParkingInfo, searchParkingArea } = React.useContext(AuthContext);
    
    const onRefresh = React.useCallback(async () => {
        setIsLoading(true);
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 1000);
        return () => clearTimeout(timer);
    }, [isLoading]);
    
    
    const getParkingInfo = async() => {
        
        try{
            if(parking_area_id){
                setIsLoading(true);
                await fetchParkingInfo(parking_area_id).then(res => {
                    if(res.statusCode == 200){
                        setFees(res.data);
                    }
                    const timer = setTimeout(() => {
                        setIsLoading(false);
                    }, 2000);
                    return () => clearTimeout(timer);
                    
                }).catch(error => { 
                    Toast.show(`Error`,`Unable to fetch parking fees: ` + error);
                });
            }else{
                Toast.show(`Unable to get parking area id`, Toast.LONG);
            }
        }catch(err){
            Toast.show(err.message, Toast.LONG);
        }
    }
    
    const EmptyFlastListMessage = ({item}) => {
        return (
            <Text style={styles.emptyListStyle}>
            No fees Found
            </Text>
            );
        };
        
        const CustomDataTable = (props) => (
            <DataTable.Row>
            <DataTable.Cell><Text style={styles.tableCell}>{props.item.vehicle_type}</Text></DataTable.Cell>
            <DataTable.Cell><Text style={styles.tableCell}>{Monetize(props.item.fee_per_hour)}</Text></DataTable.Cell>
            </DataTable.Row>
            );
            
            const FlatListItemSeparator = () => {
                return (
                    <Divider/>
                    );
                }
                
                const addToFavourites = async() => {
                    try {
                        if(parking_area_id){
                            
                            const resp = await searchParkingArea(parking_area_id);
                            
                            if(resp.statusCode == 200){
                                const parking = resp.data[0];
                                if(parking){
                                    dbParkingHelper.doesParkingExistinFavourites(parking.id, exists => {
                                      console.log(`Parking id is ${parking.id} and exists ${exists}`)
                                        if(exists){
                                            Toast.show(`${parking.name} has already been added to favourites.`, Toast.LONG);
                                        }else{
                                            setIsAdding(true);
                                            dbParkingHelper.addParkingIntoFavourites(parking, isInserted => {
                                                setIsAdding(false);
                                                if(isInserted){
                                                    Toast.show(`Parking ${parking.name} has been successfully added to favourites.`, Toast.LONG);
                                                }else{
                                                    Toast.show('Unable to add parking to favourites', Toast.LONG);
                                                }
                                            });
                                        }
                                        
                                     
                                    });
                                }else{
                                    Toast.show(`Unable to fetch parking at this time.`);    
                                }
                                
                            }else{
                                Toast.show(resp.message);   
                            }
                        }else{
                            Toast.show(`Unable to capture selected parking.`);  
                        }
                    }catch(err){
                        Toast.show(err.message, Toast.LONG);
                    }
                }
                
                const FlatListHeader = () => {
                    return (
                        <>
                        <DataTable.Header>
                        <DataTable.Title><Text style={[styles.tableCell, {fontWeight: 'bold'}]}>Vehicle Type</Text></DataTable.Title>
                        <DataTable.Title><Text style={[styles.tableCell, {fontWeight: 'bold'}]}>Fee per hour</Text></DataTable.Title>
                        </DataTable.Header>
                        <Divider />
                        </>
                        );
                    };
                    
                    
                    useEffect(() => {
                        getParkingInfo();
                    }, [parking_area_id]);
                    
                    return (
                        <>

                        <RequestScreen  item={item} open={isOpen} onClose={()=> setIsOpen(false)}/>
                        
                        <View style={styles.container}>
                        
                        <FocusAwareStatusBar barStyle="light-content" 
                        backgroundColor={colors.primary} />
                        
                        { !isLoading ?
                            <>
                            <Card style={{backgroundColor: colors.body, height:'100%' }}>
                            <Image source={{ uri: photo }} 
                            resizeMode="cover"
                            style={{ 
                                width:'100%', 
                                height:'23%'
                            }}/>
                            <CircleButton 
                            imgUrl={assets.heart}
                            imgTintColor={isFavourite ? design.colors.orange : design.colors.gray }
                            right={10} 
                            top={10}
                            handlePress={() => isFavourite ? confirmRemoveFromFavourites(item) :  addToFavourites()}
                            />
                            
                            <View style={{ flex:1 }}>
                            
                            <Card.Content>
                            <Title style={{color: colors.dark }}>{name}</Title>
                            <Text style={{color: colors.dark, fontSize:15 }}>
                            <FontAwesome name="map-marker" size={18} color={design.colors.warning}/> {address}</Text>

                            <Text style={{fontSize: 15 }}>
                            <FontAwesome name="clock-o" size={14} color={design.colors.warning}/> Working hours: 
                            <Text style={{ fontWeight:'normal' }}>  {item.working_hours}
                            {item.is_open &&  <Text style={{fontSize:14, textTransform: 'uppercase', fontWeight: 'bold', opacity: 0.6, color: design.colors.green, left: 10}}> open</Text>}
                            {!item.is_open &&  <Text style={{fontSize:14, textTransform: 'uppercase', fontWeight: 'bold', opacity: 0.6, color: design.colors.red, left: 10}}> closed</Text>}
                            </Text>
                            </Text>
 
                                </Card.Content>

                                 <FlatList
                                data={fees}
                                renderItem={({item}) => <CustomDataTable item={item}/>}
                                ItemSeparatorComponent = { FlatListItemSeparator }
                                ListHeaderComponent={FlatListHeader}
                                ListEmptyComponent={EmptyFlastListMessage}
                                keyExtractor={(item, index) => index.toString()}
                                refreshControl={
                                <RefreshControl
                                refreshing={isLoading}
                                onRefresh={onRefresh}
                                />}/>

                                </View>
                                
                             
                                <View style={{
                                    flex: 1,
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    position: 'absolute',
                                    bottom: 0,
                                    marginBottom:20,
                                }}>
                                
                                <View style={styles.actionButtonView}>
                                <TouchableOpacity
                                onPress={() => setIsOpen(true) } 
                                style={[styles.actionButton, {backgroundColor: colors.primary}]}>
                                <Text style={{ 
                                    color: colors.text,
                                    fontSize:14,
                                    textTransform:'none',
                                    fontWeight: 'bold'}}>
                                    Place request
                                    </Text> 
                                    </TouchableOpacity>
                                    </View>
                                    
                                    <View style={styles.actionButtonView}>
                                    
                                    <TouchableOpacity style={styles.actionButton} onPress={() =>  callHelpLine(phone_number)}>
                                    <Text style={{
                                        fontSize:16, 
                                        paddingLeft:10, 
                                        fontWeight: 'bold',
                                        color:design.colors.dark
                                    }}>Call</Text>
                                    </TouchableOpacity>
                                    </View>
                                    
                                    </View>

                                    </Card>
                                    </>
                                    : null
                                }
                                
                                </View>
                                {  isLoading ?  <AppLoader /> : null }
                                </>
                                );
                            };
                            
                            export default ParkingInfoScreen;
                            
                            const styles = StyleSheet.create({
                                container: {
                                    flex: 1,
                                    backgroundColor: '#fff',
                                    padding: 10,
                                    height: '100%'
                                },
                                semicontainer:{
                                    flex:1,
                                    borderWidth:1,
                                    borderColor:'#e2e2e2',
                                    borderRadius:10,
                                    shadowColor: "#000",
                                    shadowOpacity: 0.6,
                                    padding:10,
                                    margin:5,
                                    shadowRadius: 10.32,
                                    shadowOffset: {
                                        width: 0,
                                        height: 8,
                                    }
                                },
                                titleText: {
                                    padding: 8,
                                    fontSize: 14,
                                    textAlign: 'left',
                                    fontWeight: 'bold',
                                },
                                headingText: {
                                    padding: 8,
                                    textTransform:'uppercase'
                                },
                                signIn: {
                                    width: '100%',
                                    height: 50,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    borderRadius: 50,
                                    backgroundColor: design.colors.primary
                                    
                                },
                                textSign: {
                                    fontSize: 15,
                                    fontWeight: 'bold'
                                },
                                input: {
                                    padding: 10,
                                    borderWidth: 1,
                                    borderColor: '#ccc',
                                    backgroundColor: '#FAF7F6',
                                    borderRadius:5,
                                },
                                emptyListStyle: {
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    alignSelf: 'center',
                                },
                                
                                actionButtonView:{
                                    paddingLeft:15,
                                    paddingRight:15,
                                    width: '50%'
                                },

                                actionButton: {
                                    alignItems: 'center',
                                    borderWidth: 1,
                                    borderRadius: 30,
                                    padding: 12,
                                },
                                
                                tableCell:{
                                    color: design.colors.dark,
                                    fontSize:16 
                                }
                                
                            });