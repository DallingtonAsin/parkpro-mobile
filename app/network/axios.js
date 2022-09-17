const axios = require('axios');
import AsyncStorage from '@react-native-async-storage/async-storage';
import ApiResponse from  './responses/ApiResponse';
import NetInfo from "@react-native-community/netinfo";

let AxiosApi = class {
    
    constructor(baseUrl){
        this.baseUrl = baseUrl;
    }
    
    client = () => {
        const client =  axios.create({
            baseURL: this.baseUrl
        });
        return client;
    }
    
    fetch = async(endpoint) => {
        try {
            const headers = await this.getHeader();
            const response = this.client().get(endpoint, headers).then(res => {
                // console.log(`Result`, res);
                return this.getSuccessResponse(res, true);
                
            }).catch(err => {
                return this.getFailedResponse(err);
            });
            return response;
        } catch (error) {
            throw error;
        }
    }
    
    post = async(endpoint, data) => {
        try {
            const headers = await this.getHeader();
            const response = this.client().post(endpoint, data, headers).then(res => {
                console.log(`Result`, res);
                return this.getSuccessResponse(res);
            }).catch(err => {
                return this.getFailedResponse(err);
            });
            return response;
        } catch (error) {
            throw error;
        }
        
    }
    
    put = async(endpoint, data) => {
        try {
            const headers = await this.getHeader();
            const response = this.client().put(endpoint, data, headers).then(res => {
                return this.getSuccessResponse(res);
            }).catch(err => {
                return this.getFailedResponse(err);
            });
            return response;
            
        } catch (error) {
            throw error;
        }
    }
    
    postWithFile = async(endpoint, data) => {
        try {
            const headers = await this.getHeader(true);
            const response = this.client().post(endpoint, data, headers).then(res => {
                return this.getSuccessResponse(res);
            }).catch(err => {
                return this.getFailedResponse(err);
            });
            
            return response;
        } catch (error) {
            throw error;
        }
    }
    
    getHeader = async(isMultipart = false) => {
        try{
            
            const bearerToken = await this.getToken();
            const headers =  {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': isMultipart ? 'multipart/form-data' : 'application/json',
                    'Authorization': 'Bearer '+bearerToken
                },      
            }
            return headers;
            
        }catch(err){
            throw err;
        }
    }
    
    getToken = async() => {
        try{
            let token = await AsyncStorage.getItem("userToken");
            if(!token){
                token = null;
            }
            return token;
        }catch(err){
            throw err;
        }
    }
    
    hasInternetConnection = () => {
        let isConnected = NetInfo.fetch().then(state => {
            return state.isConnected;
        }).catch((err) => {
            throw err;
        });
        return isConnected; 
    }
    
    checkInternetConnection = async() => {
        let hasInternet =  await this.hasInternetConnection();
        console.log('Has internet conncetion', hasInternet);
        if(!hasInternet){
            throw new Error("You have don't internet connection");
        }
    }
    
    getSuccessResponse = (response, isGet=false) => {
        try{
            let data = null, message = null, result = null;
            
            if(response.status == 200){
                if(isGet){
                    data = response.data;
                    message = 'SUCCESS';
                }else{
                    data = response.data.data;
                    message = response.data.message;
                    // console.log('Data on posting', data);
                }

                // console.log(`Response message`, message);  
                result =  new ApiResponse(response.status, message, data)
            }else{
                result = new ApiResponse(response.status, message, data);
            }
            
            return result;
        }catch(err){
            throw err;
        }
    }
    
    getFailedResponse = (error) => {
        try{
            if (error.response) {
                let errorMessage = error.message === 'Network Error' ? 'No internet Connection' : error.message;
                return new ApiResponse(error.response.status, errorMessage, null);
            }else{
                throw error;
            }
        }catch(err){
            throw err;
        }
    }
    
    
}

module.exports = AxiosApi


