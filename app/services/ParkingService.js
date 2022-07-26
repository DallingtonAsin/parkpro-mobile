const api = require('../network');


let ParkingService =  class{

    postParkingRequest = async(data) => {
        try{
            const endpoint = api.endpoint.parking.post_parking_request;
            return await api.axios.post(endpoint, data);

        }catch(error){
            throw error;
        }
    }
    
    getMyParkingRequests = async(id) => {
        try{
            const endpoint = `${api.endpoint.parking.get_parking_requests}?id=${id}`;
            return await api.axios.fetch(endpoint);
        }catch(error){
            throw error;
        }
    }
    
    fetchParkingAreas = async() => {
        try{
            const endpoint = `${api.endpoint.parking.fetch_parking_areas}`;
            return await api.axios.fetch(endpoint);
        }catch(error){
            throw error;
        }
    }
    
    fetchParkingSpots = async(data) => {
        try{
            const endpoint = `${api.endpoint.parking.fetch_parking_spots}?client_id=${data.id}`;
            return await api.axios.fetch(endpoint);
        }catch(error){
            throw error;
        }
    }
    
    fetchParkingInfo = async(id) => {
        try{
            const endpoint = `${api.endpoint.parking.fetch_parking_fees}?parking_area_id=${id}`;
            return await api.axios.fetch(endpoint);
        }catch(error){
            throw error;
        }
    }
    
    filterParkingAreas = async(search) => {
        try{
            const endpoint = `${api.endpoint.parking.filter_parking_areas}?search=${search}`;
            return await api.axios.fetch(endpoint);
        }catch(error){
            throw error;
        }
    }
    
    fetchParkingClients = async() => {
        try{
            const endpoint = `${api.endpoint.parking.fetch_parking_clients}`;
            return await api.axios.fetch(endpoint);
        }catch(error){
            throw error;
        }
    }

    fetchNearByParkingAreas = async(latitude, longitude) => {
        try{
            const endpoint = `${api.endpoint.parking.fetch_nearby_parkings}?latitude=${latitude}&longitude=${longitude}`;
            return await api.axios.fetch(endpoint);
        }catch(error){
            throw error;
        }
    }

    fetchTopRatedParkingAreas = async() => {
        try{
            const endpoint = `${api.endpoint.parking.fetch_top_rated_parkings}`;
            return await api.axios.fetch(endpoint);
        }catch(error){
            throw error;
        }
    }
    
    getCarTypes = async() => {
        try{
            const endpoint = `${api.endpoint.parking.get_car_types}`;
            return await api.axios.fetch(endpoint);
        }catch(error){
            throw error;
        }
    }

    fetchParkingDetailsById = async(id) => {
        try{
            const endpoint = `${api.endpoint.parking.fetch_parking_details}?id=${id}`;
            return await api.axios.fetch(endpoint);
        }catch(error){
            throw error;
        }
    }
}

module.exports = ParkingService