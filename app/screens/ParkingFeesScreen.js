import React, {useState, useEffect} from 'react';
import {StyleSheet, RefreshControl,Text, Image, View,TouchableOpacity, FlatList } from 'react-native';
import design from '../../assets/css/styles';
import { DataTable, Divider } from 'react-native-paper';
import { Card, Title } from 'react-native-paper';
import {Monetize} from '../components/sharedHelper/AppUtils';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import {callHelpLine} from '../components/sharedHelper/AppUtils';
import { AuthContext } from '../context/context';
import Toast from 'react-native-simple-toast';
import FocusAwareStatusBar  from '../components/common/FocusAwareStatusBar';
import { useTheme } from '@react-navigation/native';
import AppLoader from '../components/loaders/AppLoader';
import {  SIZES, assets } from '../constants';
import { CircleButton } from '../components';
import { RequestScreen } from '../components';


const dbParkingHelper = require("../database/favouriteParkings");

const ParkingFeesScreen = ({route, navigation}) => {
    
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
    
    const [searchQuery, setSearchQuery] = React.useState('');
    const onChangeSearch = query => setSearchQuery(query);
    const { fetchParkingFees, searchParkingArea } = React.useContext(AuthContext);
    
    const onRefresh = React.useCallback(async () => {
        setIsLoading(true);
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 1000);
        return () => clearTimeout(timer);
    }, [isLoading]);
    
    
    const getParkingFees = async() => {
        
        try{
            if(parking_area_id){
                setIsLoading(true);
                await fetchParkingFees(parking_area_id).then(res => {
                    if(res.statusCode == 1){
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
                
                const addParkingToFavourites = async() => {
                    try {
                        if(parking_area_id){
                    
                            const resp = await searchParkingArea(parking_area_id)
                            if(resp.statusCode == 1){
                                const parking = resp.data[0];
                                if(parking){
                                    setIsAdding(true);
                                    dbParkingHelper.doesParkingExistinFavourites(parking.id, exists => {
                                        if(exists){
                                            Toast.show(`${parking.name} has already been added to favourites.`, Toast.LONG);
                                        }else{
                                            dbParkingHelper.addParkingIntoFavourites(parking, isInserted => {
                                                if(isInserted){
                                                    Toast.show(`Parking ${parking.name} has been successfully added to favourites.`, Toast.LONG);
                                                }else{
                                                    Toast.show('Unable to add parking to favourites', Toast.LONG);
                                                }
                                            });
                                        }
                                        
                                        setIsAdding(false);
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
                        getParkingFees();
                    }, [parking_area_id]);
                    
                    return (
                        <>
                        <RequestScreen  item={item} open={isOpen} onClose={()=> setIsOpen(false)}/>
                        
                        <View style={styles.container}>
                        
                        <FocusAwareStatusBar barStyle="light-content" 
                        backgroundColor={colors.primary} />
                        
                        {/* <View style={styles.semicontainer}> */}
                        
                        { !isLoading ?
                            <>
                            <Card style={{backgroundColor: colors.body, height:'100%' }}>
                            <Image source={{ uri: photo }} 
                            resizeMode="cover"
                            style={{ 
                                width:'100%', 
                                height:'23%',
                                // borderTopLeftRadius: SIZES.font,
                                // borderTopRightRadius: SIZES.font
                            }}/>
                            <CircleButton 
                            imgUrl={assets.heart}
                            imgTintColor={isFavourite ? design.colors.orange : design.colors.gray }
                            right={10} 
                            top={10}
                            handlePress={() => addParkingToFavourites()}
                            />
                            
                            <View style={{ flex:1 }}>
                            
                            <Card.Content>
                            <Title style={{color: colors.dark }}>{name}</Title>
                            <Text style={{color: colors.dark, fontSize:14 }}>{address} </Text>
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
                                />}
                                />
                                </Card.Content>
                                </View>
                                
                                <Card.Actions>
                                
                                <View style={{
                                    flex:1,
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    position: 'absolute',
                                    bottom: 0,
                                    marginBottom:20,
                                }}>
                                
                                <TouchableOpacity
                                onPress={() => setIsOpen(true) } 
                                style={[styles.actionButton, {backgroundColor: colors.primary, borderColor: colors.primary}]}>
                                <Text style={{ 
                                    color: colors.text,
                                    fontSize:14,
                                    textTransform:'none',
                                    fontWeight: 'bold'}}>
                                    Place request
                                    </Text> 
                                    </TouchableOpacity>
                                    
                                    <TouchableOpacity style={[styles.actionButton, { left:20 }]} onPress={() =>  callHelpLine(phone_number)}>
                                    <FontAwesome5 name="phone-alt" size={18} color={design.colors.dark}/>
                                    <Text style={{
                                        fontSize:16, 
                                        paddingLeft:10, 
                                        fontWeight: 'bold',
                                        color:design.colors.dark
                                        }}>Call</Text>
                                    </TouchableOpacity>
                                    
                                    
                                    </View>
                                    
                                    </Card.Actions>
                                    </Card>
                                    </>
                                    : null
                                }
                                
                                
                                {/* </View> */}
                                </View>
                                {  isLoading ?  <AppLoader /> : null }
                                </>
                                );
                            };
                            
                            export default ParkingFeesScreen;
                            
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
                                actionButton:{
                                    flexDirection: 'row',
                                    height:50,
                                    borderWidth:1,
                                    borderRadius:30,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    width: 180
                                },
                                
                                tableCell:{
                                    color: design.colors.dark,
                                    fontSize:16 
                                }
                                
                            });