import React, {useCallback, useState, useEffect} from 'react';
import { Text,Image, Button, Linking, View, FlatList, ScrollView, TouchableOpacity, StyleSheet} from 'react-native';
import design from '../../assets/css/styles';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {Card, Title} from 'react-native-paper';
import { AboutCardItem } from '../components/CardItem';
import { SIZES } from '../../constants';
import {APP_NAME} from '@env';
import FocusAwareStatusBar  from '../components/common/FocusAwareStatusBar';
import { useTheme } from '@react-navigation/native';


const AboutScreen = (props) => {
    
    const { colors } = useTheme();
    const styles = makeStyles(colors);
    
    return(
        
        <View style={{padding: 10, flex: 1, backgroundColor:'#e2e2e3'}}>
        <FocusAwareStatusBar barStyle="light-content" backgroundColor={colors.primary} />
        <ScrollView contentContainerStyle={{ height:'auto', paddingBottom: 60 }} style={{flex: 1}}>
        
        
        <Card style={styles.card}>
        <Card.Content>
        <Title style={{ color: colors.dark }}>Services</Title>
        <Text style={{  opacity:0.6, fontSize:18, color: colors.dark }}>
        {APP_NAME} provides easy access to better and affordable parking areas without a hustle. Just recharge your account 
        and get affordable parking in less than a minute!
        
        </Text>  
        </Card.Content>
        </Card>
        
        <Card style={styles.card}>
        <Card.Content>
        <Title style={{ color: colors.dark }}>Usage</Title>
        <Text style={{  opacity:0.6, fontSize:18, color: colors.dark }}>
        To get started, search for a parking area and pick one that you prefer (depending on distance, price or spaciousness).
        Ensure your <Text style={{textTransform:'lowercase'}}>{APP_NAME}</Text> wallet has enough money to pay for parking. Else, you can recharge your account
        using the "Top Up" option in the app.</Text>  
        </Card.Content>
        </Card>
        
        
        <Card style={styles.card}>
        <Card.Content>
        <View style={{ flex: 1, justifyContent: 'center' }}>
        <Title style={{ color: colors.dark }}>Online & Social Media</Title>
        
        <View style={{ 
         flexDirection: 'row',
         justifyContent: 'space-between',
         marginTop: SIZES.padding,
         width: '100%' 
          }}>
        
        
        <AboutCardItem
            icon={"globe"}
            label="Website"
            color={'#43609C'}
            onPress={() => Linking.openURL("http://www.parkproug.com")}
        />
        
        <AboutCardItem
            icon={"facebook"}
            bgColor={['#fff', '#fff']}
            label="Facebook"
            color={'#43609C'}
            onPress={() =>  Linking.openURL("http://www.facebook.com") }
        />
        
    <AboutCardItem
        icon={"twitter"}
        label="Twitter"
        color={'#1DA1F2'}
        onPress={() =>  Linking.openURL("https://www.twitter.com") }
    />
    
    
    <AboutCardItem
        icon={"linkedin"}
        label="Linkedin"
        color={'#0e76a8'}
        onPress={() =>  Linking.openURL("http://www.linkedin.com") }
    />
    
    </View>
    
    </View>
    </Card.Content>
    </Card>
    
    </ScrollView>
    </View>
    
    );
    
    
}


export default AboutScreen

const makeStyles = (colors) => StyleSheet.create({
    card: {
        margin:4,
        padding:8,
        borderRadius: 5,
        backgroundColor: design.colors.white,
    },

    mediaGroup:{
        flex:1,
        borderRadius:10,
        justifyContent: 'center',
        margin:10,
        
    }
});