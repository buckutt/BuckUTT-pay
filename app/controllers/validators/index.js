// Pay - /app/controllers/validators/index.js

// Validators regroupment file

'use strict';

var createEvent = require('./createEvent');
var editEvent   = require('./editEvent');

module.exports = {
    createEvent: createEvent,
    editEvent: editEvent
};
