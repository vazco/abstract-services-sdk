'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.AbstractService = exports.AbstractServicesSDK = undefined;

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

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
        this._tokenGetters = {};
    }

    (0, _createClass3.default)(AbstractServicesSDK, [{
        key: 'generateWebToken',
        value: function generateWebToken() {
            var _ref2 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
                _ref2$userId = _ref2.userId,
                userId = _ref2$userId === undefined ? '' : _ref2$userId,
                _ref2$groupId = _ref2.groupId,
                groupId = _ref2$groupId === undefined ? '' : _ref2$groupId,
                _ref2$sessionId = _ref2.sessionId,
                sessionId = _ref2$sessionId === undefined ? '' : _ref2$sessionId,
                _ref2$hash = _ref2.hash,
                hash = _ref2$hash === undefined ? '' : _ref2$hash,
                _ref2$ttl = _ref2.ttl,
                ttl = _ref2$ttl === undefined ? 86400 : _ref2$ttl;

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

            if (hash) {
                credentials.h = hash;
            }

            if (groupId) {
                credentials.g = groupId;
            }

            var result = _crypticoJs2.default.encrypt((0, _stringify2.default)((0, _helpers.shuffleProps)(credentials)), this._publicKeyString);
            if (result.status !== 'success') {
                throw new Error('Encryption failure');
            }

            return result.cipher;
        }

        /**
         * Sets token for authentication, token you can generate from SDK.generateWebToken
         * @param {string|function} token or token getter, which returns promise.
         * @param {string} serviceName sets token for given service or for all as a default.
         * @returns {undefined}
         */

    }, {
        key: 'setToken',
        value: function setToken(token) {
            var _this = this;

            var serviceName = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'default';

            if (typeof token === 'function') {
                this._tokenGetters[serviceName] = token;
                return;
            }
            this._tokenGetters[serviceName] = function () {
                return token;
            };
            if (this._services) {
                (0, _keys2.default)(this._services).forEach(function (name) {
                    return _this._updateTokenForService(name);
                });
            }
        }
    }, {
        key: '_updateTokenForService',
        value: function _updateTokenForService(name) {
            if (this._tokenGetters[name]) {
                this._services[name].setToken(this._tokenGetters[name]);
            } else if (this._tokenGetters['default']) {
                this._services[name].setToken(this._tokenGetters['default']);
            }
        }
    }, {
        key: 'getService',
        value: function () {
            var _ref3 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(name) {
                return _regenerator2.default.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                if (this._services[name]) {
                                    _context.next = 4;
                                    break;
                                }

                                if (this._serviceClasses[name]) {
                                    _context.next = 3;
                                    break;
                                }

                                throw new Error('Missing service under name: ' + name);

                            case 3:
                                this._services[name] = new this._serviceClasses[name]({
                                    serviceName: name,
                                    appId: this._appId,
                                    baseURL: this._url
                                });

                            case 4:
                                this._updateTokenForService(name);
                                return _context.abrupt('return', this._services[name]);

                            case 6:
                            case 'end':
                                return _context.stop();
                        }
                    }
                }, _callee, this);
            }));

            function getService(_x3) {
                return _ref3.apply(this, arguments);
            }

            return getService;
        }()
    }]);
    return AbstractServicesSDK;
}();

exports.AbstractService = _AbstractService2.default;
exports.default = AbstractServicesSDK;