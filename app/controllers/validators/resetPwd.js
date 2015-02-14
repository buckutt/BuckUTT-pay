////////////////////
// Password reset //
////////////////////

'use strict';

var form  = require('express-form');
var field = form.field;

module.exports = form(
    field('password')
        .trim()
        .required()
        .is(/^.{8,}$/)
);
