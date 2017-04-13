import {expect, should as shouldFN} from 'chai';
import AbstractServicesSDK from '../lib/index';
import AbstractService from '../lib/AbstractService';
import cryptico from 'cryptico-js';
const {describe, it} = global;
const rsaKey = cryptico.generateRSAKey('rsaKey', 512);
const pubKeyString = cryptico.publicKeyString(rsaKey);
const should = shouldFN();

class TestService extends AbstractService {
    setTestAdapter (fn) {
        this.defaults.adapter = fn;
    }
}

const DEFAULT_TOKEN_PARAMS = {
    userId: 'u123',
    sessionId: 's1',
    hash: 'abc',
    groupId: 'g12',
    adminKey: 'ttt'
};
const SERVICE_NAME = 'testService';
const HOST_URL = 'http://test';
const APP_ID = 'testAppId';

class TestSDK extends AbstractServicesSDK {
    constructor ({url, appId, publicKeyString}) {
        super({url, appId, publicKeyString, ServiceClasses: {
            [SERVICE_NAME]: TestService
        }});
    }
}

describe('AbstractServicesSDK', () => {
    const testSDK = new TestSDK({url: HOST_URL, appId: 'testAppId', publicKeyString: pubKeyString});

    it('if we generate correct web token', () => {
        const token = testSDK.generateWebToken(DEFAULT_TOKEN_PARAMS);
        token.should.be.a('string');
        const decryptedToken = cryptico.decrypt(token, rsaKey);
        decryptedToken.should.be.an('object');
        decryptedToken.plaintext.should.be.a('string');
        expect(decryptedToken.status).to.be.equal('success');
        const decrypted = JSON.parse(decryptedToken.plaintext);
        Object.keys(DEFAULT_TOKEN_PARAMS).forEach(key => {
            expect(decrypted[key[0]], `token key [${key}]`).to.be.equal(DEFAULT_TOKEN_PARAMS[key]);
        });
        decrypted._.should.be.a('string');
        decrypted.e.should.be.a('number');
    });

    it('generated tokens are different', () => {
        expect(testSDK.generateWebToken(DEFAULT_TOKEN_PARAMS)).to.not
            .equal(testSDK.generateWebToken(DEFAULT_TOKEN_PARAMS));
    });

    it('token cannot be readable with wrong private key', () => {
        const token = testSDK.generateWebToken(DEFAULT_TOKEN_PARAMS);
        token.should.be.a('string');
        const decryptedToken = cryptico.decrypt(token, cryptico.generateRSAKey('badKey', 512));
        decryptedToken.should.be.an('object');
        expect(decryptedToken.status).to.be.equal('failure');
        should.not.exist(decryptedToken.plaintext);
    });
});

describe('AbstractService', () => {
    const testSDK = new TestSDK({url: 'http://test', appId: 'testAppId', publicKeyString: pubKeyString});
    const token1 = testSDK.generateWebToken(DEFAULT_TOKEN_PARAMS);
    const token2 = testSDK.generateWebToken(DEFAULT_TOKEN_PARAMS);

    it('getting a service', async () => {
        const testService = await testSDK.getService('testService');
        testService.should.be.instanceOf(TestService);
        expect(testService).to.be.equal(await testSDK.getService('testService'));
        [
            'getServiceName',
            'getAppId',
            'getBaseURL',
            '_getToken',
            'setToken',
            'request',
            'get',
            'head',
            'delete',
            'post',
            'put',
            'patch'
        ].forEach(fName => expect(testService[fName], `Method [${fName}]`).to.be.a('function'));
        should.exist(testService.defaults.headers);
        expect(testService.getServiceName()).to.be.equal(SERVICE_NAME);
        expect(testService.getAppId()).to.be.equal(APP_ID);
        expect(testService.getBaseURL()).to.be.equal(HOST_URL + '/' + SERVICE_NAME);
    });

    it('auth headers', async () => {
        const testService = await testSDK.getService('testService');
        testService.setToken(token2);
        testService.setTestAdapter(cfg => {
            cfg.headers.should.be.an('object');
            expect(cfg.headers).to.include.keys('x-app-id', 'x-app-token');
            expect(cfg.headers['x-app-id']).to.be.equal(APP_ID);
            expect(cfg.headers['x-app-token']).to.be.equal(token2);
            expect(cfg.headers['x-app-token']).to.not.equal(token1);
            return Promise.resolve(cfg);
        });
        await testService.request({});
    });

    it('auth headers - getter with promise', async () => {
        const testService = await testSDK.getService('testService');
        testService.setToken(() => Promise.resolve(token1));
        testService.setTestAdapter(cfg => {
            expect(cfg.headers['x-app-token']).to.be.equal(token1);
            expect(cfg.headers['x-app-token']).to.not.equal(token2);
            return Promise.resolve(cfg);
        });
        await testService.request({});
        testService.setToken(() => Promise.resolve(token2));
        testService.setTestAdapter(cfg => {
            expect(cfg.headers['x-app-token']).to.be.equal(token2);
            expect(cfg.headers['x-app-token']).to.not.equal(token1);
            return Promise.resolve(cfg);
        });
        await testService.request({});
    });
});
