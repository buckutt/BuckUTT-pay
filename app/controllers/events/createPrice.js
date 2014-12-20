// Pay - /app/controllers/events/createPrice.js

// Event price creator

'use strict';

module.exports = function (db, config) {
    var logger = require('../../lib/log')(config);

    return function (req, res) {
        db.Price.create(req.form).complete(function (err, newPrice) {
            if (err) {
                Error.emit(res, 500, '500 - SQL Server error', err.toString());
                return;
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
