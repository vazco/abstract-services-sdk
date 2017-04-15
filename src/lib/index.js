import {randomString, shuffleProps} from './helpers';
import NodeRSA from 'node-rsa';
import AbstractService from './AbstractService';
import SdkError from './SdkError';

export class AbstractServicesSDK {
    constructor ({url, appId, publicKeyString = '', ServiceClasses = {}}) {
        this._appId = appId;
        this._url = url;
        if (publicKeyString) {
            if (publicKeyString.indexOf('-----BEGIN PUBLIC KEY-----') === 0) {
                const key = new NodeRSA();
                key.importKey(publicKeyString, 'pkcs8-public');
                this._publicKey = key;
            } else {
                throw new TypeError('Expected public key in pkcs8 format');
            }
        }
        this._serviceClasses = ServiceClasses;
        this._services = {};
        this._tokenGetters = {};
    }

    generateWebToken ({userId = '', groupId = '', sessionId = '', hash = '', ttl = 86400, adminKey = ''} = {}) {
        if (!this._publicKey) {
            throw new Error('Generation of tokens is not available for current instance,' +
                ' probably you should generate token on server side or publicKeyString was not provided');
        }
        const credentials = {
            _: randomString(),
            t: parseInt(Date.now()/1000)
        };

        if (ttl) {
            credentials.e = parseInt(ttl)||0;
        }

        if (userId) {
            credentials.u = userId;
        }

        if (sessionId) {
            credentials.s = sessionId;
        }

        if (hash) {
            credentials.h = hash;
        }

        if (adminKey) {
            credentials.a = adminKey;
        }

        if (groupId) {
            credentials.g = groupId;
        }

        return this._publicKey.encrypt(JSON.stringify(shuffleProps(credentials)), 'base64');
    }

    /**
     * Sets token for authentication, token you can generate from SDK.generateWebToken
     * @param {string|function} token or token getter, which returns promise.
     * @param {string} serviceName sets token for given service or for all as a default.
     * @returns {undefined}
     */
    setToken (token, serviceName = 'default') {
        if (typeof token === 'function') {
            this._tokenGetters[serviceName] = token;
            return;
        }
        this._tokenGetters[serviceName] = () => token;
        if (this._services) {
            Object.keys(this._services).forEach(name => this._updateTokenForService(name));
        }
    }

    _updateTokenForService (name) {
        if (this._tokenGetters[name]) {
            this._services[name].setToken(this._tokenGetters[name]);
        } else if (this._tokenGetters['default']) {
            this._services[name].setToken(this._tokenGetters['default']);
        }
    }

    async getService (name) {
        if (!this._services[name]) {
            if (!this._serviceClasses[name]) {
                throw new Error('Missing service under name: '+name);
            }
            this._services[name] = new this._serviceClasses[name]({
                serviceName: name,
                appId: this._appId,
                baseURL: this._url
            });
        }
        this._updateTokenForService(name);
        return this._services[name];
    }
}

export {AbstractService, SdkError};

export default AbstractServicesSDK;

