import React from 'react';
import { 
    ScrollView,
    SafeAreaView,
    Text, 
    StyleSheet,
    RefreshControl,
} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FocusAwareStatusBar  from '../components/common/FocusAwareStatusBar';


const wait = (timeout) => {
    return new Promise(resolve => setTimeout(resolve, timeout));
}

const OfflineScreen = (props) => {
    const [refreshing, setRefreshing] = React.useState(false);

    const onRefresh = React.useCallback(() => {
     setRefreshing(true);
     wait(2000).then(() => setRefreshing(false));
    }, []);
    
    return (
        <SafeAreaView style={styles.container}>
             <FocusAwareStatusBar barStyle="dark-content" backgroundColor={design.colors.white} />
        <ScrollView contentContainerStyle={styles.scrollView}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh}/>}
        >
        <Text style={[styles.title, {
            color: '#fd5e53',
        }]}>Check your internet connection and try again!</Text>
        <FontAwesome 
        name={"refresh"}
        color={'#fff'}
        size={50}
        style={styles.refresh}
        onPress={onRefresh}
        />
        </ScrollView>
        </SafeAreaView>
        );
    };
    
    export default OfflineScreen;
    const styles = StyleSheet.create({
        container: {
            flex: 1, 
        },
        scrollView: {
            flex: 1, 
            backgroundColor: '#fff',
            alignItems: 'center',
            justifyContent: 'center',
        },
    
        refresh: {
            padding:15,
        },
        title: {
            color: '#05375a',
            fontSize: 28,
            fontWeight: 'bold'
        },
    });