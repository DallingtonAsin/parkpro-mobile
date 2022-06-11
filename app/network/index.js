const AxiosApi = require('./axios');
const ApiEndpoint = require('./ApiEndpoints');
import { API_URL } from '@env';

module.exports = {
    axios: new AxiosApi(API_URL),
    endpoint: new ApiEndpoint(),
}