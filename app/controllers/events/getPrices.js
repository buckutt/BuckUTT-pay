//////////////////////////
// Events prices getter //
//////////////////////////

'use strict';

module.exports = function (db) {
    return function (req, res) {
        db.Price.findAll({
            where: {
                event_id: req.params.eventId
            }
        }).complete(function (err, prices) {
            if (err) {
                return Error.emit(res, 500, '500 - SQL Server error', err);
            }

            res.json(prices || {});
        });
    };
};
