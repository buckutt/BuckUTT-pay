//////////////////////////
// Event tickets getter //
//////////////////////////

'use strict';

module.exports = function (db) {
    return function (req, res) {
        db.Ticket
            .findAll({
                where: {
                    event_id: req.params.eventId
                }
            })
            .then(function (tickets) {
                if (!tickets) {
                    return res
                            .status(404)
                            .end();
                }

                return res
                        .status(200)
                        .json(tickets)
                        .end();
            })
            .catch(function (err) {
                return Error.emit(res, 500, '500 - SQL Server error', err);
            });
    };
};
