///////////////////
// Event remover //
///////////////////

'use strict';

module.exports = function (db) {
    return function (req, res) {
        db.Event.find(req.params.eventId).complete(function (err, event) {
            if (err) {
                return Error.emit(res, 500, '500 - SQL Error', err.toString());
            }

            event.destroy().complete(function (errDestroy) {
                if (errDestroy) {
                    return Error.emit(res, 500, '500 - SQL Error', errDestroy.toString());
                }

                res.json({
                    status: 200
                });
            });
        });
    };
};
