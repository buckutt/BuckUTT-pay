//////////////////////////////////////////
// User buys one ticket from an eee-top //
//////////////////////////////////////////

'use strict';

var Promise  = require('bluebird');
var restling = require('restling');

module.exports = function (db, config) {
    var generateBarcode = require('../../lib/generateBarcode');

    return function (isExt) {
        return function (req, res) {
            var eventId = req.params.eventId;
            if (!req.form.isValid) {
                return Error.emit(res, 400, '400 - Bad Request', req.form.errors);
            }

            var priceWanted;
            var priceWantedExt;
            var newTicketId;

            db.Event
                .find(eventId)
                .then(function (event) {
                    if (!event) {
                        throw new Error.emit(res, 404, '404 - Not Found', 'no event');
                    }

                    if (!event.opened) {
                        throw new Error.emit(res, 404, '404 - Not Found', 'event not opened');
                    }
                })
                .then(function () {
                    return new Promise(function (resolve, reject) {
                        if (isExt) {
                            db.Token
                                .count({
                                    mailCheck: req.form.code,
                                    usermail: req.form.mail
                                })
                                .then(function (count) {
                                    if (count === 0) {
                                        Error.emit(res, 401, '401 - Unauthorized', 'no token');
                                        return reject();
                                    }

                                    return resolve();
                                })
                                .catch(reject);
                        } else {
                            req.form.displayName = req.user.firstname.nameCapitalize() + ' ' + req.user.lastname.nameCapitalize();
                            req.form.mail = req.user.mail;
                            return resolve();
                        }
                    });
                })
                .then(function () {
                    return new Promise(function (resolve) {
                        generateBarcode(resolve, reject, db.Ticket);
                    });
                })
                .then(function (barcode) {
                    return new Promise(function (resolve, reject) {
                        db.SchoolDomain
                            .findAll()
                            .then(function (domains) {
                                var partnerPrice = false;
                                domains.forEach(function (domain) {
                                    var reg = new RegExp('@' + domain.domain + '$', 'i');
                                    if (reg.test(req.form.mail)) {
                                        partnerPrice = true;
                                    }
                                });

                                return resolve([barcode, partnerPrice]);
                            })
                            .catch(reject);
                    });
                })
                .then(function (data) {
                    // data: [barcode, partnerMail]
                    return new Promise(function (resolve, reject) {
                        if (req.user) {
                            if (req.user.inBDE) {
                                db.Price
                                    .find({
                                        where: {
                                            event_id: eventId,
                                            name: { like: '%cotisant en prévente' }
                                        }
                                    })
                                    .then(function (price) {
                                        if (!price) {
                                            return reject();
                                        }

                                        return resolve([price, data[0], 1, 1]);
                                    })
                                    .catch(reject);
                            } else {
                                db.Price
                                    .find({
                                        where: {
                                            event_id: eventId,
                                            name: { like: '%non-cotisant en prévente' }
                                        }
                                    }).then(function (price) {
                                        if (!price) {
                                            return reject();
                                        }

                                        return resolve([price, data[0], 1, 0]);
                                    })
                                    .catch(reject);
                            }
                        } else {
                            if (data[1]) {
                                db.Price
                                    .find({
                                        where: {
                                            event_id: eventId,
                                            name: { like: '%partenaire en prévente' }
                                        }
                                    })
                                    .then(function (price) {
                                        if (!price) {
                                            return reject();
                                        }

                                        return resolve([price, data[0], 0, 0]);
                                    })
                                    .catch(reject);
                            } else {
                                db.Price
                                    .find({
                                        where: {
                                            event_id: eventId,
                                            name: { like: '%extérieur en prévente' }
                                        }
                                    })
                                    .then(function (price) {
                                        if (!price) {
                                            return reject();
                                        }

                                        return resolve([price, data[0], 0, 0]);
                                    })
                                    .catch(reject);
                            }
                        }
                    });
                })
                .then(function (data) {
                    // data [price, barcode, student, contributor]
                    priceWanted = data[0];
                    return db.Ticket.create({
                        username: (req.user) ? req.user.id : 0,
                        displayName: req.form.displayName,
                        birthdate: req.form.birthdate,
                        mail: req.form.mail,
                        student: data[2],
                        contributor: data[3],
                        paid: 0,
                        paid_at: null,
                        paid_with: 'card',
                        barcode: data[1],
                        price_id: data[0].id,
                        event_id: eventId
                    });
                })
                .then(function (newTicket) {
                    newTicketId = newTicket.id;
                    if (req.form.additionalExtTickets) {
                        return new Promise(function (resolve, reject) {
                            db.Price
                                .find({
                                    where: {
                                        event_id: eventId,
                                        name: { like: '%extérieur en prévente' }
                                    }
                                })
                                .then(function (price) {
                                    if (!price) {
                                        Error.emit(res, 404, '404 - Not Found');
                                        return reject();
                                    }

                                    priceWantedExt = price;

                                    return resolve(price);
                                })
                                .catch(reject);
                        });
                    }
                })
                .then(function () {
                    if (req.form.additionalExtTickets && !req.form.isExt) {
                        var additionalExtTickets = req.body.additionalExtTickets;
                        var promises = [];
                        additionalExtTickets.forEach(function () {
                            promises.push(new Promise (function (resolve) {
                                generateBarcode(resolve, reject, db.Ticket);
                            }));
                        });

                        return Promise.all(promises);
                    }
                })
                .then(function (barcodes) {
                    if (req.form.additionalExtTickets && !req.form.isExt) {
                        var additionalExtTickets = req.body.additionalExtTickets;
                        return additionalExtTickets.map(function (additionalExtTicket, i) {
                            return db.Ticket.create({
                                username: (req.user) ? req.user.id : 0,
                                displayName: additionalExtTicket.displayName,
                                birthdate: additionalExtTicket.birthdate,
                                mail: req.form.mail,
                                student: 0,
                                contributor: 0,
                                paid: 0,
                                paid_at: null,
                                paid_with: 'card',
                                barcode: barcodes[i],
                                price_id: priceWantedExt.id,
                                event_id: eventId,
                                mainTicket: newTicketId
                            });
                        });
                    }
                })
                .then(function () {
                    return new Promise(function (resolve, reject) {
                        if (isExt) {
                            db.Token
                                .destroy({
                                    where: {
                                        mailCheck: req.form.code,
                                        usermail: req.form.mail
                                    }
                                })
                                .then(function () {
                                    return resolve();
                                })
                                .catch(reject);
                        }

                        var totalCost = priceWanted.price * 100;
                        if (req.form.additionalExtTickets) {
                            totalCost += req.form.additionalExtTickets.length * (priceWantedExt.price * 100);
                        }

                        return restling.post(config.sherlocks.host + 'pay/' + totalCost, {
                            data: newTicketId,
                            service: config.sherlocks.paymentId
                        });
                    });
                })
                .then(function (sherlocksRes) {
                    return new Promise(function (resolve, reject) {
                        db.Token
                            .create({
                                ticket: newTicketId,
                                sherlocksToken: sherlocksRes.data.token
                            })
                            .then(function () {
                                return resolve(sherlocksRes);
                            })
                            .catch(reject);
                    });
                })
                .then(function (sherlocksRes) {
                    return res
                            .redirect(config.sherlocks.host + 'initiate/' + sherlocksRes.data.id);
                })
                .catch(function (err) {
                    return Error.emit(res, 500, '500 - SQL Server error', err);
                });
        };
    };
};
