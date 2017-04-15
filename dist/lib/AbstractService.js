'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.AbstractService = undefined;

var _typeof2 = require('babel-runtime/helpers/typeof');

var _typeof3 = _interopRequireDefault(_typeof2);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _get2 = require('babel-runtime/helpers/get');

var _get3 = _interopRequireDefault(_get2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _axios = require('axios');

var _defaults = require('axios/lib/defaults');

var _defaults2 = _interopRequireDefault(_defaults);

var _ejson = require('ejson');

var _ejson2 = _interopRequireDefault(_ejson);

var _SdkError = require('./SdkError');

var _SdkError2 = _interopRequireDefault(_SdkError);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _ref = typeof window !== 'undefined' ? require('binaryjs-client') : require('binaryjs'),
    BinaryClient = _ref.BinaryClient;

var AbstractService = exports.AbstractService = function (_Axios) {
    (0, _inherits3.default)(AbstractService, _Axios);

    function AbstractService(_ref2) {
        var appId = _ref2.appId,
            baseURL = _ref2.baseURL,
            serviceName = _ref2.serviceName,
            _ref2$authByCustomHea = _ref2.authByCustomHeader,
            authByCustomHeader = _ref2$authByCustomHea === undefined ? false : _ref2$authByCustomHea,
            _ref2$headers = _ref2.headers,
            headers = _ref2$headers === undefined ? {} : _ref2$headers;
        (0, _classCallCheck3.default)(this, AbstractService);

        var _this = (0, _possibleConstructorReturn3.default)(this, (AbstractService.__proto__ || (0, _getPrototypeOf2.default)(AbstractService)).call(this, { baseURL: baseURL.replace(/\/+$/, '') + '/' + appId + '/' + serviceName, url: '', headers: headers }));

        _this._appId = appId;
        _this._serviceName = serviceName;
        _this._socketURL = baseURL.replace(/^http/, 'ws').replace(/\/+$/, '') + '/socket';
        _this._authByCustomHeader = authByCustomHeader;
        return _this;
    }

    /**
     * Sets token for authentication, token you can generate from SDK.generateWebToken
     * @param {string|function} token or token getter, which returns promise.
     * @returns {undefined}
     */


    (0, _createClass3.default)(AbstractService, [{
        key: 'setToken',
        value: function setToken(token) {
            if (typeof token === 'function') {
                this._tokenGetter = token;
                return;
            }
            this._token = token;
        }
    }, {
        key: '_getToken',
        value: function () {
            var _ref3 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(config) {
                var token;
                return _regenerator2.default.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                if (!this._tokenGetter) {
                                    _context.next = 8;
                                    break;
                                }

                                token = this._tokenGetter(config);

                                if (!token) {
                                    _context.next = 8;
                                    break;
                                }

                                if (!token.then) {
                                    _context.next = 7;
                                    break;
                                }

                                _context.next = 6;
                                return token;

                            case 6:
                                return _context.abrupt('return', _context.sent);

                            case 7:
                                return _context.abrupt('return', token);

                            case 8:
                                return _context.abrupt('return', this._token);

                            case 9:
                            case 'end':
                                return _context.stop();
                        }
                    }
                }, _callee, this);
            }));

            function _getToken(_x) {
                return _ref3.apply(this, arguments);
            }

            return _getToken;
        }()
    }, {
        key: 'request',
        value: function () {
            var _ref4 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee3(config) {
                var _this2 = this;

                var adapter, res;
                return _regenerator2.default.wrap(function _callee3$(_context3) {
                    while (1) {
                        switch (_context3.prev = _context3.next) {
                            case 0:
                                config = config || {};
                                adapter = config.adapter || this.defaults.adapter || _defaults2.default.adapter;

                                config.adapter = function () {
                                    var _ref5 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2(conf) {
                                        var token;
                                        return _regenerator2.default.wrap(function _callee2$(_context2) {
                                            while (1) {
                                                switch (_context2.prev = _context2.next) {
                                                    case 0:
                                                        _context2.next = 2;
                                                        return _this2._getToken(conf);

                                                    case 2:
                                                        token = _context2.sent;

                                                        if (_this2._authByCustomHeader || conf.authByCustomHeader || config.auth) {
                                                            conf.headers = (0, _assign2.default)(conf.headers, {
                                                                'x-app-id': _this2.getAppId(),
                                                                'x-app-token': token
                                                            });
                                                        } else {
                                                            conf.headers = (0, _assign2.default)(conf.headers, {
                                                                'Authorization': 'Bearer ' + token
                                                            });
                                                        }
                                                        _context2.next = 6;
                                                        return adapter(conf);

                                                    case 6:
                                                        return _context2.abrupt('return', _context2.sent);

                                                    case 7:
                                                    case 'end':
                                                        return _context2.stop();
                                                }
                                            }
                                        }, _callee2, _this2);
                                    }));

                                    return function (_x3) {
                                        return _ref5.apply(this, arguments);
                                    };
                                }();

                                _context3.prev = 3;
                                _context3.next = 6;
                                return (0, _get3.default)(AbstractService.prototype.__proto__ || (0, _getPrototypeOf2.default)(AbstractService.prototype), 'request', this).call(this, config);

                            case 6:
                                res = _context3.sent;

                                _SdkError2.default.validateStatus(res.status, res.statusText);
                                return _context3.abrupt('return', res);

                            case 11:
                                _context3.prev = 11;
                                _context3.t0 = _context3['catch'](3);

                                _SdkError2.default.extendError(_context3.t0, true);

                            case 14:
                            case 'end':
                                return _context3.stop();
                        }
                    }
                }, _callee3, this, [[3, 11]]);
            }));

            function request(_x2) {
                return _ref4.apply(this, arguments);
            }

            return request;
        }()

        /**
         * Id of current app
         * @returns {string} id
         */

    }, {
        key: 'getAppId',
        value: function getAppId() {
            return this._appId;
        }

        /**
         * The url to service
         * @returns {string} url
         */

    }, {
        key: 'getBaseURL',
        value: function getBaseURL() {
            return this['defaults'].baseURL || '';
        }

        /**
         * Name of this service
         * @returns {string} name
         */

    }, {
        key: 'getServiceName',
        value: function getServiceName() {
            return this._serviceName;
        }

        /**
         * Performing a GET request
         * @param {Object} config The config specific for this request (merged with this.defaults)
         * @returns {Promise} promise of response
         */

    }, {
        key: 'get',
        value: function get() {
            var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

            return this.request((0, _assign2.default)(config, { method: 'get' }));
        }

        /**
         * Performing a Delete request
         * @param {Object} config The config specific for this request (merged with this.defaults)
         * @returns {Promise} promise of response
         */

    }, {
        key: 'delete',
        value: function _delete() {
            var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

            return this.request((0, _assign2.default)(config, { method: 'delete' }));
        }

        /**
         * Performing a Head request
         * @param {Object} config The config specific for this request (merged with this.defaults)
         * @returns {Promise} promise of response
         */

    }, {
        key: 'head',
        value: function head() {
            var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

            return this.request((0, _assign2.default)(config, { method: 'head' }));
        }

        /**
         * Performing a POST request
         * @param {*} data is the data to be sent as the request body
         * @param {Object} config The config specific for this request (merged with this.defaults)
         * @returns {Promise} promise of response
         */

    }, {
        key: 'post',
        value: function post(data) {
            var config = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

            return this.request((0, _assign2.default)(config, { method: 'post', data: data }));
        }

        /**
         * Performing a PUT request
         * @param {*} data is the data to be sent as the request body
         * @param {Object} config The config specific for this request (merged with this.defaults)
         * @returns {Promise} promise of response
         */

    }, {
        key: 'put',
        value: function put(data) {
            var config = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

            return this.request((0, _assign2.default)(config, { method: 'put', data: data }));
        }

        /**
         * Performing a Patch request
         * @param {*} data is the data to be sent as the request body
         * @param {Object} config The config specific for this request (merged with this.defaults)
         * @returns {Promise} promise of response
         */

    }, {
        key: 'patch',
        value: function patch(data) {
            var config = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

            return this.request((0, _assign2.default)(config, { method: 'patch', data: data }));
        }
    }, {
        key: 'sendStream',
        value: function () {
            var _ref6 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee4() {
                var _this3 = this;

                var onStream = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : function () {};
                var config = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
                var token;
                return _regenerator2.default.wrap(function _callee4$(_context4) {
                    while (1) {
                        switch (_context4.prev = _context4.next) {
                            case 0:
                                _context4.next = 2;
                                return this._getToken(config);

                            case 2:
                                token = _context4.sent;
                                return _context4.abrupt('return', new _promise2.default(function (resolve, reject) {
                                    var client = new BinaryClient(_this3._socketURL);
                                    var isResolved = false;
                                    var done = function done() {
                                        if (!isResolved) {
                                            resolve.apply(undefined, arguments);
                                            client.close();
                                        }
                                        isResolved = true;
                                    };
                                    var fail = function fail() {
                                        if (!isResolved) {
                                            reject.apply(undefined, arguments);
                                            client.close();
                                        }
                                    };
                                    client.on('open', function () {
                                        var streamSoc = client.createStream((0, _assign2.default)({
                                            serviceName: _this3.getServiceName(),
                                            appId: _this3.getAppId(),
                                            appToken: token
                                        }, config && config.data || {}));
                                        var _onData = streamSoc._onData.bind(streamSoc);
                                        streamSoc._onData = function (data) {
                                            if ((typeof data === 'undefined' ? 'undefined' : (0, _typeof3.default)(data)) === 'object' && !_ejson2.default.isBinary(data)) {
                                                return _onData(_ejson2.default.fromJSONValue(data));
                                            }
                                            return _onData(data);
                                        };
                                        onStream(streamSoc, client);
                                        streamSoc.on('error', function (err) {
                                            return fail(err);
                                        });
                                        streamSoc.on('close', done);
                                    });
                                    client.on('error', function (err) {
                                        return fail(err);
                                    });
                                }));

                            case 4:
                            case 'end':
                                return _context4.stop();
                        }
                    }
                }, _callee4, this);
            }));

            function sendStream() {
                return _ref6.apply(this, arguments);
            }

            return sendStream;
        }()
    }]);
    return AbstractService;
}(_axios.Axios);
/*eslint-disable no-unused-vars*/


_defaults2.default.transformResponse = [function transformResponse(data) {
    /*eslint no-param-reassign:0*/
    if (typeof data === 'string') {
        try {
            data = _ejson2.default.parse(data);
        } catch (e) {/* Ignore */}
    }
    return data;
}];
/*eslint-enable no-unused-vars*/

exports.default = AbstractService;