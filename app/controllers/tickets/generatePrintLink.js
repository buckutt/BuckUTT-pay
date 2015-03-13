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

        db.Ticket.find(ticketId).complete(function (err, ticket) {
            if (err || !ticket) {
                return Error.emit(res, 404, '404 - Not Found', 'Couldn\'t find ticket');
            }

            var splittedName = ticket.displayName.split(' ');
            if (splittedName.length < 2) {
                splittedName = [ticket.displayName, ''];
            }
            if (splittedName.length > 2) {
                var splittedName_ = [splittedName.shift()];
                splittedName_.push(splittedName.join(' '));
                splittedName = splittedName_;
            }

            var firstname = splittedName[0];
            var lastname = splittedName[1];

            db.Event.find(ticket.event_id).complete(function (err, event) {
                if (err || !event) {
                    return Error.emit(res, 404, '404 - Not Found', 'Couldn\'t find ticket\'s event');
                }

                ticket.event = event;

                var realPath = '/public/static/img/upload/' + ticket.event.picture;

                db.Price.find(ticket.price_id).complete(function (err, price) {
                    if (err || !price) {
                        return Error.emit(res, 404, '404 - Not Found', 'Couldn\'t find ticket\'s event');
                    }

                    ticket.price = price;

                    rest.get('fundations/' + ticket.event.fundationId).then(function (fRes) {

                        pdfMaker.lights({
                            displayname: firstname + lastname,
                            eventname: ticket.event.name,
                            date: moment(ticket.event.date).format('DD/MM/YYYY à HH:mm'),
                            place: 'UTT',
                            price: ticket.price.price + '€',
                            barcode: ticket.barcode,
                            purchaseDate: moment(ticket.created_at).format('DD/MM/YYYY à HH:mm'),
                            association: fRes.data.data.name,
                            website: fRes.data.data.website,
                            mail: fRes.data.data.mail,
                            logo: realPath
                        }, function (buffer) {
                            res.attachment(ticket.event.name + '.pdf');
                            res.send(buffer);
                            res.end();
                        });
                    }, function (err) {
                        return Error.emit(res, 500, '500 - Buckutt server error', 'Fundations from print');
                    });
                });
            });
        });
    };
};
