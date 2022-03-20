const http = require("./Http");

module.exports = {
    
    fetchTransactionHistory : async(telephone_number) => {
        try{
            const endpoint = 'customer/transaction/history?telephone_no='+telephone_number+'';
            return await http.ApiService.fetchData(endpoint);
        }catch(error){
            throw error;
        }
    },
    
    getTransactionHistory: async(id) => {
        try{
            const endpoint = 'customer/transactions?id='+id+'';
            return await http.ApiService.fetchData(endpoint);
        }catch(error){
            throw error;
        }
    },
    
    getOrderDetails : async(order_no, customer_id) => {
        try{
            const endpoint = `device/parking-request/details?order_no=${order_no}&customer_id=${customer_id}`;
            return await http.ApiService.fetchData(endpoint);
        }catch(error){
            throw error;
        }
    },
    
    loadAirtime: async(data) => {
        try{
            const endpoint = 'customer/send/airtime';
            return await http.ApiService.PostData(endpoint, data);
        }catch(error){
            throw error;
        }
    },
    
}