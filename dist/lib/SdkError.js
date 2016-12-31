'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.SdkError = undefined;

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

exports.validateStatus = validateStatus;
exports.extendError = extendError;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var SdkError = exports.SdkError = function (_Error) {
    (0, _inherits3.default)(SdkError, _Error);

    function SdkError(code, message) {
        (0, _classCallCheck3.default)(this, SdkError);

        var _this = (0, _possibleConstructorReturn3.default)(this, (SdkError.__proto__ || (0, _getPrototypeOf2.default)(SdkError)).call(this, message));

        _this.name = 'Action unsuccessful [' + code + ']';
        _this.code = code;
        return _this;
    }

    return SdkError;
}(Error);

function validateStatus(status, message) {
    if (!status || status < 300) {
        return;
    }
    throw new SdkError(status, message);
}

function extendError(err) {
    var shouldThrow = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

    var response = err.response || { statusText: err.message, status: err.code || 500 };
    var e = new SdkError(response.status, response.statusText || err.message);
    (0, _assign2.default)(e, err, { message: response.statusText || err.message });
    if (shouldThrow) {
        throw e;
    }
    return e;
}

SdkError.validateStatus = validateStatus;
SdkError.extendError = extendError;

exports.default = SdkError;