const http = require("./Http");

module.exports = {
    postParkingRequest : async(data) => {
        try{
            const endpoint = 'device/parking-request ';
            return await http.ApiService.PostData(endpoint, data);
        }catch(error){
            throw error;
        }
    },
    
    getMyParkingRequests : async(id) => {
        try{
            const endpoint = `device/parking-request/myrequests?id=${id}`;
            return await http.ApiService.fetchData(endpoint);
        }catch(error){
            throw error;
        }
    },
    
    fetchParkingAreas : async() => {
        try{
            const endpoint = 'device/parking-areas';
            return await http.ApiService.fetchData(endpoint);
        }catch(error){
            throw error;
        }
    },
    
    fetchParkingSpots : async(obj) => {
        try{
            const client_id = obj.id;
            const endpoint = 'device/parking-spots?client_id='+client_id+'';
            return await http.ApiService.fetchData(endpoint);
        }catch(error){
            throw error;
        }
    },
    
    fetchParkingFees : async(parking_area_id) => {
        try{
            const endpoint = 'device/parking-area/fees?parking_area_id='+parking_area_id+'';
            return await http.ApiService.fetchData(endpoint);
        }catch(error){
            throw error;
        }
    },
    
    filterParkingAreas: async(search) => {
        try{
            const endpoint = 'parking-areas/search?search='+search+'';
            return await http.ApiService.fetchData(endpoint);
        }catch(error){
            throw error;
        }
    },
    
    fetchParkingClients: async() => {
        try{
            const endpoint = 'clients';
            return await http.ApiService.fetchData(endpoint);
        }catch(error){
            throw error;
        }
    },

    fetchNearByParkingAreas : async(latitude, longitude) => {
        try{
            const endpoint = `device/parking-area/near-by?latitude=${latitude}&longitude=${longitude}`;
            return await http.ApiService.fetchData(endpoint);
        }catch(error){
            throw error;
        }
    },

    fetchTopRatedParkingAreas : async() => {
        try{
            const endpoint = `device/parking-area/top-rated`;
            return await http.ApiService.fetchData(endpoint);
        }catch(error){
            throw error;
        }
    },
    
    getCarTypes: async() => {
        try{
            const endpoint = 'device/vehicle-category';
            return await http.ApiService.fetchData(endpoint);
        }catch(error){
            throw error;
        }
    },
    
    swrfetchParkingAreas: () => {
        try{
            const endpoint = 'parking_areas';
            return useNativeFetcher(endpoint);
        }catch(error){
            throw error;
        }
    },
    
    fetchParkingDetailsById : async(id) => {
        try{
            const endpoint = `device/parking-area/find-by-id?id=${id}`;
            return await http.ApiService.fetchData(endpoint);
        }catch(error){
            throw error;
        }
    },
}