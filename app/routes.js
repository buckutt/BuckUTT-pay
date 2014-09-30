// Pay - /app:routes.js

// Routing

'use strict';

module.exports = function (router, db, config) {
    var controllers = require('./controllers')(db, config);

    router.get( '/tickets', controllers.tickets.getAll);
    router.get( '/events',  controllers.events.getAll);
    router.post('/authEtu', controllers.etu);
};
