import {expect, should as shouldFN} from 'chai';
import AbstractServicesSDK from '../lib/index';
import AbstractService from '../lib/AbstractService';
import NodeRSA from 'node-rsa';
const {describe, it} = global;
const rsaKey = new NodeRSA({b: 512});
const pubKeyString = rsaKey.exportKey('pkcs8-public');
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
        const decryptedToken = rsaKey.decrypt(token, 'utf8');
        decryptedToken.should.be.a('string');
        const decrypted = JSON.parse(decryptedToken);
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
        const badKey = new NodeRSA({b: 512});
        let decryptedToken, error;
        try {
            decryptedToken = badKey.decrypt(token, 'utf8');
        } catch (err) {
            error = err;
        }
        expect(error).to.be.an('error');
        expect(decryptedToken).to.not.be.an('string');
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
        expect(testService.getBaseURL()).to.be.equal(HOST_URL + '/' + APP_ID + '/' + SERVICE_NAME);
    });

    it('authorization headers', async () => {
        const testService = await testSDK.getService('testService');
        testService.setToken(token2);
        testService.setTestAdapter(cfg => {
            cfg.headers.should.be.an('object');
            const headers = {};
            Object.keys(cfg.headers).forEach(k => headers[k.toLowerCase()] = cfg.headers[k]);
            expect(headers).to.include.keys('authorization');
            expect(headers['authorization']).to.be.equal('Bearer ' + token2);
            expect(headers['authorization']).to.not.equal('Bearer ' + token1);
            return Promise.resolve(cfg);
        });
        await testService.request({});
    });

    it('authorization headers - getter with promise', async () => {
        const testService = await testSDK.getService('testService');
        testService.setToken(() => Promise.resolve(token2));
        testService.setTestAdapter(cfg => {
            cfg.headers.should.be.an('object');
            const headers = {};
            Object.keys(cfg.headers).forEach(k => headers[k.toLowerCase()] = cfg.headers[k]);
            expect(headers['authorization']).to.be.equal('Bearer ' + token2);
            expect(headers['authorization']).to.not.equal('Bearer ' + token1);
            return Promise.resolve(cfg);
        });
        await testService.request({});
    });

    it('custom headers', async () => {
        const testService = await testSDK.getService('testService');
        testService._authByCustomHeader = true;
        testService.setToken(token2);
        testService.setTestAdapter(cfg => {
            cfg.headers.should.be.an('object');
            const headers = {};
            Object.keys(cfg.headers).forEach(k => headers[k.toLowerCase()] = cfg.headers[k]);
            expect(headers).to.include.keys('x-app-id', 'x-app-token');
            expect(headers['x-app-id']).to.be.equal(APP_ID);
            expect(headers['x-app-token']).to.be.equal(token2);
            expect(headers['x-app-token']).to.not.equal(token1);
            return Promise.resolve(cfg);
        });
        await testService.request({});
    });


    it('custom auth headers - getter with promise', async () => {
        const testService = await testSDK.getService('testService');
        testService._authByCustomHeader = true;
        testService.setToken(() => Promise.resolve(token1));
        testService.setTestAdapter(cfg => {
            cfg.headers.should.be.an('object');
            const headers = {};
            Object.keys(cfg.headers).forEach(k => headers[k.toLowerCase()] = cfg.headers[k]);
            expect(headers['x-app-token']).to.be.equal(token1);
            expect(headers['x-app-token']).to.not.equal(token2);
            return Promise.resolve(cfg);
        });
        await testService.request({});
        testService._authByCustomHeader = true;
        testService.setToken(() => Promise.resolve(token2));
        testService.setTestAdapter(cfg => {
            cfg.headers.should.be.an('object');
            const headers = {};
            Object.keys(cfg.headers).forEach(k => headers[k.toLowerCase()] = cfg.headers[k]);
            expect(headers['x-app-token']).to.be.equal(token2);
            expect(headers['x-app-token']).to.not.equal(token1);
            return Promise.resolve(cfg);
        });
        await testService.request({});
    });

});
