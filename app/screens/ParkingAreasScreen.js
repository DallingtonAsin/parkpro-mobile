import React, {useState, useEffect, useRef} from 'react';
import {SafeAreaView, Platform,SectionList,Dimensions,
    StyleSheet, ScrollView, RefreshControl,useWindowDimensions , 
    Text, View, Pressable, TextInput, TouchableOpacity,
    Alert, FlatList} from 'react-native';
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
    
    
    const ParkingAreasScreen = (props) => {
        
        
        const { getParkingAreas, filterParkingAreas } = React.useContext(AuthContext);
        const [refreshing, setRefreshing] = useState(false);
        const [parkingAreas, setParkingAreas] = useState([]);
        const [isLoading, setIsLoading] = useState(true);
        const [searchQuery, setSearchQuery] = useState('');
        
        
        const [index, setIndex] = React.useState(0);
        
        const [routes] = React.useState([
            { key: 'first', title: 'Recent' },
            { key: 'second', title: 'price' },
            { key: 'third', title: 'rating' },
            { key: 'fourth', title: 'distance' },
        ]);
        
        
        const RecentParkings = () => (
            !isLoading ? 
            <View style={{marginTop:10}}>
            <FlatList
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
            data={parkingAreas}
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

            const affordableParkings = () => (
                !isLoading ? 
                <View style={{marginTop:10}}>
                <FlatList
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
                data={parkingAreas}
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
            
            const favouriteParkings = () => (
                !isLoading ? 
                <View style={{marginTop:20}}>
                <FlatList
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
                data={parkingAreas}
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
                    data={parkingAreas}
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
                    first: RecentParkings,
                    second: favouriteParkings,
                    third: affordableParkings,
                    fourth: nearByParkings,
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
                    <Paragraph>{item.address}</Paragraph>
                    </View>
                    
                    <View style={{flexDirection:'row', justifyContent:'space-between'}}>
                    
                    <View style={{justifyContent:'flex-start'}}>
                    <Text style={{color:design.colors.warning}}>
                    Capacity: <Text style={{color:design.colors.warning}}>{item.spots}</Text>
                    </Text> 
                    
                    <Text style={{color:design.colors.green}}>
                    Available:  <Text style={{color:design.colors.green}}>{item.free}</Text>
                    </Text>
                    </View>
                    
                    <View style={{flexDirection:'column', justifyContent:'flex-end'}}>
                    <FontAwesome name="star" size={30} color={design.colors.warning}/>
                    <Text style={{color:design.colors.black, fontSize:14, textAlign: 'center'}}>{item.rating}%</Text>
                    </View>
                    
                    </View>
                    
                    
                    
                    
                    
                    
                    
                    {/* <Rating
                        showRating={false}
                        imageSize={25}
                        readonly
                        style={{ paddingVertical: 10 }}
                    /> */}
                    
                    <Pressable onPress={() => GotoFeesPage(item)} style={{backgroundColor:design.colors.primary,
                        justifyContent:'center', alignItems:'center', padding:5, margin:5, width:80, borderRadius:5}}>
                        <Text style={{color:design.colors.white}}>Fees</Text> 
                        </Pressable>
                        </View>
                        
                        </View>
                        
                        
                        </TouchableOpacity>
                        );
                        
                        const filterParkings = async(searchItem) => {
                            await filterParkingAreas(searchItem).then(res => {
                                console.log("Response for parking areas is", res);
                                if(res.statusCode == 1){
                                    const p_areas = res.data;
                                    if(p_areas.length > 0){
                                        setParkingAreas(p_areas);
                                    }
                                }
                                setDone(true);
                            }).catch(error => { 
                                setDone(true);
                                Alert.alert("Error","Unable to fetch parking areas: " + error);
                            });
                        }
                        
                        const onChangeSearch = async(query) => {
                            setSearchQuery(query);
                            if(query && query.length > 1) {
                                filterParkings(query);
                            }
                        };
                        
                        const onClickSearchBtn = () => {
                            if(searchQuery && searchQuery.length > 1) {
                                filterParkings(searchQuery);
                            }else{ 
                                Alert.alert("Message", "Type atleast 3 characters to filter parkings");
                            }
                        };
                        
                        const GotoFeesPage = (item) => { 
                            props.navigation.navigate("ParkingFees", {
                                screen: 'ParkingFees',
                                params: { parking_area_id: item.id, 
                                          parking_area: item.name,
                                          phone_number: item.phone_number,
                                          photo: item.photo,
                                }
                            });
                        }
                        
                        const onRefresh = React.useCallback(async () => {
                            setRefreshing(true);
                            const timer = setTimeout(() => {
                                setRefreshing(false);
                            }, 1000);
                            return () => clearTimeout(timer);
                        }, [refreshing]);
                        
                        const fetchParkings = async() => {
                            const parkings = await getParkingAreas();
                            if(parkings.length > 0) {
                                setParkingAreas(parkings);
                            }
                            setIsLoading(false);
                        }
                        
                        React.useEffect(() => {
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
                                <Text style={{ color: '#000', margin: 8, fontSize:15, textTransform:'capitalize' }}>
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
                                    
                                    <View style={{flexDirection:'row', justifyContent: 'center', alignItems: 'center', marginTop:10}}>
                                    <Searchbar
                                    placeholder="Search for parking..."
                                    onChangeText={onChangeSearch}
                                    value={searchQuery}
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