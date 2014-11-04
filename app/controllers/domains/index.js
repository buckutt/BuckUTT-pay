// Pay - /app/controllers/domains/index.js

// Events controller

'use strict';

var getAll = require('./getAll');
var remove = require('./remove');
var create = require('./create');

module.exports = function (db, config) {
    return {
        getAll: getAll(db, config),
        remove: remove(db, config),
        create: create(db, config)
    };
};
