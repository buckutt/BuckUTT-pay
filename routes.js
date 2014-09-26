// Pay - routes.js

// Routing
'use strict';

var tickets = require('./tickets');

module.exports.createOn = function (app) {
    app.get('/tickets/get', tickets.get);
};