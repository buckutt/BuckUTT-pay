// Pay - /app/controllers/events/index.js

// Events controller

'use strict';

var getAll = require('./getAll');

module.exports = function (db) {
    return {
        getAll: getAll(db)
    };
};
