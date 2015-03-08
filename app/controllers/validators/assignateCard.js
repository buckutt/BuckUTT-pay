//////////////////////////////////////////
// Ticket barcode setter form validator //
//////////////////////////////////////////

'use strict';

var form  = require('express-form');
var field = form.field;

module.exports = form(
    field('ticket_id')
        .trim()
        .required()
        .is(/^\d+$/),
    field('barcode')
        .trim()
        .required()
        .is(/^\d+$/)
);
