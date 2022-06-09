import {  Platform, StatusBar } from 'react-native';

export default {
  
  colors:{
    primary: "#273746",
    secondary: "#4ecdc4",
    white: '#ffffff',
    success: '#009387', //'#2F4F4F', // '#138D75',
    warning: 'orange',
    dark:'#000',
    black:'#000',
    yew:'#FFFF20',
    orange:  '#FFA500', //'#CC7722',  //'#E97451', // '#d59723ff', //
    darktheme:'#2F4F4F',
    prime1: '#009387',
    red:'#FF0000',
    green:'#008000',
    parksmart:'#273746',
    silver: "#FAF9F6",
    coffee: '#A54300',
    gray: '#778899',

    defaultBtnLinearGradient1: '#273746',
    defaultBtnLinearGradient2: '#01ab9d',

    darkPink: '#FF6347',
    darkPink1: '#FFA07A',
    darkPink2: '#FF6347'
  },
  
  bottom: {
    flex: 1,
    justifyContent: 'flex-end',
    marginBottom: 36
  },

  drawerItem:{
    flexDirection: 'row',
    left: 0,
    paddingTop: 12,
    paddingBottom: 12,
    fontSize:45
  },
  
  drawerContent: {
    flex: 1,
  },

  drawerText:{
    fontSize: 17,
  },

  drawerIcon:{
    fontSize:23,
    marginLeft:20,
    marginRight:20,
    // color:'#000',
  },

  userInfoSection: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop:15
  },

  preference: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingHorizontal: 0,
  },
  
  
  container: {
    // flex: 1,
    fontFamily: 'sans-serif',
    flexDirection: 'column',
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'space-between',
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    
  },
  
  imageBackground:{
    flex:1,
    resizeMode:'cover',
    justifyContent:'center',
    alignItems:'center'
  },
  
  
  SectionStyle: {
    flexDirection: 'row',
    marginTop: 7,
    alignItems:'center',
    justifyContent:'center',
  },
  
  input:{
    height: 40,
    width: 270,
    fontSize:15,
    borderWidth:1,
    borderTopRightRadius:20,
    borderBottomRightRadius:20,
    borderColor:'#e5e4e2',
    paddingHorizontal:10,
  },
  
  input1:{
    height: 50,
    width: 270,
    fontSize:15,
    borderWidth:1,
    borderColor:'#e5e4e2',
    paddingHorizontal:10,
  },
  
  btnSignup: {
    backgroundColor: '#FFA500', //"#fc5c65",
  },
  
  btnLogin: {
    backgroundColor: '#2F4F4F', //"#138D75", // "#fc5c65",
  },
  
  btn:{
    
    marginTop: 8,
    color: '#ffffff',
    fontWeight: 'bold',
    alignItems: 'center',
    justifyContent: 'center',
    textTransform: 'uppercase',
    borderRadius: 60,
    fontFamily:'Roboto',
    height: 50,
    width: 350,
    
  },
  
  bg_default:{
    height: 40,
    backgroundColor:'#e2e2e2',
    borderTopLeftRadius:20,
    borderBottomLeftRadius:20,
  },
  
  
  btnText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontFamily:'Roboto',
  },
  
  title: {
    fontSize: 30,
    fontWeight: '600',
    color: "#203838",
    fontFamily: 'Roboto',
    marginTop:15,
    
  },
  
  welcomeText: {
    fontSize:16,
    fontWeight: '600',
    color: "#203838",
    fontFamily: 'Roboto',
    margin:5,
    
  },
  
  touchOpacity:{
    justifyContent:'space-between',
    flexDirection:'row',
    flex:2,
    padding:12,
    // backgroundColor:'orange',
  },
  
  touchView:{
    flex:4,
    borderRadius:10,
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'space-between',
    backgroundColor:'#fff', //'#EEEEFF',
    color:'#000',
    
  },
  
  touchText:{
    textAlign:'center',
    fontSize:14,
  },
  
  styleText: {
    color:'#000',
    fontWeight:'600',
    fontSize:14,
    marginTop:5,
    
  },
  
  helpContainer:{
    flexDirection: 'row',
    padding:10,
    elevation:10,
  },
  
  helpOpacity:{
    backgroundColor:'#fff',
    marginTop:10,
    justifyContent:'center',
    // marginRight:15,
    // marginLeft:15,
    borderRadius:5,
    borderWidth:0.3,
  },
  
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 63,
    borderWidth: 4,
    borderColor: "white",
    alignSelf:'center',
    position: 'absolute',
    marginTop:10,
    marginBottom:80,
  },
  
  helpIcon:{
    // color:'#FFA500',
    // fontSize:20,
    borderRadius:30,
    padding: 13,
    borderWidth:0.5,
    backgroundColor:'#fff',
    // borderColor:'#FFA500',
  },
  
  helpText:{
    fontSize:16,
    marginLeft:10,
    marginTop:12,
    color:'#000000',
  },
  
  registerSection:{
    marginTop:10,
    flexDirection:'row',
    alignItems:'center',
  },
  
  register: {
    color:'#0275d8',
  },
  
  IconStyle: {
    padding:10,
    left: 0,
  },
  
  logo: {
    width: 80,
    height: 60,
    marginTop:10,
  },
  
  imageIcon: {
    width: 100,
    height: 100,
    marginTop:10,
  },
  
  homeIcon: {
    width: 35,
    height: 35,
    marginTop:10,
  },
  
  emojiIcon: {
    width: 30,
    height: 30,
    marginLeft:8,
    marginBottom:30,
    top:25,
    
    
  },
  
  sideMenuContainer: {
    width: '100%',
    height: '100%',
    // backgroundColor: '#fff',
    alignItems: 'center',
    paddingTop: 5,
  },
  
  sideMenuHeader:{
    backgroundColor: '#138D75',
    color:'#fff',
    justifyContent: 'center',
  },
  
  sideMenuProfileIcon: {
    resizeMode: 'center',
    borderColor:'#f4f4f4',
    width: 200,
    height: 100,
    marginTop: 1,
    borderRadius: 150 / 2,
  },
  
  sideMenuItems:{
    flexDirection: 'row',
    left: 0,
    paddingTop: 12,
    paddingBottom: 12,
    fontSize:45
  },
  
  sideMenuText:{
    fontSize: 17,
  },

  divider:{
    width:'100%',
    height:1,
    marginTop:15,
    backgroundColor:'#e2e2e2',
  },
  
  divider1:{
    width:'90%',
    height:1,
    margin:17,
    backgroundColor:'#e2e2e2',
  },
  
  
  navOptionThumb:{
    fontSize:23,
    marginLeft:20,
    marginRight:20,
    color:'#000',
  },
  
  top:{
    marginBottom:50,
    marginLeft:90,
  },
  
  
  
  profile:{
    
    avatar:{
      width:100,
      height:100,
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 8,
      },
      shadowOpacity: 0.33,
      shadowRadius: 10.32,
    },
    
    view:{
      alignContent:'space-between',
      borderColor:'silver',
      borderWidth:1,
      padding:20,
      margin:10,
      right:20,
    },
    
    view2:{
      
      backgroundColor:'#273746',
      shadowColor: "#000",
      paddingBottom:8,
      borderTopLeftRadius: 10,
      borderTopRightRadius: 10,
      shadowOffset: {
        width: 0,
        height: 8,
      }
    },
    
    view3:{
      flex: 1,
      padding:20,
      borderBottomRightRadius:8,
      borderBottomLeftRadius:8,
      marginBottom:10,
      opacity:0.8,
      backgroundColor:'#fff',
      shadowColor: "#000",
      shadowOpacity: 0.33,
      shadowRadius: 10.32,
      elevation: 14,
      shadowOffset: {
        width: 0,
        height: 8,
      }
    },
    
    
    view1:{
      flex: 1,
      margin:12,
      borderRadius:8,
      opacity:0.8,
      backgroundColor:'#fff',
      shadowColor: "#000",
      shadowOpacity: 0.33,
      shadowRadius: 10.32,
      elevation: 14,
      shadowOffset: {
        width: 0,
        height: 8,
      }
    },
    
    view4:{
      padding:12,
      marginTop: 0,
      backgroundColor:'#fff',
      shadowColor: "#000",
      shadowOpacity: 0.33,
      shadowRadius: 10.32,
      elevation: 14,
      opacity:0.8,
      shadowOffset: {
        width: 0,
        height: 8,
      }
    },
    
  },
  
  guide:{
    
    MainContainer:{
      backgroundColor:'#fff',
      padding:8,
      margin:15,
      justifyContent:'center',
      borderRadius:8,
      borderWidth:0.3,
      borderColor:'gray',
      elevation:5,
      shadowOpacity: 0.44,
      shadowOffset:{
        height: 1,
        width: 1,
      },
    },
    
    SubContainer:{
      flexDirection: 'row',
      flex:1,
      padding:15,
    },
    
    icon:{
      width: 50,
      height: 50,
      borderRadius: 150/2,
    },
    
    text:{
      fontSize:16,
      marginLeft:10,
      marginTop:12,
      color:'#777672',
      opacity:0.8,
    },
    
    mediaText:{
      color:'#fff',
      alignSelf:'center',
      fontSize:12,
      textTransform:'lowercase',
    },
    
    mediaIcon:{
      fontSize:35,
      color:'#fff',
      alignSelf:'center',
    },
    
    
    
  },
  
  settings:{
    
    helpOpacity:{
      backgroundColor:'#fff',
      borderRadius:2,
      borderWidth:0.3,
      borderColor:'gray',
      elevation:5,
      shadowOpacity: 0.44,
      shadowOffset:{
        height: 1,
        width: 1,
      },
    },
  },
  
  password:{
    
    container: {
      flex: 1,
      fontFamily: 'sans-serif',
      flexDirection: 'column',
      backgroundColor: '#fff',
      margin:0,
      fontFamily:'Roboto',
      borderColor:'#000'
      
    },
    
    label: {
      width: 230,
      alignSelf: 'center',
      textAlign: 'center',
      fontSize: 20,
      fontWeight: '600',
      color: '#000',
      textTransform:'uppercase',
      opacity:0.5,
    }
  },
  
  business:{
    imageIcon: {
      width: 100,
      height: 100,
      marginTop:10,
    },
    touchOpacity:{
      justifyContent:'space-between',
      flexDirection:'row',
      flex:1,
      padding:8,
      backgroundColor:'#e2e2e2',
      opacity:1,
      //margin:10,
    },
  },
  
  map:{
    
    container: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      justifyContent: 'flex-end',
      alignItems: 'center',
    },
    
    map: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
    },
    
  },
  
  
  home:{
    
    touchOpacity:{
      justifyContent:'space-between',
      flexDirection:'row',
      flex:2,
      padding:35,
      backgroundColor:'orange',
      borderRadius:10, 
    },
    
    touchView:{
      flex:4,
      borderRadius:10,
      justifyContent: 'center',
      alignItems: 'center',
      alignContent: 'space-between',
      backgroundColor:'#fff', //'#EEEEFF',
      color:'#000',
      
    },
    
    mainView:
    {
      justifyContent:'space-between',
      flexDirection:'row',
      flex:2,
      padding:5,
      marginTop:0,
      marginLeft:15,
      marginRight:15,
      marginBottom:10,
      backgroundColor:'#fff',
    }
    
  },
  
  textAreaContainer: {
    borderColor: '#E2E2E2',
    borderWidth: 1,
    padding: 5
  },
  
  textArea: {
    height: 150,
    justifyContent: "flex-start"
  },
  
  
  theme : {
    dark: false,
    roundness: 4,
    colors: {
      primary: '#6200ee',
      accent: '#03dac4',
      background: '#f6f6f6',
      surface: 'white',
      error: '#B00020',
      text: 'black',
      onBackground: '#000000',
      onSurface: '#000000',
    },
    animation: {
      scale: 1.0,
    },
  },
  
  
  bottomSheet: {
    
    container: {
      flex:1,
      backgroundColor: 'white',
      padding: 16,
      alignItems: 'center',
    },
    
    bottomSheetHeader: {
      backgroundColor: '#FFFFFF',
      // shadowColor: '#333333',
      // borderTopLeftRadius: 20,
      // borderTopRightRadius: 20,
    },
    
    panelHeader: {
      alignItems: 'center',
    },
    
    panelHandle: {
      width: 45,
      height: 8,
      // borderRadius: 4,
      backgroundColor: '#00000040',
      marginBottom: 10,
    },
    bottomSheetButton:{
      flexDirection: 'row',
      borderWidth:1, 
      margin:45,
      marginBottom:60,
      padding:15,
      // borderRadius:50,
      borderColor: '#273746',
      justifyContent: 'center',
      backgroundColor: '#fff'
    },
  },
  
  // vehicle screen styling
  vehicle: {
    container: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    middleContainer: {
      marginHorizontal:20,
      marginLeft:20,
      justifyContent:'center',
      alignItems: 'center',
    },
    image: { 
      width: 50,
      height: 50,
      resizeMode: 'contain',
    },
    text: {
      fontWeight:'bold',
      fontSize:16,
      marginBottom:5,
    },
    name: {
      opacity:0.8,
      fontSize:16,
      
    },
    ellipsis : {
      marginTop:15,
      color:'#000',
    },
    rightContainer:{
      width:100,
      justifyContent:'flex-end',
      flexDirection:'row',
      
    },
    textAdd: {
      color: '#000',
      marginLeft:10,
      textTransform:'uppercase'
    },
    icon:{
      marginLeft:10,
    }
  },
  
  autocomplete: {
    container: {
      backgroundColor: '#F5FCFF',
      flex: 1,
      padding: 16,
      marginTop: 40,
    },
    autocompleteContainer: {
      backgroundColor: '#ffffff',
      borderWidth: 0,
    },
    descriptionContainer: {
      flex: 1,
      justifyContent: 'center',
    },
    itemText: {
      fontSize: 15,
      paddingTop: 5,
      paddingBottom: 5,
      margin: 2,
    },
    infoText: {
      textAlign: 'center',
      fontSize: 16,
    },
  },
  
  flutterButton: {
    color: '#fff',
    margin: 5,
    borderRadius:35,
    backgroundColor: '#273746',
    borderColor: '#273746'
  },
  
  btnPrimary: {
  
    borderRadius:30,
    padding:15,
    position: 'absolute',
    bottom: 0,
    width: '90%',
    justifyContent: 'center',
    alignItems: 'center',
    fontWeight: 'bold',
    marginBottom: 30,
  },
  
  btnSecondary: {
    padding:15,
    backgroundColor: '#fff',
    borderColor: '#273746',
    position: 'absolute',
    bottom: 0,
    width: '90%',
    justifyContent: 'center',
    alignItems: 'center',
    fontWeight: 'bold',
    marginBottom: 30,
    borderRadius:30,
    borderWidth:1,
  },
  
  
  
  
  
  
  
  
  
  
  
}