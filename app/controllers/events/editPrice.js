////////////////////////
// Event price editor //
////////////////////////

'use strict';

var moment = require('moment');

module.exports = function (db, config) {
    var logger = require('../../lib/log')(config);
    var rest   = require('../../lib/rest')(config, logger);

    return function (req, res) {
        if (!req.form.isValid) {
            return Error.emit(res, 400, '400 - Bad Request', req.form.errors);
        }

        db.Price.find(req.params.priceId).complete(function (err, price) {
            if (err) {
                return Error.emit(res, 500, '500 - SQL Server error', err.toString());
            }

            var oldPrice = req.form.price * 10;
            price.price = req.form.price;
            price.save().complete(function (saveErr) {
                if (saveErr) {
                    return Error.emit(res, 500, '500 - SQL Server error', saveErr.toString());
                }

                res.json(req.form);
            });
        });
    };
};
