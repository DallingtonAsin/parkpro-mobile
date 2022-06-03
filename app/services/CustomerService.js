const http = require("./Http");

module.exports = {
    
    login: async (phone_number, otp) => {
        try{
            const endpoint = "customer/verify-otp";
            const data = {
                phone_number: phone_number,
                otp: otp
            };
            return await http.ApiService.PostData(endpoint, data);
        }catch(error){
            throw error;
        }
    },
    
    register: async(data) => {
        try{
            const endpoint = "customer/register";
            return await http.ApiService.PostData(endpoint, data);
        }catch(error){
            throw error;
        }
    },
    
    createProfile: async(data) => {
        try{
            const endpoint = "customer/profile/create";
            return await http.ApiService.PostData(endpoint, data);
        }catch(error){
            throw error;
        }
    },
    
    updateProfile: async(data) => {
        try{
            const endpoint = "customer/profile/update";
            return await http.ApiService.PutData(endpoint, data);
        }catch(error){
            throw error;
        }
    },
    
    changePassword: async(data) => {
        try{
            const endpoint = 'customer/password/change';
            return await http.ApiService.PostData(endpoint, data);
        }catch(error){
            throw error;
        }
    },
    
    uploadProfilePicture: async(data) => {
        try{
            const endpoint = "customer/change/profile-picture";
            return await http.ApiService.postDataWithFile(endpoint, data);
        }catch(error){
            throw error;
        }
    },
    
    removeProfilePicture: async(data) => {
        try{
            const endpoint = "customer/profile/picture/remove";
            return await http.ApiService.PostData(endpoint, data);
        }catch(error){
            throw error;
        }
    },
    
    getNotifications: async(id) => {
        try{
            const endpoint = 'customer/notifications?id='+id+'';
            return await http.ApiService.fetchData(endpoint);
        }catch(error){
            throw error;
        }
    },
    
    
    getCustomerData: async(id) => {
        try{
            const endpoint = 'customer/details?id='+id+'';
            return await http.ApiService.fetchData(endpoint);
        }catch(error){
            throw error;
        }
    },
    
    sendOTP: async(data) => {
        try{
            const endpoint = 'customer/send-otp';
            return await http.ApiService.PostData(endpoint, data);
        }catch(error){
            throw error;
        }
    },
    
    verifyOneTimePassword: async(data) => {
        try{
            const endpoint = 'customer/verify-otp';
            return await http.ApiService.PostData(endpoint, data);
        }catch(error){
            throw error;
        }
    },
    
    topUp: async(data) => {
        try{
            const endpoint = 'customer/account/topup';
            console.log("Sending topup data to api", data);
            return await http.ApiService.PostData(endpoint, data);
        }catch(error){
            throw error;
        }
    },

    postSuggestion : async(data) => {
        try{
            const endpoint = "customer/suggestion";
            return await http.ApiService.PostData(endpoint, data);
        }catch(error){
            throw error;
        }
    },
}