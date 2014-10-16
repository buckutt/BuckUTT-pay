// Pay - /app/controllers/events/remove.js

// Event getter

'use strict';

module.exports = function (db) {
    return function (req, res) {
        if (!Number.isPositiveNumeric(req.body.eventId)) {
            Error.emit(res, 400, '400 - Bad Request');
            return;
        }

        db.Event.find(req.body.eventId).complete(function (err, event) {
            if (err) {
                Error.emit(res, 500, '500 - SQL Error', err.toString());
                return;
            }

            event.destroy().complete(function (errDestroy) {
                if (errDestroy) {
                    Error.emit(res, 500, '500 - SQL Error', err.toString());
                    return;
                }

                res.json({
                    status: 200
                });
            });
        });
    };
};
