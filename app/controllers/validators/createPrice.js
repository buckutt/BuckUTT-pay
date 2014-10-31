// Pay - /app/controllers/validators/createPrice.js

// Event price creator form validatior

'use strict';

var form  = require('express-form');
var field = form.field;

module.exports = form(
    field('name')
        .trim()
        .required()
        .is(/^[A-ÿ0-9 \-]{5,255}$/),

    field('price')
        .trim()
        .required()
        .toFloat()
);