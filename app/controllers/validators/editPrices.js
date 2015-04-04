////////////////////////////////////////
// Event price editor form validatior //
////////////////////////////////////////

'use strict';

var form  = require('express-form');
var field = form.field;

module.exports = form(
    field('priceEtuPresaleActive')
        .trim()
        .ifNull(false)
        .toBoolean(),

    field('priceEtuActive')
        .trim()
        .ifNull(false)
        .toBoolean(),

    field('priceExtPresaleActive')
        .trim()
        .ifNull(false)
        .toBoolean(),

    field('priceExtActive')
        .trim()
        .ifNull(false)
        .toBoolean(),

    field('pricePartnerPresaleActive')
        .trim()
        .ifNull(false)
        .toBoolean(),

    field('pricePartnerActive')
        .trim()
        .ifNull(false)
        .toBoolean(),

    field('priceEtucotPresale')
        .trim()
        .required()
        .toFloat(),

    field('priceEtucot')
        .trim()
        .required()
        .toFloat(),

    field('priceEtuPresale')
        .trim()
        .ifNull(0)
        .toFloat(),

    field('priceEtu')
        .trim()
        .ifNull(0)
        .toFloat(),

    field('priceExtPresale')
        .trim()
        .ifNull(0)
        .toFloat(),

    field('priceExt')
        .trim()
        .ifNull(0)
        .toFloat(),

    field('pricePartnerPresale')
        .trim()
        .ifNull(0)
        .toFloat(),

    field('pricePartner')
        .trim()
        .ifNull(0)
        .toFloat()
);
