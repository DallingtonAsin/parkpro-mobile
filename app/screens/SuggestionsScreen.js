import React, {useState, useContext, useRef} from 'react';
import { Text,Image,
  TouchableOpacity,
  View, 
  FlatList,
  SafeAreaView,
  StyleSheet,
  ScrollView,
  Alert } from 'react-native';
  import styles from '../../assets/css/styles';
  import ProfileContext from '../context/index';
  import { AuthContext } from '../context/context';
  import Toast from 'react-native-simple-toast';
  import { UIActivityIndicator } from 'react-native-indicators';
  import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
  import { TextInput } from 'react-native-paper';
  import FocusAwareStatusBar  from '../components/common/FocusAwareStatusBar';
  import { useTheme  } from 'react-native-paper';


  const emojis = [
    {id:1, name: 'grin-beam', value: 'Happy', color: '#F9FEE', active: false},
    {id:2, name: 'frown-open', value: 'Angry', color: '#F9F6EE', active: false},
    {id:3, name: 'dizzy', value: 'Dizzy', color: '#F9FEE', active: false},
  ]
  
  const SuggestionsScreen = () => {
    const {profile, setProfile} = useContext(ProfileContext);

    const initialState = {
      email: profile.email,
      subject: '',
      description: '',
    }

    const [state, setState] = React.useState(initialState);
    const {postSuggestion} = React.useContext(AuthContext);
    const [isLoading, setIsLoading] = React.useState(false);
    const [selectedIndex, setSelectedIndex] = React.useState(1);
    const [selectedEmojiValue, setSelectedEmojiValue] = React.useState('Happy');
    const { colors } = useTheme();

    
    const sendSuggestion = async() => {
      console.log("Emoji reaction "+selectedEmojiValue);
      const id = profile.id;
      const email = state.email;
      const subject = state.subject;
      const description = state.description;
      if(id && email && subject && description){
        const data = {
          id: id,
          reaction:selectedEmojiValue,
          email: email,
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
      
      <SafeAreaView style={css.container}>
      
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
      
      
      <ScrollView contentContainerStyle={css.body}>
      
      <Text style={{fontWeight: 'bold', fontSize:20, }}>Give us feedback</Text>
      
      <View style={{top:20}}>
      <TextInput mode="outlined" label="Email" placeholder="Email (required)" value={state.email}
      onChangeText={(text) => {setState({...state, email: text}) }}
      style={css.input}
      />
      
      <TextInput mode="outlined" label="Subject" placeholder="Enter your subject"
      value={state.subject} style={css.input}
      onChangeText={(text) => {setState({...state, subject: text}) }}
      />
      
      <Text style={css.title}>Description</Text>
      <TextInput
      style={css.textArea}
      underlineColorAndroid="transparent"
      placeholder="Write your feedback here"
      placeholderTextColor="grey"
      numberOfLines={3}
      multiline={true}
      value={state.description}
      mode="outlined"
      onChangeText={(text) => {setState({...state, description: text}) }}
      />
      
      </View>
      
      
      
      </ScrollView>
      
      <View style={css.footer}>
      <TouchableOpacity
      style = {styles.btnPrimary}
      onPress={sendSuggestion} >
      <Text style = {css.btnText}>
      {isLoading ? <UIActivityIndicator color='white' /> : 'Send' }
      </Text>
      </TouchableOpacity>
      </View>
      
      
      
      </SafeAreaView>
      
      );
    }
    
    export default SuggestionsScreen
    
    const css = StyleSheet.create({
      container:{
        flex:1,
        backgroundColor: styles.colors.primary,
      },
      
      top:{
        flex:3,
        backgroundColor: styles.colors.primary,
        justifyContent: 'center', 
        alignItems: 'center',
       
      },
      
      body:{
        flexGrow:3,
        borderTopLeftRadius: 40,
        borderTopRightRadius: 40,
        padding:30,
        backgroundColor: styles.colors.white,
      },
      
      
      footer:{
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'center',
        justifyContent: 'center',
        // position: 'absolute',
        // zIndex:100,
        // bottom: 0,
      },
      
      submit: {
        color: '#fff',
        borderRadius:5,
        padding:15,
        backgroundColor: styles.colors.primary,
        borderColor: styles.colors.primary,
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
        color: styles.colors.white,
        fontSize:15, 
        fontWeight: 'bold',
      },
      
      textArea: {
        backgroundColor: '#fff',
        borderRadius: 20,
        
      },
      
      title: {
        fontSize:15,
        fontWeight: 'bold',
        opacity:0.7,
      },
      
      input:{
        backgroundColor: '#fff',
        borderRadius:20,
      },
      
      
      
    });