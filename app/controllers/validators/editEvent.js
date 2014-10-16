// Pay - /app/controllers/validators/editEvent.js

// Event editor form validatior

'use strict';

var form  = require('express-form');
var field = form.field;

module.exports = form(
    field('id')
        .trim()
        .required()
        .is(/^\d+$/),

    field('name')
        .trim()
        .required()
        .is(/^[A-ÿ0-9 ]{5,255}$/),

    field('date')
        .trim()
        .required()
        .is(/^\d{4}-\d{2}-\d{2}T[0-2]\d:\d{2}:\d{2}.\d{3}Z$/),

    field('description')
        .trim()
        .required(),

    field('maximumTickets')
        .trim()
        .required()
        .is(/[0-9]{1,4}/),

    field('image')
        .trim()
        .is(/^data:\w+\/\w+;base64,[a-zA-Z0-9+\/=]+$/)
);