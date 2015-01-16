///////////////////////////////////////////
// School domain creator form validatior //
///////////////////////////////////////////

'use strict';

var form  = require('express-form');
var field = form.field;

module.exports = form(
    field('domain')
        .trim()
        .required()
        .is(/^\b((?=[a-z0-9-]{1,63}\.)(xn--)?[a-z0-9]+(-[a-z0-9]+)*\.)+[a-z]{2,63}\b$/i)
);
