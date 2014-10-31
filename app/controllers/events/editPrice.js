// Pay - /app/controllers/events/editPrice.js

// Event editor

'use strict';

var moment = require('moment');

module.exports = function (db, config) {
    var logger = require('../../log')(config);

    return function (req, res) {
        db.Price.find(req.params.priceId).complete(function (err, price) {
            if (err) {
                Error.emit(res, 500, '500 - SQL Server error', err.toString());
            }
            price.price = req.form.price;
            price.save().complete(function (saveErr) {
                if (saveErr) {
                    Error.emit(res, 500, '500 - SQL Server error', saveErr.toString());
                }
                res.json(req.form);
            });
        });
    };
};