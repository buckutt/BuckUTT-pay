//////////////////////////
// Utils functions file //
//////////////////////////

'use strict';

/**
 * JS Date -> MySQL DateTime
 * @return {string} SQL compliant datetime
 */
Date.prototype.toDateTime = function () {
    return this.toISOString().slice(0, 19).replace('T', ' ');
};

/**
 * Returns true if the given string is a positive number
 * @param  {string}  The string to test
 * @return {boolean} true if the given string is a positive number
 */
Number.isPositiveNumeric = function (n) {
    var floatN = parseFloat(n);
    return !isNaN(floatN) && isFinite(n) && floatN > 0 && floatN % 1 == 0;
};

/**
 * Capitalize a name correctly
 * @return {string} Name with every part capitalized
 */
String.prototype.nameCapitalize = function () {
    return this.toLowerCase().replace(/(^|[\s'-])([a-z])/g, function (m, p1, p2) {
        return p1 + p2.toUpperCase();
    });
};

/**
 * Ensures that the numeric is two-characters long
 * Else adds a trailing 0
 * @return {string}     The padded number
 */
Number.prototype.pad2 = function (nu) {
    return (this < 10) ? '0' + this : '' + this;
};

/**
 * Generates a random string, alpha-numeric
 * @param  {number} size The string size
 * @return {string}      The random string
 */
String.random = function (size) {
    var crypto = require('crypto');
    var b64 = crypto.randomBytes(size).toString('base64');
    b64 = b64.replace(/=/g, '')
             .replace(/\+/g, '')
             .replace(/\//g, '');

    return b64.slice(0, size);
};
