import React, {useState, useEffect, useRef} from 'react';
import {SafeAreaView, Platform, StyleSheet,
        ScrollView, RefreshControl,Alert,
        Text, View, Pressable, TextInput,
        TouchableOpacity, FlatList } from 'react-native';
    import Icon from 'react-native-vector-icons/FontAwesome5';
    import SearchableDropdown from 'react-native-searchable-dropdown';
    import {TimePicker} from 'react-native-simple-time-picker';
    import DateTimePicker from '@react-native-community/datetimepicker';
    import design from '../../assets/css/styles';
    import { DataTable, Divider } from 'react-native-paper';
    import { Avatar, Button, Card, Title, RadioButton , Searchbar  } from 'react-native-paper';
    import {Monetize} from '../components/SharedCommons';
    import CustomLoader from '../components/CustomActivityIndicator';
    import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
    import {callHelpLine} from '../components/SharedCommons';
    import { AuthContext } from '../context/context';

    const initialFeesData = [];
    
    const ParkingFeesScreen = ({route, navigation}) => {
    
        const { parking_area_id, parking_area, photo, phone_number } = route.params;
        const [fees, setFees] = useState(initialFeesData);
        const [done, setDone] = useState(false);
        const [refreshing, setRefreshing] = useState(false);
        
        const [searchQuery, setSearchQuery] = React.useState('');
        const [checked, setChecked] = React.useState('first');
        const onChangeSearch = query => setSearchQuery(query);
        const { fetchParkingFees } = React.useContext(AuthContext);
        
        const onRefresh = React.useCallback(async () => {
            setRefreshing(true);
            const timer = setTimeout(() => {
                setRefreshing(false);
            }, 1000);
            return () => clearTimeout(timer);
        }, [refreshing]);
        
        const getParkingFees = async() => {
            if(parking_area_id){
                console.log("Parking area is "+parking_area_id);
                await fetchParkingFees(parking_area_id).then(res => {
                    console.log("Response for parking fees is", res);
                    if(res.statusCode == 1){
                        setFees(res.data);
                    }
                    const timer = setTimeout(() => {
                        setDone(true);
                    }, 1000);
                    return () => clearTimeout(timer);
                }).catch(error => { 
                    setDone(true);
                    Alert.alert("Error","Unable to fetch parking fees: " + error);
                });
            }else{
                console.log("Unable to get parking area id");
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
                    
                    const FlatListHeader = () => {
                        return (
                            <>
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
                                        <Text style={{color:'#fff', fontSize:14, textTransform:'capitalize'}}>Request parking</Text> 
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
                                        // height: '100%',
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