// Pay - /app/controllers/validators/editPrice.js

// Event price editor form validatior

'use strict';

var form  = require('express-form');
var field = form.field;

module.exports = form(
    field('price')
        .trim()
        .required()
        .toFloat()
);
