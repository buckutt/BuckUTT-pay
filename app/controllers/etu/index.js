// Pay - /app/controllers/etu/index.js

// Etus controller

'use strict';

var auth = require('./auth');
var searchUsers = require('./searchUsers');

module.exports = function (db, config) {
    return {
        auth: auth(db, config),
        searchUsers: searchUsers(db, config)
    };
};
