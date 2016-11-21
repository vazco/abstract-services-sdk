'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.AbstractService = exports.AbstractServicesSDK = undefined;

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _helpers = require('./helpers');

var _crypticoJs = require('cryptico-js');

var _crypticoJs2 = _interopRequireDefault(_crypticoJs);

var _AbstractService = require('./AbstractService');

var _AbstractService2 = _interopRequireDefault(_AbstractService);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var AbstractServicesSDK = exports.AbstractServicesSDK = function () {
    function AbstractServicesSDK(_ref) {
        var url = _ref.url,
            appId = _ref.appId,
            _ref$publicKeyString = _ref.publicKeyString,
            publicKeyString = _ref$publicKeyString === undefined ? '' : _ref$publicKeyString,
            _ref$ServiceClasses = _ref.ServiceClasses,
            ServiceClasses = _ref$ServiceClasses === undefined ? {} : _ref$ServiceClasses;
        (0, _classCallCheck3.default)(this, AbstractServicesSDK);

        this._appId = appId;
        this._url = url;
        this._publicKeyString = publicKeyString;
        this._serviceClasses = ServiceClasses;
        this._services = {};
    }

    (0, _createClass3.default)(AbstractServicesSDK, [{
        key: 'generateWebToken',
        value: function generateWebToken() {
            var userId = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
            var sessionId = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
            var ttl = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 86400;

            if (!this._publicKeyString) {
                throw new Error('Generation of tokens is not available for current instance,' + ' probably you should generate token on server side or publicKeyString was not provided');
            }
            var credentials = {
                _: (0, _helpers.randomString)(),
                t: parseInt(Date.now() / 1000)
            };

            if (ttl) {
                credentials.e = parseInt(ttl) || 0;
            }

            if (userId) {
                credentials.u = userId;
            }

            if (sessionId) {
                credentials.s = sessionId;
            }

            var result = _crypticoJs2.default.encrypt((0, _stringify2.default)((0, _helpers.shuffleProps)(credentials)), this._publicKeyString);
            if (result.status !== 'success') {
                throw new Error('Encryption failure');
            }

            return result.cipher;
        }
    }, {
        key: 'getService',
        value: function getService(name) {
            if (!this._services[name]) {
                if (!this._serviceClasses[name]) {
                    throw new Error('Missing service under name: ' + name);
                }
                this._services[name] = new this._serviceClasses[name]({
                    serviceName: name,
                    appId: this._appId,
                    baseURL: this._url
                });
            }
            return this._services[name];
        }
    }]);
    return AbstractServicesSDK;
}();

exports.AbstractService = _AbstractService2.default;
exports.default = AbstractServicesSDK;