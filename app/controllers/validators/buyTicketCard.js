/////////////////////////////////////////
// Buy ticket with card form validator //
/////////////////////////////////////////

'use strict';

var form  = require('express-form');
var field = form.field;

module.exports = form(
    field('birthdate')
        .trim()
        .required()
        .is(/^\d{1,2}\/\d{1,2}\/\d{4}$/),

    field('additionalExtTickets')
);
