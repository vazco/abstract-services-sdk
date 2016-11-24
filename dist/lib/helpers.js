'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

exports.randomString = randomString;
exports.shuffleProps = shuffleProps;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz';

function randomString() {
    var stringLength = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 5;

    var randomString = '';
    for (var i = 0; i < stringLength; i++) {
        var rnum = Math.floor(Math.random() * chars.length);
        randomString += chars.substring(rnum, rnum + 1);
    }
    return randomString;
}

function shuffleProps(obj) {
    var result = {};
    var keysOrder = (0, _keys2.default)(obj).sort(function (a, b) {
        return Math.random() - 0.5;
    });
    keysOrder.forEach(function (key) {
        return result[key] = obj[key];
    });
    return result;
}