// Pay - /app/controllers/accounts/index.js

// Accounts controller

'use strict';

var create = require('./create');
var getAll = require('./getAll');

module.exports = function (db, config) {
    return {
        create: create(db, config),
        getAll: getAll(db, config)
    };
};
