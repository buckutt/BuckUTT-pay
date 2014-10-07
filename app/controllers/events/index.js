// Pay - /app/controllers/events/index.js

// Events controller

'use strict';

var getAll = require('./getAll');
var create = require('./create');

module.exports = function (db) {
    return {
        getAll: getAll(db),
        create: create(db)
    };
};
