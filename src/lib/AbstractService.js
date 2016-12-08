import {Axios} from 'axios';
import defaults from 'axios/lib/defaults';

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
     * Sets token for authentication, token you can generate from SDK.generateWebToken
     * @param {string|function} token or token getter, which returns promise.
     * @returns {undefined}
     */
    setToken (token) {
        if (typeof token === 'function') {
            this._tokenGetter = token;
            return;
        }
        this._token = token;
        // this.defaults.headers['x-app-token'] = token;
    }

    async _getToken (config) {
        if (this._tokenGetter) {
            const token = this._tokenGetter(config);
            if (token) {
                if (token.then) {
                    return await token;
                }
                return token;
            }
        }
        return this._token;
    }

    request (config) {
        config = config || {};
        const adapter =  config.adapter || this.defaults.adapter || defaults.adapter;
        config.adapter = async conf => {
            const token = await this._getToken(conf);
            conf.headers = Object.assign(conf.headers, {
                'x-app-id': this.getAppId(),
                'x-app-token': token
            });
            return await adapter(conf);
        };
        return super.request(config);
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
