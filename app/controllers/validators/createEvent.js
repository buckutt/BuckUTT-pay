///////////////////////////////////
// Event creator form validatior //
///////////////////////////////////

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
        .ifNull(false)
        .toBoolean(),

    field('priceEtuActive')
        .trim()
        .ifNull(false)
        .toBoolean(),

    field('priceExtPresaleActive')
        .trim()
        .ifNull(false)
        .toBoolean(),

    field('priceExtActive')
        .trim()
        .ifNull(false)
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
        .ifNull(0)
        .toFloat(),

    field('priceEtu')
        .trim()
        .ifNull(0)
        .toFloat(),

    field('priceExtPresale')
        .trim()
        .ifNull(0)
        .toFloat(),

    field('priceExt')
        .trim()
        .ifNull(0)
        .toFloat()
);
