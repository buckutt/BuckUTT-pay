//////////////////////////////////////////
// User buys one ticket from an eee-top //
//////////////////////////////////////////

'use strict';

var Promise  = require('bluebird');
var restling = require('restling');

module.exports = function (db, config) {
    var logger          = require('../../lib/log')(config);
    var rest            = require('../../lib/rest')(config, logger);
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

            db.Event.find(eventId)
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
                        db.Token.count({
                            mailCheck: req.form.code,
                            usermail: req.form.mail
                        }).then(function (count) {
                            if (count === 0) {
                                Error.emit(res, 401, '401 - Unauthorized', 'no token');
                                return reject();
                            }

                            resolve();
                        }).catch(function (err) {
                            reject(err);
                        });
                    } else {
                        req.form.displayName = req.user.firstname.nameCapitalize() + ' ' + req.user.lastname.nameCapitalize();
                        req.form.mail = req.user.mail;
                        resolve();
                    }
                });
            })
            .then(function () {
                return new Promise(function (resolve, reject) {
                    generateBarcode(resolve, db.Ticket);
                });
            })
            .then(function (barcode) {
                return new Promise(function (resolve, reject) {
                    db.SchoolDomain.findAll().complete(function (err, domains) {
                        if (err) {
                            return Error.emit(res, 500, '500 - SQL Server error', err);
                        }

                        var partnerPrice = false;
                        domains.forEach(function (domain) {
                            var reg = new RegExp('@' + domain.domain + '$', 'i');
                            if (reg.test(req.form.mail)) {
                                partnerPrice = true;
                            }
                        });

                        resolve([barcode, partnerPrice]);
                    });
                });
            })
            .then(function (data) {
                // data: [barcode, partnerMail]
                return new Promise(function (resolve, reject) {
                    if (req.user) {
                        if (req.user.inBDE) {
                            db.Price.find({
                                where: {
                                    event_id: eventId,
                                    name: { like: '%cotisant en prévente' }
                                }
                            }).complete(function (err, price) {
                                if (err || !price) {
                                    return reject();
                                }

                                resolve([price, data[0], 1, 1]);
                            });
                        } else {
                            db.Price.find({
                                where: {
                                    event_id: eventId,
                                    name: { like: '%non-cotisant en prévente' }
                                }
                            }).complete(function (err, price) {
                                if (err || !price) {
                                    return reject();
                                }

                                resolve([price, data[0], 1, 0]);
                            });
                        }
                    } else {
                        if (data[1]) {
                            db.Price.find({
                                where: {
                                    event_id: eventId,
                                    name: { like: '%partenaire en prévente' }
                                }
                            }).complete(function (err, price) {
                                if (err || !price) {
                                    return reject();
                                }

                                resolve([price, data[0], 0, 0]);
                            });
                        } else {
                            db.Price.find({
                                where: {
                                    event_id: eventId,
                                    name: { like: '%extérieur en prévente' }
                                }
                            }).complete(function (err, price) {
                                if (err || !price) {
                                    return reject();
                                }

                                resolve([price, data[0], 0, 0]);
                            });
                        }
                    }
                });
            })
            .then(function (data) {
                // data [price, barcode, student, contributor]
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
                        db.Price.find({
                            where: {
                                event_id: eventId,
                                name: { like: '%extérieur en prévente' }
                            }
                        }).complete(function (err, price) {
                            if (err) {
                                return Error.emit(res, 500, '500 - SQL Server error', err);
                            }

                            if (!price) {
                                Error.emit(res, 404, '404 - Not Found', err);
                                return reject();
                            }

                            resolve(price);
                        });
                    });
                }
            })
            .then(function (price) {
                if (req.form.additionalExtTickets && !req.form.isExt) {
                    priceWanted = price;
                    var additionalExtTickets = req.body.additionalExtTickets;
                    var promises = [];
                    additionalExtTickets.forEach(function (additionalExtTicket) {
                        promises.push(new Promise (function (resolve, reject) {
                            generateBarcode(resolve, db.Ticket);
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
                            price_id: priceWanted.id,
                            event_id: eventId,
                            mainTicket: newTicketId
                        });
                    });
                }
            })
            .then(function () {
                return new Promise(function (resolve, reject) {
                    if (isExt) {
                        db.Token.destroy({
                            where: {
                                mailCheck: req.form.code,
                                usermail: req.form.mail
                            }
                        }).complete(function (err) {
                            if (err) {
                                return reject();
                            }
                            resolve();
                        });
                    }

                    return restling.post(config.sherlocks.host, {
                        data: newTicketId
                    });
                    // resolve({
                    //     res: {},
                    //     data: {
                    //         id: '...',
                    //         form: '<FORM METHOD=POST ACTION="https://sherlocks.lcl.fr/cgis-payment-sherlocks/prod/callpayment" target="_top"><INPUT TYPE=HIDDEN NAME=DATA VALUE="2020343135603028502c2360542c3334532d2360512e3360502c3360502c2331302d4324575c224360542c3360502c2340522c2324502c2330522d5048502c2328502c2324552c2330542e232c582d4338572c4360502c2324595c224360522e3360502c2329463c4048502c232c502c2360532c3360515c224360502d3360502c2338512d432c522d23402a2c2360562c2360512d2328502c3334502c5328542c3334532c4330585c224360502e2360502c232c592d53402a2c2328582c2360502c4639525c224360502e3360502c2329463c4048502c3324502c2330553a2731543c23484f2b56295538564c4e3d3731542b4639522b572d483937294c3b562d4b3c525d433836514c384625433a572c4f3c4635543d37294e5c224360532c3360502d2339483d2731502e425c4f384735433a5259553d27304e3947284f3c5641453c46514f38564d532b562d413b26514238362d4b3c525d433b5659463a37294d5c224360512c5360502d2335483d2731502e425c4f384735433a5259553d27304e3947284f3c5641453c46514f38564d532b562d413b26514238362d4b3c525d43383659433936502a2c2324562c2360502c552d33336048502c333c502c23605639463946394639465c224360512e2360502c2338502c2360502c23602a2c2324592c2360512d372d483937294c3b562d4b3c532d462b463d49394048502c4360502c236057384631452b47214e395048502c5338502c2324583054284c354445333032512d30352d3431352923303529245c2240606014e0759ab0348bda"><DIV ALIGN=center>Vous utilisez le formulaire s&#233;curis&#233; standard SSL, choisissez une carte ci-dessous  <IMG BORDER=0 SRC="/static/img/CLEF.gif"> :<br><br></DIV><DIV ALIGN=center><INPUT TYPE=IMAGE NAME=CB BORDER=0 SRC="/static/img/CB.gif"><IMG SRC="/static/img/INTERVAL.gif"><INPUT TYPE=IMAGE NAME=VISA BORDER=0 SRC="/static/img/VISA.gif"><IMG SRC="/static/img/INTERVAL.gif"><INPUT TYPE=IMAGE NAME=MASTERCARD BORDER=0 SRC="/static/img/MASTERCARD.gif"><br><br></DIV></FORM>'
                    //     }
                    // });
                });
            })
            .then(function (sherlocksRes) {
                return new Promise(function (resolve, reject) {
                    db.Token.create({
                        ticket: newTicketId,
                        sherlocksToken: sherlocksRes.data.id
                    }).complete(function (err) {
                        if (err) {
                            return reject(err);
                        }

                        resolve(sherlocksRes);
                    });
                });
            })
            .then(function (sherlocksRes) {
                res.status(200).json({
                    id: newTicketId,
                    form: sherlocksRes.data.form
                }).end();
            })
            .catch(function (err) {
                console.dir(err);
                return Error.emit(res, 500, '500 - SQL Server error', err);
            });
        };
    };
};
