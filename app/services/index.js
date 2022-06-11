const CustomerService = require('./CustomerService');
const ParkingService = require('./ParkingService');
const TransactionService = require('./TransactionService');

module.exports = {
    customer: new CustomerService(),
    parking: new ParkingService(),
    transaction: new TransactionService(),
}