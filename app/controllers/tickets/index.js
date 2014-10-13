// Pay - /app/controllers/tickets/index.js

// Tickets controller

'use strict';

var getAll = require('./getAll');
var getAllFromEvent = require('./getAllFromEvent');

module.exports = function (db) {
    return {
        getAll: getAll(db),
        getAllFromEvent: getAllFromEvent(db)
    };
};
