// Pay - /app/controllers/validators/etuAuth.js

// Etu auth form validatior

'use strict';

var form  = require('express-form');
var field = form.field;

module.exports = form(
    field('username')
        .trim()
        .required()
        .is(/^[\w\d]+$/),

    field('password')
        .trim()
        .required()
        .is(/^.{8,}$/)
);