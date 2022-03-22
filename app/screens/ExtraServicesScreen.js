import React, {useState, useEffect} from 'react';
import {SafeAreaView, Platform, StyleSheet, ScrollView, Text, View, Pressable, TextInput, TouchableOpacity, FlatList} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import SearchableDropdown from 'react-native-searchable-dropdown';
import {TimePicker} from 'react-native-simple-time-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import design from '../../assets/css/styles';
import { Avatar, Button, Card, Title, Paragraph, Searchbar  } from 'react-native-paper';
import FocusAwareStatusBar  from '../components/common/FocusAwareStatusBar';

const parkingAreas = [
    {id: 1, name: 'Nkrumah', image: 'https://picsum.photos/0', address: 'Makerere'},
    {id: 3, name: 'Nakulabye', image: 'https://picsum.photos/1003', address: 'Kawempe'},
    {id: 2, name: 'Wandegeya Police', image: 'https://picsum.photos/1011', address: 'Wandegeya'},
    {id: 4, name: 'Kann Hostel', image: 'https://picsum.photos/1018', address: 'Kikoni'},
    {id: 5, name: 'HK Hardware', image: 'https://picsum.photos/1025', address: 'Nansana'},
    {id: 6, name: 'Ntinda Complex', image: 'https://picsum.photos/205', address: 'Ntinda'},
    {id: 7, name: 'Kireka Wspaces', image: 'https://picsum.photos/304', address: 'Kireka'},
    {id: 8, name: 'Kyambogo', image: 'https://picsum.photos/409', address: 'Banda'},
    {id: 9, name: 'Entebbe HKT', image: 'https://picsum.photos/700', address: 'Entebbe'},
    {id: 10, name: 'Kireti', image: 'https://picsum.photos/803', address: 'Kololo'},
];

const ParkingAreasScreen = (props) => {
    const [serverData, setServerData] = useState([]);
    
    const LeftContent = props => <Avatar.Icon {...props} icon="folder" />
    
    const [searchQuery, setSearchQuery] = React.useState('');
    const onChangeSearch = query => setSearchQuery(query);

    const GotoFeesPage = () => {
       props.navigation.navigate("ParkingFees");
    }
    
    const CardComponent = (props) => (
        <Pressable onPress={GotoFeesPage}>
        <Card>
        <Card.Content>
        {/* <Title>{props.item.name}</Title> */}
        <Paragraph>{props.item.address}</Paragraph>
        </Card.Content>
        <Card.Cover source={{ uri: props.item.image }} />
        </Card>
        </Pressable>
        );
        
        useEffect(() => {
            // fetch('https://aboutreact.herokuapp.com/demosearchables.php')
            //   .then((response) => response.json())
            //   .then((responseJson) => {
            //     // setServerData(responseJson.results);
            //   })
            //   .catch((error) => {
            //     console.error(error);
            //   });
        }, []);
        
        return (
            <View style={styles.container}>
            <View style={styles.semicontainer}>
            
            <Searchbar
            placeholder="Type parking for services..."
            onChangeText={onChangeSearch}
            value={searchQuery}
            />
            <Text style={{fontSize:14, color:'#659EC7', padding:5}}>Type parking area to see other services offered</Text>


            <FlatList
            data={parkingAreas}
            renderItem={({item}) => <CardComponent item={item} />}
            />
            </View>
            </View>
            );
        };
        
        export default ParkingAreasScreen;
        
        const styles = StyleSheet.create({
            container: {
                flex: 1,
                backgroundColor: '#fff',
                padding: 10,
                
            },
            semicontainer:{
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