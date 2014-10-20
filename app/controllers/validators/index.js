// Pay - /app/controllers/validators/index.js

// Validators regroupment file

'use strict';

var createEvent = require('./createEvent');
var editEvent   = require('./editEvent');
var searchUsers = require('./searchUsers');

module.exports = {
    createEvent: createEvent,
    editEvent: editEvent,
    searchUsers: searchUsers
};
