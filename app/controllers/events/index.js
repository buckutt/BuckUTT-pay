// Pay - /app/controllers/events/index.js

// Events controller

'use strict';

var get = require('./get');

module.exports = function (db) {
    return {
        get: get(db)
    };
};
