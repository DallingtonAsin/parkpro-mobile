const axios = require('axios');
import AsyncStorage from '@react-native-async-storage/async-storage';

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
                if(res.status == 200){
                    return res.data;
                 }else{
                     return res;
                 }
            }).catch(err => console.log("Axios error on fetch", err));
            return response;
        } catch (error) {
            throw error;
        }
    }
    
    post = async(endpoint, data) => {
        try {
            const headers = await this.getHeader();
            const response = this.client().post(endpoint, data, headers).then(res => {
                if(res.status == 200){
                    return res.data;
                 }else{
                     return res;
                 }
            }).catch(err => {
                console.log("Axios error on post", err);
                throw err;
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
                if(res.status == 200){
                    return res.data;
                 }else{
                     return res;
                 }
            }).catch(err => {
                console.log("Axios error on put", err)
                throw err;
            });
            
            return response;
        } catch (error) {
            throw error;
        }
    }
    
    postWithFile = async(endpoint, data) => {
        try {
            const headers = await this.getHeader(true);
            console.log("Headers", headers);
            console.log("put file data", data);
            const response = this.client().post(endpoint, data, headers).then(res => {
                 if(res.status == 200){
                    return res.data;
                 }else{
                     return res;
                 }
            }).catch(err => {
                console.log("Axios error on post with file", err);
                throw err;
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
    
    
}

module.exports = AxiosApi


