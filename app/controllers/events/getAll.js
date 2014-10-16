// Pay - /app/controllers/events/getAll.js

// Events getter

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
                Error.emit(res, 500, '500 - SQL Server error', err);
                return;
            }
            
            res.json(events || {});
        });
    };
};
