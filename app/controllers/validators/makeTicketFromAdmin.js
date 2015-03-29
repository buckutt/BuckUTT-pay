//////////////////////////////////////////
// Event ticket creator form validatior //
//////////////////////////////////////////

'use strict';

var form  = require('express-form');
var field = form.field;

module.exports = form(
    field('displayName')
        .trim()
        .required()
        .is(/^[A-ÿ0-9 \-]{5,255}$/),

    field('username')
        .trim()
        .required()
        .is(/^\d+$/),

    field('paid')
        .trim()
        .ifNull(true)
        .toBoolean(),

    field('paid_at')
        .trim()
        .required()
        .custom(function (value) {
            var d = new Date(value);
            if (isNaN(d.getTime())) {
                throw new Error('wrong date');
            }
        }),

    field('birthdate')
        .trim()
        .required()
        .is(/^\d{2}\/\d{2}\/\d{4}/),

    field('mail')
        .trim()
        .required()
        .isEmail(),

    field('paid_with')
        .trim()
        .required()
        .is(/^\w+$/),

    field('temporarlyOut')
        .trim()
        .ifNull(false)
        .toBoolean(),

    field('student')
        .trim()
        .ifNull(false)
        .toBoolean(),

    field('contributor')
        .trim()
        .ifNull(false)
        .toBoolean(),

    field('event_id')
        .trim()
        .required()
        .is(/^\d+$/)
);
