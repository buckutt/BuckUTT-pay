// Pay - /app/controllers/events/getAll.js

// Tickets getter

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
                Error.emit(res, 500, 3);
                return;
            }
            
            res.json(events);
        });
    };
};
