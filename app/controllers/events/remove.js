///////////////////
// Event remover //
///////////////////

'use strict';

module.exports = function (db) {
    return function (req, res) {
        db.Event.find(req.params.eventId).complete(function (err, event) {
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
