/////////////////////////////////////////
// Send a mail with all user's tickets //
/////////////////////////////////////////

'use strict';

var moment = require('moment');

module.exports = function (db, config) {
    return function (req, res) {
        var logger = require('../../lib/log')(config);
        var mailer = require('../../lib/mailer')(config);
        var rest   = require('../../lib/rest')(config, logger);
        var pdf    = require('../../lib/pdf');

        // Get username from mail
        db.Ticket.findAll({
            mail: req.params.mail
        }).complete(function (err, tickets) {
            if (err) {
                return Error.emit(res, 500, '500 - SQL Server error', err);
            }

            if (!tickets) {
                res.status(404);
                res.end();
                return;
            }

            var places = {};
            var todo = tickets.length;
            tickets.forEach(function (ticket) {
                ticket.getEvent().then(function (event) {
                    ticket.event = event;
                }).then(function () {
                    rest.get('fundations/' + ticket.event.fundationId).then(function (fRes) {
                        var data = fRes.data.data;

                        pdf.lights({
                            displayname: ticket.displayName,
                            eventname: ticket.event.name,
                            date: moment(ticket.event.date).format('DD/MM/YYYY à HH:mm'),
                            place: '',
                            price: ticket.price,
                            barcode: ticket.barcode,
                            purchaseDate: moment(ticket.event.paid_at).format('DD/MM/YYYY à HH:mm'),
                            association: data.name,
                            website: data.website,
                            mail: data.mail,
                            logo: '/public/static/img/upload/' + ticket.event.picture
                        }, function (buffer) {
                            --todo;

                            places[ticket.event.name] = buffer;

                            if (todo === 0) {
                                mailer.places(req.params.mail, places, function (okay) {
                                    if (!okay) {
                                        return Error.emit(res, 500, '500 - Could\'t send mail');
                                    }

                                    res.json({
                                        status: 200
                                    });
                                });
                            }
                        });
                    }).catch(function (err) {
                        console.dir(err);
                        Error.emit(res, 500, '500 - Buckutt server error', 'Get fundaton data');
                    });
                });
            });
        });
    };
};
