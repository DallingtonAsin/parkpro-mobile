import React, { useContext } from 'react';
import {Text, TouchableOpacity, View, FlatList, SafeAreaView, StyleSheet, ScrollView, Alert } from 'react-native';
import styles from '../../assets/css/styles';
import ProfileContext from '../context/index';
import { AuthContext } from '../context/context';
import Toast from 'react-native-simple-toast';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { TextInput } from 'react-native-paper';
import FocusAwareStatusBar  from '../components/common/FocusAwareStatusBar';
import { useTheme  } from 'react-native-paper';
import { isValidateEmail } from '../components/SharedCommons';
import AppLoader from '../components/loaders/AppLoader';


const emojis = [
  {id:1, name: 'grin-beam', value: 'Happy', color: '#F9FEE', active: false},
  {id:2, name: 'frown-open', value: 'Angry', color: '#F9F6EE', active: false},
  {id:3, name: 'dizzy', value: 'Dizzy', color: '#F9FEE', active: false},
]

const initialState = {
  email: '',
  subject: '',
  description: '',
}

const FeedbackScreen = () => {
  
  const { profile } = useContext(ProfileContext);
  
  const [state, setState] = React.useState(initialState);
  const {postSuggestion} = React.useContext(AuthContext);
  const [isLoading, setIsLoading] = React.useState(false);
  const [selectedIndex, setSelectedIndex] = React.useState(1);
  const [selectedEmojiValue, setSelectedEmojiValue] = React.useState('Happy');
  
  const { colors } = useTheme();
  const css = makeStyles(colors);
  
  
  const sendSuggestion = async() => {
    
    const id = profile.id;
    const email = state.email;
    const subject = state.subject;
    const description = state.description;
    
    if(!id){
      alert("Unable to capture your profile");
      return;
    }
    
    if(!description){
      alert("Please write your feedback");
      return;
    }
    
    
    if(email){
      if(!isValidateEmail(email)){
        alert("Please enter valid email");
        return;
      }
    }
    
    
    if(id && description){
      
      const data = {
        id: id,
        reaction: selectedEmojiValue,
        email: email ? email : profile.email,
        subject: subject,
        description: description,
      }
      
      setIsLoading(true);
      let result = await postSuggestion(data);
      const statusCode = result.statusCode;
      const message = result.message;
      
      if(statusCode == 1){
        setState({...initialState});
        Toast.show(message);
      }else{
        Alert.alert("Message", message);
      }
    }else{
      Alert.alert("Message", "Please enter all information");
    }
    setIsLoading(false);
    
  }
  
  const changeEmojiState = (item) =>{
    setSelectedIndex(item.id);
    setSelectedEmojiValue(item.value);
  }
  
  const emojiComponent = (item) => {
    return <TouchableOpacity  onPress={() =>  changeEmojiState(item)}>
    <FontAwesome5 name={item.name} size={35} color={item.id == selectedIndex ? '#FDDA0D' : '#FFF' }  style={{padding:10}} />
    <Text style={{color:'#fff', textAlign:'center'}}>{item.value}</Text>
    </TouchableOpacity>
  }
  
  
  return(
    
    <>
    
    <View style={css.container}>
    
    <FocusAwareStatusBar barStyle="light-content" backgroundColor={colors.primary} />
    
    <View style={css.top}>
    <Text style={{color: '#fff', fontSize:22, fontWeight:'bold',  marginTop:15}}>How do you feel?</Text>
        <FlatList
        horizontal={true}
        data={emojis}
        renderItem={({item}) => emojiComponent(item) }
        keyExtractor={(item, index) => index }
        contentContainerStyle={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center', padding:10}}
        />
    </View>
    
    <View style={css.body}>
    <Text style={{fontWeight: 'bold', fontSize:20, }}>Share with us feedback</Text>
    
    <TextInput
    mode="outlined"
    outlineColor={styles.colors.gray}
    placeholderTextColor={"grey"}
    theme={{ colors: { text: styles.colors.dark } }}
    style={css.input}
    placeholder="Email" 
    underlineColorAndroid="transparent"
    value={state.email}
    onChangeText={(text) => {setState({...state, email: text}) }}
    />
    
    <TextInput 
    mode="outlined"
    placeholder="Subject"
    value={state.subject} 
    style={css.input}
    outlineColor={styles.colors.gray}
    placeholderTextColor={"grey"}
    underlineColorAndroid="transparent"
    theme={{ colors: { text: styles.colors.dark } }}
    onChangeText={(text) => {setState({...state, subject: text}) }}
    />
    
    <TextInput
    mode="outlined"
    style={css.textArea}
    underlineColorAndroid="transparent"
    placeholder="Write your feedback here"
    placeholderTextColor={"grey"}
    outlineColor={styles.colors.gray}
    theme={{ colors: { text: styles.colors.dark } }}
    numberOfLines={6}
    multiline={true}
    value={state.description}
    onChangeText={(text) => {setState({...state, description: text}) }}
    />
    
    </View>

    <View style={css.footer}>
    <TouchableOpacity
    style={[styles.btnPrimary, { 
      backgroundColor: colors.primary,
      borderColor: colors.primary
    }]}
    onPress={sendSuggestion} >
    <Text style = {{ color: colors.text, fontWeight: 'bold', fontSize:18 }}>
    {isLoading ? 'Sending...': 'Send' }
    </Text>
    </TouchableOpacity>
    </View>
    
    </View>
    
    {  isLoading ?  <AppLoader /> : null }
    
    </>
    
    );
  }
  
  export default FeedbackScreen
  
  const makeStyles =  (colors) => StyleSheet.create({
    container:{
      flex:1
    },
    
    top:{
      flex:2,
      justifyContent: 'center', 
      alignItems: 'center',
      
    },
    
    body:{
      flex: 4, 
      backgroundColor: colors.secondary,
      borderTopLeftRadius: 40,
      borderTopRightRadius: 40,
      padding:30,
    },
    
    
    footer:{
      flexDirection: 'row',
      alignItems: 'center',
      alignSelf: 'center',
      justifyContent: 'center'
    },
    
    submit: {
      color: '#fff',
      borderRadius:5,
      padding:15,
      backgroundColor: colors.primary,
      borderColor: colors.primary,
      position: 'absolute',
      bottom: 0,
      width: '90%',
      justifyContent: 'center',
      alignItems: 'center',
      fontWeight: 'bold',
      marginBottom: 30,
    },
    
    btnText: {
      textTransform: 'uppercase',
      color: colors.white,
      fontSize:15, 
      fontWeight: 'bold',
    },
    
    textArea: {
      backgroundColor: styles.colors.white,
      borderRadius: 20
    },
    
    input:{
      backgroundColor: styles.colors.white,
      borderRadius:20,
      color: '#000',
    },
    
    title: {
      fontSize:15,
      fontWeight: 'bold',
      opacity:0.7,
    },
    
    
    
    
    
  });