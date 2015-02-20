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

            price.price = req.form.price;
            price.save().complete(function (saveErr) {
                if (saveErr) {
                    return Error.emit(res, 500, '500 - SQL Server error', saveErr.toString());
                }

                // Update prices
                rest.put('prices/' + price.backendId, {
                    credit: req.form.price * 100
                }).then(function (prRes) {
                    res.json(req.form);
                }).catch(function (err) {
                    console.dir(err);
                    Error.emit(res, 500, '500 - Buckutt server error', 'update prices');
                });
            });
        });
    };
};
