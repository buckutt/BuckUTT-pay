// Pay - /app:routes.js

// Routing

'use strict';

module.exports = function (router, db) {
    var controllers = require('./controllers')(db);

    router.get('/tickets', controllers.tickets.getAll);
    router.get('/events', controllers.events.getAll);
};
