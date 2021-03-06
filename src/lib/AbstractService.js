import {Axios} from 'axios';
import defaults from 'axios/lib/defaults';
import EJSON from 'ejson';
import SdkError from './SdkError';
import {BinaryClient} from '../../vendors/binary';

// const {BinaryClient} = typeof window !== 'undefined' ? require('binaryjs-client') : require('binaryjs');

export class AbstractService extends Axios {
    constructor ({appId, baseURL, serviceName, authByCustomHeader = false, headers = {}}) {
        super({baseURL: `${baseURL.replace(/\/+$/, '')}/${appId}/${serviceName}`, url: '', headers});
        this._appId = appId;
        this._serviceName = serviceName;
        this._socketURL = baseURL.replace(/^http/, 'ws').replace(/\/+$/, '')  + '/socket';
        this._authByCustomHeader = authByCustomHeader;
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

    async request (config) {
        config = config || {};
        const adapter =  config.adapter || this.defaults.adapter || defaults.adapter;
        config.adapter = async conf => {
            const token = await this._getToken(conf);
            if (this._authByCustomHeader || conf.authByCustomHeader || config.auth) {
                conf.headers = Object.assign(conf.headers, {
                    'x-app-id': this.getAppId(),
                    'x-app-token': token
                });
            } else {
                conf.headers = Object.assign(conf.headers, {
                    'Authorization': 'Bearer ' + token
                });
            }
            return await adapter(conf);
        };

        try {
            const res = await (super.request(config));
            SdkError.validateStatus(res.status, res.statusText);
            return res;
        } catch (e) {
            SdkError.extendError(e, true);
        }
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
        return this['defaults'].baseURL || '';
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

    async sendStream (onStream = () => {}, config = {}) {
        const token = await this._getToken(config);
        return new Promise((resolve, reject) => {
            const client = new BinaryClient(this._socketURL);
            let isResolved = false;
            const done = (...params) => {
                if (!isResolved) {
                    resolve(...params);
                    client.close();
                }
                isResolved = true;
            };
            const fail = (...params) => {
                if (!isResolved) {
                    reject(...params);
                    client.close();
                }
            };
            client.on('open', () => {
                const streamSoc = client.createStream(Object.assign({
                    serviceName: this.getServiceName(),
                    appId: this.getAppId(),
                    appToken: token
                }, (config && config.data) || {}));
                const _onData = streamSoc._onData.bind(streamSoc);
                streamSoc._onData = data =>  {
                    if (typeof data === 'object' && !EJSON.isBinary(data)) {
                        return _onData(EJSON.fromJSONValue(data));
                    }
                    return _onData(data);
                };
                onStream(streamSoc, client);
                streamSoc.on('error', err => fail(err));
                streamSoc.on('close', done);
            });
            client.on('error', err => fail(err));
        });
    }
}
/*eslint-disable no-unused-vars*/
defaults.transformResponse = [function transformResponse (data) {
    /*eslint no-param-reassign:0*/
    if (typeof data === 'string') {
        try {
            data = EJSON.parse(data);
        } catch (e) { /* Ignore */ }
    }
    return data;
}];
/*eslint-enable no-unused-vars*/

export default AbstractService;
