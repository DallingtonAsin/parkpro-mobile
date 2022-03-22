import React, {useState, useEffect, useCallback, useFocusEffect} from 'react';
import {SafeAreaView, StatusBar,SectionList,Dimensions,
    StyleSheet, ScrollView, RefreshControl,useWindowDimensions , 
    Text, View, Pressable, TextInput, TouchableOpacity,
    Alert, FlatList, ToastAndroid} from 'react-native';
    import Icon from 'react-native-vector-icons/FontAwesome';
    import SearchableDropdown from 'react-native-searchable-dropdown';
    import {TimePicker} from 'react-native-simple-time-picker';
    import DateTimePicker from '@react-native-community/datetimepicker';
    import design from '../../assets/css/styles';
    import { Avatar, Card, Title, Paragraph, Searchbar  } from 'react-native-paper';
    import CustomLoader from '../components/CustomActivityIndicator';
    import { Rating, AirbnbRating, Button, Tab } from 'react-native-elements';
    import { TabView,TabBar, SceneMap } from 'react-native-tab-view';
    import { AuthContext } from '../context/context';
    import FastImage from 'react-native-fast-image';
    import FontAwesome from 'react-native-vector-icons/FontAwesome';
    import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
    import Toast from 'react-native-simple-toast';
    import FocusAwareStatusBar  from '../components/common/FocusAwareStatusBar';
    
    const ParkingAreasScreen = (props) => {
    
        const { getParkingAreas } = React.useContext(AuthContext);
        const [refreshing, setRefreshing] = useState(false);
        const [isLoading, setIsLoading] = useState(true);
        const [parkingAreas, setParkingAreas] = useState([]);
        const [filteredParkingAreas, setFilteredParkingAreas] = useState([]);
        const [query, setSearch] = useState('');
        const [index, setIndex] = React.useState(0);
        
        const [routes] = React.useState([
            { key: 'price', title: 'price' },
            { key: 'rating', title: 'rating' },
            { key: 'distance', title: 'distance' },
        ]);
        
        const handleSearch = (text) => {
            if(text){
                const newData = parkingAreas.filter((parking) => {
                    const itemData = parking.name ? parking.name.toLowerCase() : ''.toLowerCase();
                    const textData = text.toLowerCase();
                    return itemData.indexOf(textData) > -1;
                });
                setFilteredParkingAreas(newData);
                setSearch(text);
            }else{
                setFilteredParkingAreas(parkingAreas);
                setSearch(text);
                
            }
        }
        
        const onClickSearchBtn = () => {
            if(query){
                handleSearch(query);
            }else{
                setFilteredParkingAreas(parkingAreas);
                setSearch(query);
            }
        }
        
        
        const affordableParkings = () => (
            !isLoading ? 
            <View style={{marginTop:10}}>
            <FlatList
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
            data={filteredParkingAreas}
            renderItem={({item}) => CardComponent(item)}
            keyExtractor={(item, index) => index.toString()}
            refreshControl={
                <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                />
                
            }
            />
            </View>
            :  <CustomLoader color={design.colors.orange}/>
            );
            
            const mostRatedParkings = () => (
                !isLoading ? 
                <View style={{marginTop:20}}>
                <FlatList
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
                data={filteredParkingAreas}
                renderItem={({item}) => CardComponent(item)}
                keyExtractor={(item, index) => index.toString()}
                refreshControl={
                    <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                    />
                }
                />
                </View>
                :  <CustomLoader color={design.colors.orange}/>
                );
                const nearByParkings = () => (
                    !isLoading ? 
                    <View style={{marginTop:20}}>
                    <FlatList
                    showsVerticalScrollIndicator={false}
                    showsHorizontalScrollIndicator={false}
                    data={filteredParkingAreas}
                    renderItem={({item}) => CardComponent(item)}
                    keyExtractor={(item, index) => index.toString()}
                    refreshControl={
                        <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        />
                    }
                    />
                    </View>
                    :  <CustomLoader color={design.colors.orange}/>
                    );
                    
                    const renderScene = SceneMap({
                        price: affordableParkings,
                        rating: mostRatedParkings,
                        distance: nearByParkings,
                    });
                    
                    
                    
                    const CardComponent = (item) => (
                        <TouchableOpacity onPress={() => GotoFeesPage(item)}>
                        <View style={{flexDirection:'row'}}>
                        <FastImage
                        style={{
                            width: '45%',
                            height: '98%',
                            borderRadius: 15
                        }}
                        source={{
                            uri: item.photo,
                            priority: FastImage.priority.normal,
                        }}
                        resizeMode={FastImage.resizeMode.contain}
                        />
                        <View style={{flexDirection:'column', padding:10}}>
                        <View style={{flexDirection:'column'}}>
                        <Title>{item.name}</Title>
                        
                        <Paragraph style={{fontSize:16}}>{item.address}</Paragraph>
                        </View>
                        
                        <View style={{flexDirection:'row', justifyContent:'space-between'}}>
                        
                        <View style={{justifyContent:'flex-start'}}>
                        <Text style={{color:design.colors.warning}}>
                        Capacity: <Text style={{color:design.colors.warning, fontSize:16}}>{item.spots}</Text>
                        </Text> 
                        
                        <Text style={{color:design.colors.green}}>
                        Available:  <Text style={{color:design.colors.green, fontSize:16}}>{item.free}</Text>
                        </Text>
                        </View>
                        
                        <View style={{flexDirection:'column', justifyContent:'flex-end'}}>
                        <FontAwesome name="star" size={30} color={design.colors.warning}/>
                        <Text style={{color:design.colors.black, fontSize:14, textAlign: 'center'}}>{item.rating}%</Text>
                        </View>
                        
                        </View>
                        
                        <Pressable onPress={() => GotoFeesPage(item)} style={{backgroundColor:design.colors.primary,
                            justifyContent:'center', alignItems:'center', padding:5, margin:5, width:80, borderRadius:5}}>
                            <Text style={{color:design.colors.white}}>Fees</Text> 
                            </Pressable>
                            </View>
                            
                            </View>
                            
                            
                            </TouchableOpacity>
                            );
                            
                            
                            const GotoFeesPage = (item) => { 
                                props.navigation.navigate("ParkingFees", {
                                    screen: 'ParkingFees',
                                    params: { parking_area_id: item.id, 
                                        parking_area: item.name,
                                        address: item.address,
                                        phone_number: item.phone_number,
                                        photo: item.photo,
                                    }
                                });
                            }
                            
                            const onRefresh = useCallback(async () => {
                                setRefreshing(true);
                                setSearch('');
                                const timer = setTimeout(async() => {
                                    await fetchParkings();
                                    setRefreshing(false);
                                }, 1000);
                                return () => clearTimeout(timer);
                            }, [refreshing]);
                            
                            const fetchParkings = async() => {
                                const resp = await getParkingAreas();
                                if(resp.statusCode == 1){
                                    const parkings = resp.data;
                                    if(parkings.length > 0) {
                                        setFilteredParkingAreas(parkings);
                                        setParkingAreas(parkings);
                                    }
                                }else{
                                    Toast.show(resp.message, Toast.LONG);
                                }
                                
                                setIsLoading(false);
                            }
                            
                            
                            useEffect(() => {
                                fetchParkings();
                            }, []);
                            
                            const updateState = () => {
                                let isMounted = true;
                                if(isMounted || refreshing){
                                    fetchParkings();
                                }
                                if(searchQuery.length <= 0){
                                    fetchParkings();
                                }
                                return () => { isMounted = false }
                            }
                            
                            
                            
                            const renderTabBar = props => (
                                <TabBar
                                {...props}
                                renderLabel={({ route, focused, color }) => (
                                    <Text style={{ color: design.colors.dark, fontSize:16, opacity:0.6,
                                    textTransform:'capitalize', fontWeight: 'bold' }}>
                                    {route.title}
                                    </Text>
                                    )}
                                    indicatorStyle={{ backgroundColor: 'red' }}
                                    style={{ backgroundColor: '#fff' }}
                                    />
                                    );
                                    
                                    return (
                                        
                                        <SafeAreaView
                                        style={styles.scrollView}
                                        >
                                        
                                        
                                        <FocusAwareStatusBar barStyle="dark-content" backgroundColor={design.colors.white} />
                                        
                                        <View style={{flexDirection:'row', justifyContent: 'center', alignItems: 'center', marginTop:10}}>
                                        
                                        <TouchableOpacity onPress={()=>props.navigation.goBack()} style={{paddingRight:10}}>
                                        <FontAwesome name="arrow-left" size={25} color={design.colors.gray}/>
                                        </TouchableOpacity>
                                        
                                        <Searchbar
                                        placeholder="Search for parking..."
                                        onChangeText={(text) => handleSearch(text)}
                                        value={query}
                                        onIconPress={onClickSearchBtn}
                                        style={{ width: '85%'}}
                                        />
                                        <TouchableOpacity onPress={()=>onRefresh()} style={{paddingLeft:10}}>
                                        <FontAwesome name="refresh" size={25} color={design.colors.orange}/>
                                        </TouchableOpacity>
                                        </View>
                                        
                                        
                                        <ScrollView 
                                        horizontal={true} 
                                        contentContainerStyle={{width: '100%'}}>
                                        <TabView
                                        renderTabBar={renderTabBar}
                                        navigationState={{ index, routes }}
                                        renderScene={renderScene}
                                        onIndexChange={setIndex}
                                        initialLayout={{ width: Dimensions.get('window').width }}
                                        />
                                        </ScrollView>
                                        
                                        </SafeAreaView>
                                        );
                                    };
                                    
                                    export default ParkingAreasScreen;
                                    
                                    const styles = StyleSheet.create({
                                        container: {
                                            flex: 1,
                                        },
                                        scrollView: {
                                            flex: 1,
                                            backgroundColor: '#fff',
                                            padding: 10,
                                        },
                                        semicontainer:{
                                            flex:1,
                                            borderWidth:1,
                                            borderColor:'#C0c0c0',
                                            borderRadius:20,
                                            shadowColor: "#000",
                                            height: '100%',
                                            shadowOpacity: 0.6,
                                            padding:15,
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
                                        }
                                        
                                    });