/////////////////////////
// Event price creator //
/////////////////////////

'use strict';

module.exports = function (db, config) {
    var logger = require('../../lib/log')(config);

    return function (req, res) {
        if (!req.form.isValid) {
            return Error.emit(res, 400, '400 - Bad Request', req.form.errors);
        }

        db.Price.create(req.form).complete(function (err, newPrice) {
            if (err) {
                return Error.emit(res, 500, '500 - SQL Server error', err.toString());
            }

            db.Event.find({ id: req.params.eventId }).complete(function (evErr, concernedEvent) {
                if (evErr) {
                    Error.emit(res, 500, '500 - SQL Server error', evErr.toString());
                }

                concernedEvent.addPrice(newPrice);

                res.json({
                    status: 404
                });
            });
        });
    };
};
