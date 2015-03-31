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
            db.Ticket
                .find({
                    where: {
                        event_id: eventId,
                        barcode: id
                    }
                })
                .then(testTicket)
                .catch(testTicketErr);
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
                        res
                            .status(401)
                            .end();
                        return reject();
                    }

                    return resolve(mol.UserId);
                });
            })
            .then(function (username) {
                db.Ticket
                    .find({
                        where: {
                            event_id: eventId,
                            username: username
                        }
                    })
                    .then(testTicket)
                    .catch(testTicketErr);
            });
        }

        function testTicket (ticket) {
            if (!ticket) {
                return res
                        .status(401)
                        .end();
            }

            if (!ticket.paid || !ticket.paid_at || !ticket.paid_with) {
                return res.status(402).end();
            }

            if (ticket.validatedDate) {
                return res.status(409).end();
            }

            ticket.validatedDate = new Date();
            ticket.save();

            res.status(200).end(ticket.displayName);
        }

        function testTicketErr () {
            return res
                    .status(401)
                    .end();
        }
    };
};
