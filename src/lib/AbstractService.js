import {Axios} from 'axios';

export class AbstractService extends Axios {
    constructor ({appId, baseURL, serviceName}) {
        const headers = {
            'x-app-id': appId
        };
        super({headers, baseURL: baseURL.replace(/\/+$/, '')  + '/' + serviceName, url: ''});
        this._appId = appId;
        this._serviceName = serviceName;
    }

    /**
     * sets token for authentication, token you can generate from SDK.generateWebToken
     * @param {string} token
     */
    setToken (token) {
        this.defaults.headers['x-app-token'] = token;
    }

    /**
     * Id of current app
     * @returns {string} id
     */
    getAppId () {
        return this._appId;
    }

    /**
     * The url to service
     * @returns {string} url
     */
    getBaseURL () {
        return this['defaults'].baseURL||'';
    }

    /**
     * Name of this service
     * @returns {string} name
     */
    getServiceName () {
        return this._serviceName;
    }

    /**
     * Performing a GET request
     * @param {Object} config The config specific for this request (merged with this.defaults)
     * @returns {Promise} promise of response
     */
    get (config = {}) {
        return this.request(Object.assign(config, {method: 'get'}));
    }

    /**
     * Performing a Delete request
     * @param {Object} config The config specific for this request (merged with this.defaults)
     * @returns {Promise} promise of response
     */
    delete (config = {}) {
        return this.request(Object.assign(config, {method: 'delete'}));
    }

    /**
     * Performing a Head request
     * @param {Object} config The config specific for this request (merged with this.defaults)
     * @returns {Promise} promise of response
     */
    head (config = {}) {
        return this.request(Object.assign(config, {method: 'head'}));
    }

    /**
     * Performing a POST request
     * @param {*} data is the data to be sent as the request body
     * @param {Object} config The config specific for this request (merged with this.defaults)
     * @returns {Promise} promise of response
     */
    post (data, config = {}) {
        return this.request(Object.assign(config, {method: 'post', data}));
    }

    /**
     * Performing a PUT request
     * @param {*} data is the data to be sent as the request body
     * @param {Object} config The config specific for this request (merged with this.defaults)
     * @returns {Promise} promise of response
     */
    put (data, config = {}) {
        return this.request(Object.assign(config, {method: 'put', data}));
    }

    /**
     * Performing a Patch request
     * @param {*} data is the data to be sent as the request body
     * @param {Object} config The config specific for this request (merged with this.defaults)
     * @returns {Promise} promise of response
     */
    patch (data, config = {}) {
        return this.request(Object.assign(config, {method: 'patch', data}));
    }
}


export default AbstractService;
