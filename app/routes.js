// Pay - /app:routes.js

// Routing

'use strict';

module.exports = function (router, db) {
    var controllers = require('./controllers')(db);

    router.get('/tickets/get', controllers.tickets.get);
    router.get('/events/get', controllers.events.get);
};
