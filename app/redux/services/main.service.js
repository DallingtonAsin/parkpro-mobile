import Service from './service';

export default class MainService{
    
    
    static login = (phone_number, otp) => {
        const endpoint = "customer/verify-otp";
        const data = {
                       phone_number: phone_number,
                       otp: otp
                    };
        return Service.PostData(endpoint, data);
    }
    
    static register = async(data) => {
        const endpoint = "customer/register";
        return await Service.PostData(endpoint, data);
    }

    static createProfile = async(data) => {
        const endpoint = "customer/profile/create";
        return await Service.PostData(endpoint, data);
    }

    static updateProfile = async(data) => {
        const endpoint = "customer/profile/update";
        return await Service.PutData(endpoint, data);
    }
    
    static changePassword = async(data) => {
        const endpoint = 'customer/password/change';
        return await Service.PostData(endpoint, data);
    }
    
    static uploadProfilePicture = (data) => {
        const endpoint = "customer/change/profile-picture";
        return Service.postDataWithFile(endpoint, data);
    }
    
    
    static topUp = async(data) => {
        const endpoint = 'customer/account/topup';
        console.log("Sending topup data to api", data);
        return await Service.PostData(endpoint, data);
    }
    
    static postParkingRequest = async(data) => {
        const endpoint = 'device/parking-request ';
        return await Service.PostData(endpoint, data);
    }

    static getMyParkingRequests = async(id) => {
        const endpoint = `device/parking-request/myrequests?id=${id}`;
        return await Service.fetchData(endpoint);
    }

    static getOrderDetails = async(order_no, customer_id) => {
        const endpoint = `device/parking-request/details?order_no=${order_no}&customer_id=${customer_id}`;
        return await Service.fetchData(endpoint);
    }
    
    static postSuggestion = (data) => {
        const endpoint = "customer/suggestion";
        return Service.PostData(endpoint, data);
    }
    
    static fetchParkingAreas = async() => {
        const endpoint = 'device/parking-areas';
        return await Service.fetchData(endpoint);
    }
    
    static fetchParkingSpots = async(obj) => {
        const client_id = obj.id;
        const endpoint = 'device/parking-spots?client_id='+client_id+'';
        return await Service.fetchData(endpoint);
    }
    static fetchParkingFees = async(parking_area_id) => {
        const endpoint = 'device/parking-area/fees?parking_area_id='+parking_area_id+'';
        return await Service.fetchData(endpoint);
    }
    
    static fetchTransactionHistory = async(telephone_number) => {
        const endpoint = 'customer/transaction/history?telephone_no='+telephone_number+'';
        return await Service.fetchData(endpoint);
    }
    
    static getTransactionHistory = async(id) => {
        const endpoint = 'customer/transactions?id='+id+'';
        return await Service.fetchData(endpoint);
    }
    
    static getNotifications = async(id) => {
        const endpoint = 'customer/notifications?id='+id+'';
        return await Service.fetchData(endpoint);
    }
    
    
    static getCustomerData = async(id) => {
        const endpoint = 'customer/details?id='+id+'';
        return await Service.fetchData(endpoint);
    }
    
    static getCarTypes = async() => {
        const endpoint = 'device/vehicle-category';
        return await Service.fetchData(endpoint);
    }
    
    
    static fetchParkingClients = async() => {
        const endpoint = 'clients';
        return await Service.fetchData(endpoint);
    }
    
    static filterParkingAreas = async(search) => {
        const endpoint = 'parking-areas/search?search='+search+'';
        return await Service.fetchData(endpoint);
    }
    
    static swrfetchParkingAreas = () => {
        const endpoint = 'parking_areas';
        return useNativeFetcher(endpoint);
    }

    static sendOTP = async(data) => {
        const endpoint = 'customer/send-otp';
        return await Service.PostData(endpoint, data);
    }
    static verifyOneTimePassword = async(data) => {
        const endpoint = 'customer/verify-otp';
        return await Service.PostData(endpoint, data);
    }
  
    
}