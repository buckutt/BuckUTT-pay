// Pay - /app/controllers/validators/createEvent.js

// Tickets creator form validatior

'use strict';

var form  = require('express-form');
var field = form.field;

module.exports = form(
    field('name')
        .trim()
        .required()
        .is(/^[A-ÿ0-9 ]{5,255}$/),

    field('date')
        .trim()
        .required()
        .is(/^\d{1,2}\/\d{1,2}\/\d{4} [0-2][0-9]?:[0-5]?[0-9]$/),

    field('description')
        .trim()
        .required(),

    field('maximumTickets')
        .trim()
        .required()
        .is(/[0-9]{1,4}/),

    field('image')
        .trim()
        .required()
        .is(/^data:\w+\/\w+;base64,[a-zA-Z0-9+\/=]+$/)
);