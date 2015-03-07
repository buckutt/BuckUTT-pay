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
        .equals('0'),

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

    field('paid_with')
        .trim()
        .required()
        .is(/^\w+$/),

    field('temporarlyOut')
        .trim()
        .ifNull(false)
        .toBoolean(),

    field('barcode')
        .trim()
        .required()
        .equals(0),

    field('event_id')
        .trim()
        .required()
        .is(/^\d+$/)
);
