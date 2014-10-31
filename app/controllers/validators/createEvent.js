// Pay - /app/controllers/validators/createEvent.js

// Event creator form validatior

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
        .required()
        .is(/^data:\w+\/\w+;base64,[a-zA-Z0-9+\/=]+$/),

    field('priceEtuPresaleActive')
        .trim()
        .required()
        .toBoolean(),

    field('priceEtuActive')
        .trim()
        .required()
        .toBoolean(),

    field('priceExtPresaleActive')
        .trim()
        .required()
        .toBoolean(),

    field('priceExtActive')
        .trim()
        .required()
        .toBoolean(),

    field('priceEtuCottPresale')
        .trim()
        .required()
        .toFloat(),

    field('priceEtuCott')
        .trim()
        .required()
        .toFloat(),

    field('priceEtuPresale')
        .trim()
        .required()
        .toFloat(),

    field('priceEtu')
        .trim()
        .required()
        .toFloat(),

    field('priceExtPresale')
        .trim()
        .required()
        .toFloat(),

    field('priceExt')
        .trim()
        .required()
        .toFloat()
);