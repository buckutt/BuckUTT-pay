/////////////////////////////////////////////
// Buy ext ticket with card form validator //
/////////////////////////////////////////////

'use strict';

var form  = require('express-form');
var field = form.field;

module.exports = form(
    field('mail')
        .trim()
        .required()
        .isEmail(),

    field('birthdate')
        .trim()
        .required()
        .is(/^\d{1,2}\/\d{1,2}\/\d{4}$/),

    field('code')
        .trim()
        .required()
        .is(/^[A-Z0-9]{5}$/),

    field('displayName')
        .trim()
        .required()
        .is(/^[a-zA-Z0-9&\/\.\(\),\' ]+$/)
);
