const http = require("./Http");

module.exports = {
  
    fetchTransactionHistory : async(telephone_number) => {
       const endpoint = 'customer/transaction/history?telephone_no='+telephone_number+'';
       return await http.ApiService.fetchData(endpoint);
   },
   
    getTransactionHistory: async(id) => {
       const endpoint = 'customer/transactions?id='+id+'';
       return await http.ApiService.fetchData(endpoint);
   },

   getOrderDetails : async(order_no, customer_id) => {
    const endpoint = `device/parking-request/details?order_no=${order_no}&customer_id=${customer_id}`;
    return await http.ApiService.fetchData(endpoint);
},

}