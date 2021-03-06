////////////////////////////////////////////
// School account creator form validatior //
////////////////////////////////////////////

'use strict';

var form  = require('express-form');
var field = form.field;

module.exports = form(
    field('username')
        .trim()
        .required()
        .is(/^\d{1,10}$/),

    field('displayName')
        .trim()
        .required()
        .is(/^[A-ÿ0-9 \-]{5,255}$/),

    field('event_id')
        .trim()
        .required()
        .is(/^\d+$/),

    field('right_id')
        .trim()
        .required()
        .is(/^\d+$/)
);
