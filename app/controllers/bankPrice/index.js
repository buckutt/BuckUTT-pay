// Pay - /app/controllers/bankPrice/index.js

// BankPrice controller

'use strict';

var edit = require('./edit');
var get  = require('./get');

module.exports = function (db, config) {
    return {
        edit: edit(db, config),
        get: get(db, config)
    };
};
