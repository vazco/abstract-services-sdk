import {randomString, shuffleProps} from './helpers';
import cryptico from 'cryptico-js';
import AbstractService from './AbstractService';

export class AbstractServicesSDK {
    constructor ({url, appId, publicKeyString = '', ServiceClasses = {}}) {
        this._appId = appId;
        this._url = url;
        this._publicKeyString = publicKeyString;
        this._serviceClasses = ServiceClasses;
        this._services = {};
    }

    generateWebToken (userId = '', sessionId = '', ttl = 86400) {
        if (!this._publicKeyString) {
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

        const result = cryptico.encrypt(JSON.stringify(shuffleProps(credentials)), this._publicKeyString);
        if (result.status !== 'success') {
            throw new Error('Encryption failure');
        }

        return result.cipher;
    }

    getService (name) {
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
        return this._services[name];
    }
}

export {AbstractService};

export default AbstractServicesSDK;

