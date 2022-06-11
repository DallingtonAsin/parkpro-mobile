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
            console.log("End point on fetch", endpoint);
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
            console.log("End point on post", endpoint);
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
            console.log("End point on put", endpoint);
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
            console.log("End point on post with file", endpoint);
            const headers = await this.getHeader();
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
    
    getHeader = async() => {
        try{
            const bearerToken = await this.getToken();
            const headers =  {
                headers: {
                    'Content-Type': 'application/json',
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


