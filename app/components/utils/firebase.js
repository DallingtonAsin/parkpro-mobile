import firebase from '@react-native-firebase/app';

// Your secondary Firebase project credentials...
const credentials = {
  appId: '1:151063581419:android:980626b2afe4a58aa464ae',
  apiKey: 'AAAAIywXUus:APA91bG-8kpbZqW4JzGMhFbKcqXpEII7-FDAZnlD8qNCc7k0h_MCAwt0sqkSP-nqTrgKrwSRO6OhuOuh0MilOyZnx9lzZy0Kv6raAfODP6gf2tABPlgiDiKkAd-yrhbJIAFrE1oEOqre ',
  databaseURL: 'https://parkpro-fedd1-default-rtdb.firebaseio.com/',
  storageBucket: 'parkpro-fedd1.appspot.com',
  messagingSenderId: 'ParkPro',
  projectId: 'parkpro-fedd1',
};

const config = {
  name: 'ParkPro',
};


const firebaseApi =  await firebase.initializeApp(credentials, config);

export default firebaseApi;
