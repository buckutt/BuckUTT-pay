///////////////////////////////////////////
// Ticket birtdate setter form validator //
///////////////////////////////////////////

'use strict';

var form  = require('express-form');
var field = form.field;

module.exports = form(
    field('etu_id')
        .trim()
        .required()
        .is(/^\d{5}$/),

    field('birthdate')
        .trim()
        .required()
        .is(/^\d{1,2}\/\d{1,2}\/\d{4}$/)
);
