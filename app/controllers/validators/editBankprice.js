//////////////////////////////////////
// BankPrice editor form validatior //
//////////////////////////////////////

'use strict';

var form  = require('express-form');
var field = form.field;

module.exports = form(
    field('value')
        .trim()
        .required()
        .toFloat()
);
