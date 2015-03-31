//////////////////////////
// Events prices getter //
//////////////////////////

'use strict';

module.exports = function (db) {
    return function (req, res) {
        db.Price
            .findAll({
                where: {
                    event_id: req.params.eventId
                }
            })
            .then(function (prices) {
                return res
                        .status(200)
                        .json(prices || {})
                        .end();
            })
            .catch(function (err) {
                return Error.emit(res, 500, '500 - SQL Server error', err);
            });
    };
};
