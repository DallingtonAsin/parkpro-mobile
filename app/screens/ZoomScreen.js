import React, {useRef, useState, useEffect} from 'react';
import {
  PermissionsAndroid,
  Platform,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  StyleSheet,
} from 'react-native';
import {
  ClientRoleType,
  createAgoraRtcEngine,
  IRtcEngine,
  RtcSurfaceView,
  ChannelProfileType,
} from 'react-native-agora';
import AppLoader from '../components/loaders/AppLoader';
import FocusAwareStatusBar from '../components/common/FocusAwareStatusBar';
import {useTheme} from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome5';
import AgoraUIKit from 'agora-rn-uikit';
import {AGORA_APP_ID, AGORA_CHANNEL_NAME, AGORA_TEMP_TOKEN} from '@env';

const appId = AGORA_APP_ID;
const channelName = AGORA_CHANNEL_NAME;
const token = AGORA_TEMP_TOKEN;
const uid = 0;

const ZoomScreen = () => {
  const agoraEngineRef = useRef(null); // Agora engine instance
  const [isJoined, setIsJoined] = useState(false); // Indicates if the local user has joined the channel
  const [remoteUid, setRemoteUid] = useState(0); // Uid of the remote user
  const [message, setMessage] = useState(''); // Message to the user
  const [isLoading, setIsLoading] = useState(false);
  const [videoCall, setVideoCall] = useState(false);
  const isDefaultApp = false;

  const {colors} = useTheme();
  const styles = makeStyles(colors);

  const connectionData = {
    appId: appId,
    channel: channelName,
    token: token,
  };
  
  const rtcCallbacks = {
    EndCall: () => setVideoCall(false),
  };

  const showMessage = msg => {
    setMessage(msg);
  };

  useEffect(() => {
    setupVideoSDKEngine();
  });

  const setupVideoSDKEngine = async () => {
    try {
      if (Platform.OS === 'android') {
        await getPermission();
      }
      agoraEngineRef.current = createAgoraRtcEngine();
      const agoraEngine = agoraEngineRef.current;
      agoraEngine.registerEventHandler({
        onJoinChannelSuccess: () => {
          showMessage('Successfully joined the channel ' + channelName);
          setIsJoined(true);
        },
        onUserJoined: (_connection, Uid) => {
          showMessage('Remote user joined with uid ' + Uid);
          setRemoteUid(Uid);
        },
        onUserOffline: (_connection, Uid) => {
          showMessage('Remote user left the channel. uid: ' + Uid);
          setRemoteUid(0);
        },
      });
      agoraEngine.initialize({
        appId: appId,
      });
      agoraEngine.enableVideo();
    } catch (e) {
      console.log(e);
    }
  };

  const join = async () => {
    if (isJoined) {
      return;
    }
    try {
      setIsLoading(true);
      agoraEngineRef.current?.setChannelProfile(
        ChannelProfileType.ChannelProfileCommunication,
      );
      agoraEngineRef.current?.startPreview();
      agoraEngineRef.current?.joinChannel(token, channelName, uid, {
        clientRoleType: ClientRoleType.ClientRoleBroadcaster,
      });
      setIsLoading(false);
    } catch (e) {
      console.log(e);
    }
  };

  const leave = async () => {
    try {
      setIsLoading(true);
      agoraEngineRef.current?.leaveChannel();
      setRemoteUid(0);
      setIsJoined(false);
      showMessage('You left the channel');
      setIsLoading(false);
    } catch (e) {
      console.log(e);
    }
  };

  const getPermission = async () => {
    if (Platform.OS === 'android') {
      await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
        PermissionsAndroid.PERMISSIONS.CAMERA,
      ]);
    }
  };

  if (isDefaultApp) {
    return (
      <>
        {/* <SafeAreaView style={styles.main}>
          <FocusAwareStatusBar
            barStyle="light-content"
            backgroundColor={colors.primary}
          />
          <Text style={styles.head}>Video Call</Text>
          <View style={styles.btnContainer}>
            <TouchableOpacity
              onPress={join}
              style={[styles.button, styles.joinBtn]}>
              <Text style={{color: '#ffffff'}}>Join</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={leave}
              style={[styles.button, styles.leaveBtn]}>
              <Text style={{color: '#ffffff'}}>Leave</Text>
            </TouchableOpacity>

            <Text style={{color: '#fff'}} onPress={() => setVideoCall(true)}>
              Start Call
            </Text>
          </View>
          <ScrollView
            style={styles.scroll}
            contentContainerStyle={styles.scrollContainer}>
            {isJoined ? (
              <React.Fragment key={0}>
                <RtcSurfaceView canvas={{uid: 0}} style={styles.videoView} />
                <Text>Local user uid: {uid}</Text>
              </React.Fragment>
            ) : (
              <Text>Join a channel</Text>
            )}
            {isJoined && remoteUid !== 0 ? (
              <React.Fragment key={remoteUid}>
                <RtcSurfaceView
                  canvas={{uid: remoteUid}}
                  style={styles.videoView}
                />
                <Text>Remote user uid: {remoteUid}</Text>
              </React.Fragment>
            ) : (
              <Text>Waiting for a remote user to join</Text>
            )}
            <Text style={styles.info}>{message}</Text>
          </ScrollView>
        </SafeAreaView>
        {isLoading ? <AppLoader /> : null} */}
      </>
    );
  } else {
    return videoCall ? (
      <AgoraUIKit connectionData={connectionData} rtcCallbacks={rtcCallbacks} />
    ) : (
      <SafeAreaView style={styles.main}>
        <FocusAwareStatusBar
          barStyle="light-content"
          backgroundColor={colors.primary}
        />

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContainer}>
       
          <TouchableOpacity
            style={styles.startCallBtn}
            onPress={() => setVideoCall(true)}>
            <Icon
              name="video"
              style={{
                fontSize: 50,
                color: '#fff',
              }}
            />
            <Text style={{color: '#fff'}}>New Meeting</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    );
  }
};

export default ZoomScreen;

const makeStyles = colors =>
  StyleSheet.create({
    button: {
      paddingHorizontal: 25,
      paddingVertical: 4,
      fontWeight: 'bold',
      margin: 5,
    },

    joinBtn: {
      color: '#ffffff',
      backgroundColor: '#0055cc',
    },

    leaveBtn: {
      color: '#ffffff',
      backgroundColor: 'red',
    },

    main: {flex: 1, alignItems: 'center'},
    scroll: {
      flex: 1,
      backgroundColor: '#ddeeff',
      width: '100%',
    },
    scrollContainer: {
      flex: 1,
      backgroundColor: '#ddeeff',
      width: '100%',
      alignItems: 'center',
      justifyContent: 'center',
    },

    videoView: {top: 30, width: '90%', height: 400},
    btnContainer: {flexDirection: 'row', justifyContent: 'center'},
    head: {
      fontSize: 20,
      color: '#ffffff',
      padding: 20,
    },
    info: {backgroundColor: '#ffffe0', color: '#0000ff'},

    styleProps: {
      localBtnContainer: {
        backgroundColor: '#fff',
        bottom: 0,
        paddingVertical: 10,
        borderWidth: 4,
        borderColor: '#2edb85',
        height: 80,
      },
    },

    startCallBtn: {
      backgroundColor: '#FFA500',
      padding: 15,
      borderRadius: 10,
      alignItems: 'center',
      justifyContent: 'center',
    },
  });
