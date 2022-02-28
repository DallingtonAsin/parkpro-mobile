const http = require("./Http");

module.exports = {
    postParkingRequest : async(data) => {
        const endpoint = 'device/parking-request ';
        return await http.ApiService.PostData(endpoint, data);
    },

     getMyParkingRequests : async(id) => {
        const endpoint = `device/parking-request/myrequests?id=${id}`;
        return await http.ApiService.fetchData(endpoint);
    },

    fetchParkingAreas : async() => {
        const endpoint = 'device/parking-areas';
        return await http.ApiService.fetchData(endpoint);
    },
    
     fetchParkingSpots : async(obj) => {
        const client_id = obj.id;
        const endpoint = 'device/parking-spots?client_id='+client_id+'';
        return await http.ApiService.fetchData(endpoint);
    },

     fetchParkingFees : async(parking_area_id) => {
        const endpoint = 'device/parking-area/fees?parking_area_id='+parking_area_id+'';
        return await http.ApiService.fetchData(endpoint);
    },

    filterParkingAreas: async(search) => {
        const endpoint = 'parking-areas/search?search='+search+'';
        return await http.ApiService.fetchData(endpoint);
    },
    
    fetchParkingClients: async() => {
        const endpoint = 'clients';
        return await http.ApiService.fetchData(endpoint);
    },

    getCarTypes: async() => {
        const endpoint = 'device/vehicle-category';
        return await http.ApiService.fetchData(endpoint);
    },

    swrfetchParkingAreas: () => {
        const endpoint = 'parking_areas';
        return useNativeFetcher(endpoint);
    },
}