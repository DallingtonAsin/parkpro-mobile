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
  
  try{
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
    if (!response.ok) {
      console.log(response);
      throw new Error(`Error! status: ${response.status}`);
    }
    const result = await response.json();
    return result;
    
  }catch(error){
    throw error;
  }
}

// Post data using fetch api
exports.PostData = async(endPoint, data, token=null) => {
  
  try{
    const url = APP_URL+""+ endPoint;
    const bearToken = token ? token :  await getToken();
 
    let response = await fetch(url, {
      method: 'POST', 
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${bearToken}`,
      },
      body: JSON.stringify(data)
    });
    
    if (!response.ok) {
      console.log(response);
      throw new Error(`Error! status: ${response.status}`);
    }
    const result = await response.json();
    return result;
  }catch(error){
    throw error;
  }
  
}

// put data using fetch api
exports.PutData = async(endPoint, data) => {
  
  try{
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
    
    if (!response.ok) {
      console.log(response);
      throw new Error(`Error! status: ${response.status}`);
    }
    const result = await response.json();
    return result;
  }catch(error){
    throw error;
  }
}

// Post data with file using fetch api
exports.postDataWithFile = async(endPoint, data) => {
  
  try{
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
    
    if (!response.ok) {
      console.log(response);
      throw new Error(`Error! status: ${response.status}`);
    }
    const result = await response.json();
    return result;
  }catch(error){
    throw error;
  }
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
  try{
    return await JSHash(string, CONSTANTS.HashAlgorithms.sha256);
  }catch(error){
    throw error;
  }
}
