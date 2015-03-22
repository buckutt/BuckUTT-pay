/////////////////////////////////
// Ticket print link generator //
/////////////////////////////////

'use strict';

var fs     = require('fs');
var moment = require('moment');

module.exports = function (db, config) {
    return function (req, res) {
        var logger   = require('../../lib/log')(config);
        var rest     = require('../../lib/rest')(config, logger);
        var pdfMaker = require('../../lib/pdf');
        var ticketId = req.params.ticketId;

        var ticket;

        db.Ticket.find({
            where: {
                id: ticketId,
                username: req.user.id
            }
        }).then(function (ticket_) {
            if (!ticket_) {
                throw Error.emit(res, 404, '404 - Not Found', 'Couldn\'t find ticket');
            }

            ticket = ticket_;

            return db.Ticket.findAll({
                where: {
                    mainTicket: ticket.id
                }
            });
        }).then(function (subTickets) {
            ticket.subTickets = subTickets || [];
        }).then(function () {
            if (ticket.subTickets.length > 0) {
                return db.Price.find(ticket.subTickets[0].price_id);
            }
        }).then(function (priceSubTicket) {
            if (priceSubTicket) {
                ticket.subTicketPrice = priceSubTicket;
            }

            return db.Event.find(ticket.event_id);
        }).then(function (event) {
            if (!event) {
                throw Error.emit(res, 404, '404 - Not Found', 'Couldn\'t find ticket\'s event');
            }

            ticket.event = event;

            return rest.get('fundations/' + ticket.event.fundationId);
        }).then(function (fRes) {
            ticket.fundation = fRes.data.data;
            return db.Price.find(ticket.price_id);
        }).then(function (price) {
            ticket.price = price;
        }).then(function () {
            var realPath = '/public/static/img/upload/' + ticket.event.picture;

            var baseTicket = {
                displayname: ticket.displayName,
                eventname: ticket.event.name,
                date: moment(ticket.event.date).format('DD/MM/YYYY à HH:mm'),
                place: 'UTT',
                price: ticket.price.price + '€',
                barcode: ticket.barcode,
                purchaseDate: moment(ticket.created_at).format('DD/MM/YYYY à HH:mm'),
                association: ticket.fundation.name,
                website: ticket.fundation.website,
                mail: ticket.fundation.mail,
                logo: realPath
            };

            var otherTickets = ticket.subTickets.map(function (subTicket) {
                return {
                    displayname: subTicket.displayName,
                    eventname: ticket.event.name,
                    date: moment(ticket.event.date).format('DD/MM/YYYY à HH:mm'),
                    place: 'UTT',
                    price: ticket.subTicketPrice.price + '€',
                    barcode: subTicket.barcode,
                    purchaseDate: moment(ticket.created_at).format('DD/MM/YYYY à HH:mm'),
                    association: ticket.fundation.name,
                    website: ticket.fundation.website,
                    mail: ticket.fundation.mail,
                    logo: realPath
                };
            });

            var toSend = [baseTicket].concat(otherTickets);

            pdfMaker.lights(toSend, function (buffer) {
                res.attachment(ticket.event.name + '.pdf');
                res.send(buffer);
                res.end();
            });
        }).catch(function (err) {
            console.dir(err);
        });
    };
};
