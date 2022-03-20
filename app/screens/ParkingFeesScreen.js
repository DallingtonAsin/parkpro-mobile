import React, {useState, useEffect, useRef} from 'react';
import {StyleSheet, RefreshControl,Alert,Text, View,TouchableOpacity, FlatList } from 'react-native';
import design from '../../assets/css/styles';
import { DataTable, Divider } from 'react-native-paper';
import {  Button, Card, Title } from 'react-native-paper';
import {Monetize} from '../components/SharedCommons';
import CustomLoader from '../components/CustomActivityIndicator';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {callHelpLine} from '../components/SharedCommons';
import { AuthContext } from '../context/context';
import { UIActivityIndicator } from 'react-native-indicators';
import Toast from 'react-native-simple-toast';


const dbParkingHelper = require("../database/favouriteParkings");

const ParkingFeesScreen = ({route, navigation}) => {
    
    const { parking_area_id, address, parking_area, photo, phone_number } = route.params;
    const [fees, setFees] = useState([]);
    const [done, setDone] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [doesParkingExistInFavourites, setParkingExistsInFavourites] = useState(false);
    
    dbParkingHelper.doesParkingExistinFavourites(parking_area_id, exists => {
        if(exists){
            setParkingExistsInFavourites(true);
        }else{
            setParkingExistsInFavourites(false);
        }
    });
    
    const [searchQuery, setSearchQuery] = React.useState('');
    const onChangeSearch = query => setSearchQuery(query);
    const { fetchParkingFees, searchParkingArea } = React.useContext(AuthContext);
    
    const onRefresh = React.useCallback(async () => {
        setRefreshing(true);
        const timer = setTimeout(() => {
            setRefreshing(false);
        }, 1000);
        return () => clearTimeout(timer);
    }, [refreshing]);
    
    const getParkingFees = async() => {
        if(parking_area_id){
            await fetchParkingFees(parking_area_id).then(res => {
                if(res.statusCode == 1){
                    setFees(res.data);
                }
                const timer = setTimeout(() => {
                    setDone(true);
                }, 2000);
                return () => clearTimeout(timer);
            }).catch(error => { 
                setDone(true);
                Toast.show("Error","Unable to fetch parking fees: " + error);
            });
        }else{
            Toast.show("Unable to get parking area id", Toast.LONG);
        }
    }
    
    const EmptyFlastListMessage = ({item}) => {
        return (
            <Text
            style={styles.emptyListStyle}>
            No fees Found
            </Text>
            );
        };
        
        const CustomDataTable = (props) => (
            <DataTable.Row style={{opacity:0.7}}>
            <DataTable.Cell>{props.item.vehicle_type}</DataTable.Cell>
            <DataTable.Cell>{Monetize(props.item.fee_per_hour)}</DataTable.Cell>
            </DataTable.Row>
            );
            
            const FlatListItemSeparator = () => {
                return (
                    <Divider/>
                    );
                }
                
                const addParkingToFavourites = async() => {
                    
                    if(parking_area_id){
                        console.log("Parking id to be added", parking_area_id);
                        const resp = await searchParkingArea(parking_area_id)
                        if(resp.statusCode == 1){
                            const parking = resp.data[0];
                            console.log("Parking area object retrieved", parking);
                            if(parking){
                                setIsLoading(true);
                                dbParkingHelper.doesParkingExistinFavourites(parking.id, exists => {
                                    console.log("Exists parking area in favourites response", exists);
                                    if(exists){
                                        setIsLoading(false);
                                        Toast.show('Sorry, parking area '+parking.name+' has already been added to favourites.', Toast.LONG);
                                    }else{
                                        dbParkingHelper.addParkingIntoFavourites(parking, isInserted => {
                                            console.log("Insert parking into favourite response", isInserted);
                                            if(isInserted){
                                                Toast.show(`Parking ${parking.name} has been successfully added to favourites.`, Toast.LONG);
                                            }else{
                                                alert('Unable to add parking to favourites');
                                            }
                                            setIsLoading(false);
                                        });
                                    }
                                });
                            }else{
                                Toast.show("Unable to fetch parking at this time.");    
                            }
                            
                        }else{
                            Toast.show(resp.message);   
                        }
                    }else{
                        Toast.show("Unable to capture selected parking.");  
                    }
                }
                
                const FlatListHeader = () => {
                    return (
                        <>

                        {
                            doesParkingExistInFavourites ? 
                             <Text style={{color: design.colors.orange, fontSize:15, fontWeight: 'bold', fontStyle: 'italic'}}>
                                    <FontAwesome5 name={"heart"} size={16} color={design.colors.orange} /> Marked Favourite</Text>
                            :   <TouchableOpacity onPress={() => addParkingToFavourites()} 
                            style={{ backgroundColor: design.colors.primary, 
                                borderRadius:5, alignContent:'center', 
                                alignItems:'center', padding:15, borderRadius:35 }}>
                                
                                {isLoading ?
                                    <UIActivityIndicator color='white' size={30} /> :
                                    <Text style={{color:'#fff', fontSize:14, textTransform:'capitalize'}}>
                                    Add to Favourites
                                    </Text> 
                                }
                                </TouchableOpacity>
                        }
                        
                        
                     
                            <DataTable.Header>
                            <DataTable.Title>Vehicle Type</DataTable.Title>
                            <DataTable.Title>Fee/hour</DataTable.Title>
                            </DataTable.Header>
                            <Divider />
                            </>
                            );
                        };
                        
                        const updateFees = () => {
                            getParkingFees();
                            if(refreshing){
                                getParkingFees();
                            }
                        }
                        
                        
                        
                        useEffect(() => {
                            getParkingFees();
                        }, [parking_area_id]);
                        
                        return (
                            <View style={styles.container}>
                            <View style={styles.semicontainer}>
                            
                            { done ?
                                <>
                                <Card>
                                <Card.Cover source={{ uri: photo }} style={{width:'90%', height:'40%', margin:5, borderRadius:5}}/>
                                <Card.Content>
                                <Title>{parking_area}</Title>
                                <Title>{address}</Title>
                                <FlatList
                                data={fees}
                                renderItem={({item}) => <CustomDataTable item={item}/>}
                                ItemSeparatorComponent = { FlatListItemSeparator }
                                ListHeaderComponent={FlatListHeader}
                                ListEmptyComponent={EmptyFlastListMessage}
                                keyExtractor={(item, index) => index.toString()}
                                refreshControl={
                                    <RefreshControl
                                    refreshing={refreshing}
                                    onRefresh={onRefresh}
                                    />}
                                    />
                                    </Card.Content>
                                    <Card.Actions>
                                    
                                    <View style={{flexDirection: 'row'}}>
                                    <View>
                                    <Button onPress={() => navigation.navigate("Map")} style={{ backgroundColor: design.colors.primary, 
                                        borderRadius:5, alignContent:'center', alignItems:'center', padding:5, borderRadius:35 }}>
                                        <Text style={{color:'#fff', fontSize:14, textTransform:'capitalize'}}>
                                        Request parking
                                        </Text> 
                                        </Button>
                                        </View>
                                        <View>
                                        <TouchableOpacity style={styles.callBtn} onPress={() =>  callHelpLine(phone_number)}>
                                        <FontAwesome5 name="phone-alt" size={18} color={design.colors.white}/>
                                        <Text style={{fontSize:16, paddingLeft:10, color:design.colors.white}}>Call Now</Text>
                                        </TouchableOpacity>
                                        </View>
                                        </View>
                                        </Card.Actions>
                                        </Card>
                                        </>
                                        : <CustomLoader color={design.colors.orange}/>
                                    }
                                    
                                    
                                    </View>
                                    </View>
                                    );
                                };
                                
                                export default ParkingFeesScreen;
                                
                                const styles = StyleSheet.create({
                                    container: {
                                        flex: 1,
                                        backgroundColor: '#fff',
                                        padding: 10,
                                        
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
                                    callBtn:{
                                        flexDirection: 'row',
                                        height:45,
                                        borderWidth:1,
                                        borderRadius:30,
                                        borderColor: design.colors.success,
                                        backgroundColor: design.colors.success,
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        width:'70%',
                                        marginLeft:30,
                                    },
                                    
                                });