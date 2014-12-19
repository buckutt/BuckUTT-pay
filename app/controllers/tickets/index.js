// Pay - /app/controllers/tickets/index.js

// Tickets controller

'use strict';

module.exports = function (db) {
    return {
        getAll: require('./getAll')(db),
        getAllFromEvent: require('./getAllFromEvent')(db)
    };
};
