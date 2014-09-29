// Pay - /app/controllers/tickets/index.js

// Tickets controller

'use strict';

var getAll = require('./getAll');

module.exports = function (db) {
    return {
        getAll: getAll(db)
    };
};
