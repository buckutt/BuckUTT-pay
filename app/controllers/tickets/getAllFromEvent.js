//////////////////////////
// Event tickets getter //
//////////////////////////

'use strict';

module.exports = function (db) {
    return function (req, res) {
        db.Ticket.findAll({
            where: {
                event_id: req.body.eventId
            }
        }).done(function (err, tickets) {
            if (err) {
                Error.emit(res, 500, '500 - SQL Server error', err);
                return;
            }

            res.json(tickets || []);
        });
    };
};
