////////////////////////////////
// Ticket validator by etu id //
////////////////////////////////

'use strict';

var Promise = require('bluebird');

module.exports = function (db, config) {
    var logger = require('../../lib/log')(config);
    var rest   = require('../../lib/rest')(config, logger);

    return function (req, res) {
        var eventId = req.params.eventId;
        var id      = req.params.id;

        // Recognize etu card
        if (id.indexOf('22000000') === 0) {
            // If the etu number starts by 0 (4 digits), parseInt to trim
            id = parseInt(id.slice(8, 8 + 5)) + '';
            testEtu();
        } else {
            // First, check barcode (bde card or pdf)
            db.Ticket.find({
                where: {
                    event_id: eventId,
                    barcode: id
                }
            }).complete(testTicket);
        }

        /**
         * Tests by etu card number
         * @return {Function} Bluebird instance
         */
        function testEtu () {
            rest.get('meanofloginsusers?data=' + id)
            .then(function (mRes) {
                return new Promise(function (resolve, reject) {
                    var mol = mRes.data.data;
                    if (!mol || !mol.UserId) {
                        res.status(401).end();
                        return reject();
                    }

                    resolve(mol.UserId);
                });
            })
            .then(function (username) {
                db.Ticket.find({
                    where: {
                        event_id: eventId,
                        username: username
                    }
                }).complete(testTicket);
            });
        }

        function testTicket (err, ticket) {
            if (err || !ticket) {
                return res.status(401).end();
            }

            var values = (ticket.dataValues) ? ticket.dataValues : ticket;

            if (!values.paid || !values.paid_at || !values.paid_with) {
                return res.status(402).end();
            }

            if (values.validatedDate) {
                return res.status(409).end();
            }

            ticket.validatedDate = new Date();
            ticket.save();

            res.status(200).end(ticket.displayName);
        }
    };
};
