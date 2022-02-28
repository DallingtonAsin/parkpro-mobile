import {JSHash, CONSTANTS} from 'react-native-hash';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {APP_URL} from '@env';
const axios = require('axios');

const headerConfig = {
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'authToken': 'test1234',
  }
}

// Get Outh2 Auth Token
 async function getToken(){
    let token = null;
    try{
      token = await AsyncStorage.getItem("userToken");
      return token;
    }catch(e){
      console.log("Error on async storage", e);
    }
  }


 // get data using fetch api
exports.fetchData = async(endpoint) => {
  const url = APP_URL+""+ endpoint;
  const data = {};
  const bearToken = await getToken();
  const response = await fetch(url, {
    method:'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${bearToken}`,
    },
    data: data,
  });
  return await response.json();
}

   // Post data using fetch api
   exports.PostData = async(endPoint, data) => {
      const url = APP_URL+""+ endPoint;
      const bearToken = await getToken();
      let response = await fetch(url, {
        method: 'POST', 
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${bearToken}`,
        },
        body: JSON.stringify(data)
      });
      
      var resultSet;
      (response.ok) 
      ? resultSet = await response.json()
      : resultSet = "HTTP-Error: " + response.status;
      return resultSet;
      
    }

      // put data using fetch api
     exports.PutData = async(endPoint, data) => {
        const url = APP_URL+""+ endPoint;
        const bearToken = await getToken();
        let response = await fetch(url, {
          method: 'PUT', 
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${bearToken}`,
          },
          body: JSON.stringify(data)
        });
        
        var resultSet;
        (response.ok) 
        ? resultSet = await response.json()
        : resultSet = "HTTP-Error: " + response.status;
        return resultSet;
        
      }

// Post data with file using fetch api
 exports.postDataWithFile = async(endPoint, data) => {
      const url = APP_URL+""+ endPoint;
      const bearToken = await getToken();
      const response = await fetch(url, {
        method: 'POST',
        body: data,
        headers: {
          Accept: 'application/json',
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${bearToken}`,
        },
      });

      var resultSet;
      (response.ok) 
      ? resultSet = await response.json()
      : resultSet = "HTTP-Error: " + response.status;
      return resultSet;
    }

 

    // fetch data using axios
 exports.getRequest = async (endpoint) => {
    const url = APP_URL+""+ endpoint;
    await axios.get(url, headerConfig).then(response => {
      return response.data;
    })
    .catch(function (error) {
      return error;
    });
  }
  
  // post data using axios
 exports.postRequest = async (endpoint, body) => {
    const url = APP_URL+""+ endpoint;
    await axios.post(url, body, headerConfig).then(function (response) {
      return response.data;
    })
    .catch(function (error) {
      return error;
    });
  }
  
  // hash strings
 exports.HashStringsha256 = async(string) => {
    return await JSHash(string, CONSTANTS.HashAlgorithms.sha256);
  }
