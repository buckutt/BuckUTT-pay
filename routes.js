// Pay - routes.js

// Routing

var tickets = require('./tickets/index.js');

module.exports.createOn = function (app) {
    app.get('/tickets/get', tickets.get);
};