// Pay - /app/controllers/validators/index.js

// Validators regroupment file

'use strict';

var createEvent = require('./createEvent');
var editEvent   = require('./editEvent');
var createPrice = require('./createPrice');
var editPrice   = require('./editPrice');
var etuAuth     = require('./etuAuth');

module.exports = {
    createEvent: createEvent,
    editEvent: editEvent,
    createPrice: createPrice,
    editPrice: editPrice,
    etuAuth: etuAuth
};
