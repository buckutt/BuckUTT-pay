///////////////////
// Events getter //
///////////////////

'use strict';

module.exports = function (db) {
    return function (req, res) {
        db.Event
            .findAll({
                where: {
                    date: {
                        gte: (new Date()).toDateTime()
                    }
                }
            })
            .then(function (events) {
                return res
                        .status(200)
                        .json(events || {})
                        .end();
            })
            .catch(function (err) {
                return Error.emit(res, 500, '500 - SQL Server error', err);
            });
    };
};
