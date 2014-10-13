// Pay - /app/models/seed/meanOfPayment.js

// Seeds some meanOfPayment

'use strict';

module.exports = function (db) {
    db.MeanOfPayment.create({
        name: 'Sherlock\'s'
    });

    db.MeanOfPayment.create({
        name: 'Liquide'
    });

    db.MeanOfPayment.create({
        name: 'Buckutt'
    });
};
