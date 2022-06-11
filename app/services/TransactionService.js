const api = require('../network');

let TransactionService = class{
    
    fetchTransactionHistory = async(telephone_no) => {
        try{
            const endpoint = `${api.endpoint.transaction.fetch_history}?telephone_no=${telephone_no}`;
            return await api.axios.fetch(endpoint);
        }catch(error){
            throw error;
        }
    }
    
    getTransactionHistory = async(id) => {
        try{
            const endpoint = `${api.endpoint.transaction.get_history}?id=${id}`;
            return await api.axios.fetch(endpoint);
        }catch(error){
            throw error;
        }
    }
    
    getOrderDetails = async(order_no, customer_id) => {
        try{
            const endpoint = `${api.endpoint.transaction.get_order_details}?order_no=${order_no}&customer_id=${customer_id}`;
            return await api.axios.fetch(endpoint);
        }catch(error){
            throw error;
        }
    }
    
  
}

module.exports = TransactionService;