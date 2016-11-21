'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.AbstractService = undefined;

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _axios = require('axios');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var AbstractService = exports.AbstractService = function (_Axios) {
    (0, _inherits3.default)(AbstractService, _Axios);

    function AbstractService(_ref) {
        var appId = _ref.appId,
            baseURL = _ref.baseURL,
            serviceName = _ref.serviceName;
        (0, _classCallCheck3.default)(this, AbstractService);

        var headers = {
            'x-app-id': appId
        };

        var _this = (0, _possibleConstructorReturn3.default)(this, (AbstractService.__proto__ || (0, _getPrototypeOf2.default)(AbstractService)).call(this, { headers: headers, baseURL: baseURL.replace(/\/+$/, '') + '/' + serviceName, url: '' }));

        _this._appId = appId;
        _this._serviceName = serviceName;
        return _this;
    }

    /**
     * sets token for authentication, token you can generate from SDK.generateWebToken
     * @param {string} token
     */


    (0, _createClass3.default)(AbstractService, [{
        key: 'setToken',
        value: function setToken(token) {
            this.defaults.headers['x-app-token'] = token;
        }

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
    }]);
    return AbstractService;
}(_axios.Axios);

exports.default = AbstractService;