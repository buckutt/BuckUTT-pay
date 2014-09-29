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
                res.status(500).json({
                    status: 500,
                    error: err
                });
                res.end();
                return;
            }
            
            res.json(events);
        });
    };
};
