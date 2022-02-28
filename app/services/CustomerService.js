const http = require("./Http");

module.exports = {
    
    login: async (phone_number, otp) => {
        const endpoint = "customer/verify-otp";
        const data = {
            phone_number: phone_number,
            otp: otp
        };
        return await http.ApiService.PostData(endpoint, data);
    },
    
    register: async(data) => {
        const endpoint = "customer/register";
        return await http.ApiService.PostData(endpoint, data);
    },
    
    createProfile: async(data) => {
        const endpoint = "customer/profile/create";
        return await http.ApiService.PostData(endpoint, data);
    },
    
    updateProfile: async(data) => {
        const endpoint = "customer/profile/update";
        return await http.ApiService.PutData(endpoint, data);
    },
    
    changePassword: async(data) => {
        const endpoint = 'customer/password/change';
        return await http.ApiService.PostData(endpoint, data);
    },
    
    uploadProfilePicture: async(data) => {
        const endpoint = "customer/change/profile-picture";
        return await http.ApiService.postDataWithFile(endpoint, data);
    },
    
    removeProfilePicture: async(data) => {
        const endpoint = "customer/profile/picture/remove";
        return await http.ApiService.PostData(endpoint, data);
    },
    
    getNotifications: async(id) => {
        const endpoint = 'customer/notifications?id='+id+'';
        return await http.ApiService.fetchData(endpoint);
    },
    
    
    getCustomerData: async(id) => {
        const endpoint = 'customer/details?id='+id+'';
        return await http.ApiService.fetchData(endpoint);
    },
    
    sendOTP: async(data) => {
        const endpoint = 'customer/send-otp';
        return await http.ApiService.PostData(endpoint, data);
    },
    
    verifyOneTimePassword: async(data) => {
        const endpoint = 'customer/verify-otp';
        return await http.ApiService.PostData(endpoint, data);
    },
    
    topUp: async(data) => {
        const endpoint = 'customer/account/topup';
        console.log("Sending topup data to api", data);
        return await http.ApiService.PostData(endpoint, data);
    },
    postSuggestion : async(data) => {
        const endpoint = "customer/suggestion";
        return await http.ApiService.PostData(endpoint, data);
    },
}