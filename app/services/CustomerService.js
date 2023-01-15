const api = require('../network');


let CustomerService = class {

    register = async(data) => {
        try{
            const endpoint = api.endpoint.customer.register;
            return await api.axios.post(endpoint, data);
        }catch(error){
            throw error;
        }
    }
    
    createProfile = async(data) => {
        try{
            const endpoint = api.endpoint.customer.create_profile;
            return await api.axios.post(endpoint, data);
        }catch(error){
            throw error;
        }
    }
    
    updateProfile = async(data) => {
        try{
            const endpoint = api.endpoint.customer.update_profile;
            return await api.axios.put(endpoint, data);
        }catch(error){
            throw error;
        }
    }
    
    changePassword = async(data) => {
        try{
            const endpoint = api.endpoint.customer.change_password;
            return await api.axios.post(endpoint, data);
        }catch(error){
            throw error;
        }
    }
    
    uploadProfilePicture = async(data) => {
        try{
            // console.log("Update profile data", data);
            const endpoint = api.endpoint.customer.update_profile_mage;
            return await api.axios.postWithFile(endpoint, data);
        }catch(error){
            throw error;
        }
    }
    
    removeProfilePicture = async(data) => {
        try{
            const endpoint = api.endpoint.customer.remove_profile_picture;
            return await api.axios.post(endpoint, data);
        }catch(error){
            throw error;
        }
    }
    
    getNotifications = async(id) => {
        try{
            const endpoint = `${api.endpoint.customer.get_notifications}?id=${id}`;
            return await api.axios.fetch(endpoint);

        }catch(error){
            throw error;
        }
    }
    
    
    getCustomerData = async(id) => {
        try{
            const endpoint = `${api.endpoint.customer.get_data}?id=${id}`;
            return await api.axios.fetch(endpoint);
        }catch(error){
            throw error;
        }
    }
    
    sendOTP = async(data) => {
        try{
            const endpoint = api.endpoint.customer.send_otp;
            return await api.axios.post(endpoint, data);
        }catch(error){
            throw error;
        }
    }
    
    verifyOtp = async(data) => {
        try{
            const endpoint = api.endpoint.customer.verify_otp;
            return await api.axios.post(endpoint, data);
        }catch(error){
            throw error;
        }
    }
    
    topUp = async(data) => {
        try{
            const endpoint = api.endpoint.customer.topup;
            return await api.axios.post(endpoint, data);
        }catch(error){
            throw error;
        }
    }
    
    postSuggestion  = async(data) => {
        try{
            const endpoint = api.endpoint.customer.post_feedback;
            return await api.axios.post(endpoint, data);
        }catch(error){
            throw error;
        }
    }
    
    postAppDetails  = async(data) => {
        try{
            const endpoint = api.endpoint.customer.post_app_details;
            return await api.axios.post(endpoint, data);
        }catch(error){
            throw error;
        }
    }

    resendSignupOTP  = async(data) => {
        try{
            const endpoint = api.endpoint.customer.resend_otp;
            return await api.axios.post(endpoint, data);
        }catch(error){
            throw error;
        }
    }

    changePin  = async(data) => {
        try{
            const endpoint = api.endpoint.customer.change_pin;
            return await api.axios.post(endpoint, data);
        }catch(error){
            throw error;
        }
    }

    verifyChangePhoneNumber  = async(data) => {
        try{
            const endpoint = api.endpoint.customer.verify_change_phone_number;
            return await api.axios.post(endpoint, data);
        }catch(error){
            throw error;
        }
    }

    changePhoneNumber  = async(data) => {
        try{
            const endpoint = api.endpoint.customer.change_phone_number;
            return await api.axios.post(endpoint, data);
        }catch(error){
            throw error;
        }
    }

    
}

module.exports = CustomerService;