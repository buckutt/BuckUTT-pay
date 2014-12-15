// Pay - server.js

// Main app file

'use strict';

// JS Date -> MySQL DateTime
Date.prototype.toDateTime = function () {
    return this.toISOString().slice(0, 19).replace('T', ' ');
};

// Extends Number to check if a string is a positive number
Number.isPositiveNumeric = function (str) {
    var n = ~~Number(str);
    return String(n) === str && n >= 0;
};
