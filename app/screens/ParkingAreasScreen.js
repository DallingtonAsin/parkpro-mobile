import React, {useState, useEffect, useCallback} from 'react';
import {SafeAreaView,
    StyleSheet, RefreshControl,
    Text, View, Pressable, TouchableOpacity,
    FlatList} from 'react-native';
    import design from '../../assets/css/styles';
    import { Title, Paragraph, Searchbar  } from 'react-native-paper';
    import { AuthContext } from '../context/context';
    import FastImage from 'react-native-fast-image';
    import FontAwesome from 'react-native-vector-icons/FontAwesome';
    import Toast from 'react-native-simple-toast';
    import FocusAwareStatusBar  from '../components/common/FocusAwareStatusBar';
    import Geolocation from 'react-native-geolocation-service';
    import { useTheme } from '@react-navigation/native';
    import AppLoader from '../components/loaders/AppLoader';
    
    
    const ParkingAreasScreen = (props) => {
        
        const { getParkingAreas } = React.useContext(AuthContext);
        const [isLoading, setIsLoading] = useState(false);
        
        const [parkingAreas, setParkingAreas] = useState([]);
        const [filteredParkingAreas, setFilteredParkingAreas] = useState([]);
        
        const paperTheme = useTheme();
        const { colors } = useTheme();
        
        const [query, setSearch] = useState('');
        
        
        
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
        
        const fetchParkings = async() => {
            
            try{
                const resp = await getParkingAreas();
                console.log(`Parkings data`, resp);
                if(resp.statusCode == 200){
                    const parkings = resp.data;
                    if(parkings.length > 0) {
                        setFilteredParkingAreas(parkings);
                        setParkingAreas(parkings);
                    }
                }else{
                    Toast.show(resp.message, Toast.LONG);
                }
            }catch(err){
                Toast.show(err.message, Toast.LONG);
                
            }
        }
        
        useEffect(() => {
            fetchParkings();
        }, []);
        
        
        const CardComponent = (item) => (
            <TouchableOpacity 
            style={{ top: 20 }}
            onPress={() => goToParkingInfoScreen(item)}>
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
            <Title style={{ color: design.colors.dark }}>{item.name}</Title>
            
            <Paragraph style={{fontSize:16, color: design.colors.dark  }}>
            <FontAwesome name="map-marker" size={18} color={design.colors.warning}/>
            {item.address}, {item.distance} km away )
            </Paragraph>
            </View>
            
            <View style={{flexDirection:'row', justifyContent:'space-between'}}>
            
            <View style={{justifyContent:'flex-start'}}>
            
                <Text style={{color:design.colors.dark, fontSize:14, left:5}}> Available: {item.free}</Text>
           
            
            {item.is_open &&  <Text style={{fontSize:14, textTransform: 'uppercase', fontWeight: 'bold', opacity: 0.6, color: design.colors.green, left:10 }}>Open</Text>}
            {!item.is_open &&  <Text style={{fontSize:14, textTransform: 'uppercase', fontWeight: 'bold',  opacity: 0.6, color: design.colors.red, left:10}}>Closed</Text>}
            
            </View>
            
            </View>
            
            <Pressable onPress={() => goToParkingInfoScreen(item)} style={{backgroundColor:design.colors.primary,
                justifyContent:'center', alignItems:'center', padding:5, margin:5, width:80, borderRadius:5}}>
                <Text style={{color:design.colors.white}}>Fees</Text> 
                </Pressable>
                </View>
                
                </View>
                
                
                </TouchableOpacity>
                );
                
                
                const goToParkingInfoScreen = (item) => { 
                    props.navigation.navigate("ParkingInfo", {
                        screen: 'ParkingInfo',
                        params: {
                            
                            item: item
                            
                            //   parking_area_id: item.id, 
                            //   parking_area: item.name,
                            //   address: item.address,
                            //   phone_number: item.phone_number,
                            //   photo: item.photo,
                            
                        }
                    });
                }
                
                const onRefresh = useCallback(async () => {
                    setIsLoading(true);
                    setSearch('');
                    const timer = setTimeout(async() => {
                        await fetchParkings();
                        setIsLoading(false);
                    }, 1000);
                    return () => clearTimeout(timer);
                }, [isLoading]);
                
                
                return (
                    
                    <>
                    {  isLoading ?  <AppLoader /> : null }
                    
                    <SafeAreaView
                    style={styles.scrollView}
                    >
                    
                    
                    <FocusAwareStatusBar barStyle="dark-content" 
                    backgroundColor={colors.primary} />
                    
                    <View style={{flexDirection:'row', justifyContent: 'center', alignItems: 'center', marginTop:10}}>
                    
                    <TouchableOpacity onPress={()=>props.navigation.goBack()} style={{paddingRight:10}}>
                    <FontAwesome name="arrow-left" size={25} color={design.colors.gray}/>
                    </TouchableOpacity>
                    
                    <Searchbar
                    placeholder="Search for parking..."
                    onChangeText={(text) => handleSearch(text)}
                    value={query}
                    onIconPress={onClickSearchBtn}
                    placeholderTextColor={"#fff"}
                    inputStyle={{color: '#fff'}}
                    style={{ width: '85%', 
                    backgroundColor:  paperTheme.dark ? design.colors.gray : design.colors.gray,
                }}
                />
                <TouchableOpacity onPress={()=>onRefresh()} style={{paddingLeft:10}}>
                <FontAwesome name="refresh" size={25} color={colors.primary}/>
                </TouchableOpacity>
                </View>
                
                
                { !isLoading &&
                    
                    <View style={[styles.scene, { backgroundColor: '#fff' }]}>
                    <FlatList
                    showsVerticalScrollIndicator={false}
                    showsHorizontalScrollIndicator={false}
                    data={filteredParkingAreas}
                    renderItem={({item}) => CardComponent(item)}
                    keyExtractor={(item, index) => index.toString()}
                    ListFooterComponent={<View style={{height: 20}}/>}
                    refreshControl={
                        <RefreshControl
                        refreshing={isLoading}
                        onRefresh={onRefresh}
                        />
                    }
                    />
                    </View>
                    
                }
                
                </SafeAreaView>
                
                
                </>
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
                },
                container: {
                    // marginTop: StatusBar.currentHeight,
                },
                scene: {
                    flex: 1,
                },
                
            });