/////////////////////////////////////
// Ticket validator by displayName //
/////////////////////////////////////

'use strict';

module.exports = function (db) {
    return function (req, res) {
        var eventId = req.params.eventId;

        db.Ticket
            .findAll({
                where: {
                    event_id: eventId,
                    displayName: req.params.name
                }
            })
            .then(function (tickets) {
                if (!tickets || tickets.length === 0) {
                    return res
                            .status(401)
                            .end();
                }

                if (tickets.length > 1) {
                    tickets = tickets.map(function (ticket) {
                        return [ticket.id, ticket.birthdate];
                    });
                    return res
                            .status(200)
                            .json(tickets)
                            .end();
                }

                var ticket = tickets[0];

                if (!ticket.paid || !ticket.paid_at || !ticket.paid_with) {
                    return res
                            .status(402)
                            .end();
                }

                if (ticket.validatedDate) {
                    return res
                            .status(409)
                            .end();
                }

                ticket.validatedDate = new Date();
                ticket.save();

                return res
                        .status(200)
                        .end();
            })
            .catch(function () {
                return res
                        .status(401)
                        .end();
            });
    };
};
