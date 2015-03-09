/////////////////////////////////////
// Ticket validator by displayName //
/////////////////////////////////////

'use strict';

var Promise = require('bluebird');

module.exports = function (db, config) {
    var logger = require('../../lib/log')(config);
    var rest   = require('../../lib/rest')(config, logger);

    return function (req, res) {
        var eventId = req.params.eventId;

        db.Ticket.findAll({
            where: {
                event_id: eventId,
                displayName: req.params.name
            }
        }).complete(function (err, tickets) {
            if (err || !tickets || tickets.length === 0) {
                return res.status(401).end();
            }

            if (tickets.length > 1) {
                tickets = tickets.map(function (ticket) {
                    return [ticket.id, ticket.birthdate];
                });
                res.status(200).json(tickets).end();
                return;
            }

            var ticket = tickets[0];

            var values = (ticket.dataValues) ? ticket.dataValues : ticket;

            if (!values.paid || !values.paid_at || !values.paid_with) {
                return res.status(402).end();
            }

            if (values.validatedDate) {
                return res.status(409).end();
            }

            ticket.validatedDate = new Date();
            ticket.save();

            res.status(200).end();
        });

    };
};
