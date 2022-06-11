const AxiosApi = require('./axios');
const Constants = require('../constants');
const ApiEndpoint = require('./ApiEndpoints');
import { API_URL } from '@env';

module.exports = {
    axios: new AxiosApi(API_URL),
    constants: new Constants(),
    endpoint: new ApiEndpoint(),
}