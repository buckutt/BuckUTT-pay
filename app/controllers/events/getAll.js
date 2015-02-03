///////////////////
// Events getter //
///////////////////

'use strict';

module.exports = function (db) {
    return function (req, res) {
        db.Event.findAll({
            where: {
                date: {
                    gte: (new Date()).toDateTime()
                }
            }
        }).done(function (err, events) {
            if (err) {
                return Error.emit(res, 500, '500 - SQL Server error', err);
            }
            
            res.json(events || {});
        });
    };
};
