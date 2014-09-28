// Pay - /app:routes.js

// Routing

'use strict';

var controllers = require('./controllers');

module.exports = function (app) {
    app.get('/tickets/get', controllers.tickets.get);
};
