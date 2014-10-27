// Pay - /app/controllers/validators/index.js

// Validators regroupment file

'use strict';

var createEvent = require('./createEvent');
var editEvent   = require('./editEvent');
var etuAuth     = require('./etuAuth');

module.exports = {
    createEvent: createEvent,
    editEvent: editEvent,
    etuAuth: etuAuth
};
