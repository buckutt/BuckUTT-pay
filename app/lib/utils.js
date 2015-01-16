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
 * @param  {string} The string to test
 * @return {boolean} true if the given string is a positive number
 */
Number.isPositiveNumeric = function (str) {
    var n = ~~Number(str);
    return String(n) === str && n >= 0;
};
