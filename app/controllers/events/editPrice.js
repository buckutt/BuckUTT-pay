////////////////////////
// Event price editor //
////////////////////////

'use strict';

module.exports = function (db, config) {
    var logger = require('../../lib/log')(config);
    var rest   = require('../../lib/rest')(config, logger);

    return function (req, res) {
        if (!req.form.isValid) {
            return Error.emit(res, 400, '400 - Bad Request', req.form.errors);
        }

        db.Price
            .find(req.params.priceId)
            .then(function (price) {
                price.price = req.form.price;
                price
                    .save()
                    .then(function () {
                        // Update prices
                        return rest
                                .put('prices/' + price.backendId, {
                                    credit: req.form.price * 100
                                });
                    }, function (err) {
                        return Error.emit(res, 500, '500 - Buckutt server error', err);
                    })
                    .then(function () {
                        res.json(req.form);
                    })
                    .catch(function (err) {
                        return Error.emit(res, 500, '500 - SQL Server error', err);
                    });
            })
            .catch(function (err) {
                return Error.emit(res, 500, '500 - SQL Server error', err);
            });
    };
};
