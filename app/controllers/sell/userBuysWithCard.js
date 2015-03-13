//////////////////////////////////////////
// User buys one ticket from an eee-top //
//////////////////////////////////////////

'use strict';

var Promise = require('bluebird');

module.exports = function (db, config) {
    var logger   = require('../../lib/log')(config);
    var rest     = require('../../lib/rest')(config, logger);

    return function (isExt) {
        return function (req, res) {
            var eventId = req.params.eventId;
            if (!req.form.isValid) {
                return Error.emit(res, 400, '400 - Bad Request', req.form.errors);
            }

            var starterPromise;
            if (isExt) {
                starterPromise = db.Token.count({
                    mailCheck: req.form.code,
                    usermail: req.form.mail
                }).then(function (count) {
                    return new Promise(function (resolve, reject) {
                        if (count === 0) {
                            Error.emit(res, 401, '401 - Unauthorized', 'no token');
                            return reject();
                        }

                        resolve();
                    });
                })
            } else {
                starterPromise = new Promise();
            }

            starterPromise
            .then(function () {
                return new Promise(function (resolve, reject) {
                    barcodePromise(resolve);
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

                        resolve(barcode, partnerPrice);
                    });
                });
            })
            .then(function (barcode, partnerMail) {
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
                                    return Error.emit(res, 500, '500 - SQL Server error', err);
                                }

                                resolve(price, barcode, 1, 1);
                            });
                        } else {
                            db.Price.find({
                                where: {
                                    event_id: eventId,
                                    name: { like: '%non-cotisant en prévente' }
                                }
                            }).complete(function (err, price) {
                                if (err || !price) {
                                    return Error.emit(res, 500, '500 - SQL Server error', err);
                                }

                                resolve(price, barcode, 1, 0);
                            });
                        }
                    } else {
                        if (partnerMail) {
                            db.Price.find({
                                where: {
                                    event_id: eventId,
                                    name: { like: '%partenaire en prévente' }
                                }
                            }).complete(function (err, price) {
                                if (err || !price) {
                                    return Error.emit(res, 500, '500 - SQL Server error', err);
                                }

                                resolve(price, barcode, 0, 0);
                            });
                        } else {
                            db.Price.find({
                                where: {
                                    event_id: eventId,
                                    name: { like: '%extérieur en prévente' }
                                }
                            }).complete(function (err, price) {
                                if (err || !price) {
                                    return Error.emit(res, 500, '500 - SQL Server error', err);
                                }

                                resolve(price, barcode, 0, 0);
                            });
                        }
                    }
                });
            })
            .then(function (price, barcode, student, contributor) {
                return db.Ticket.create({
                    username: (req.user) ? req.user.id : 0,
                    displayName: req.form.displayName,
                    birthdate: req.form.birthdate,
                    mail: req.form.mail,
                    student: student,
                    contributor: contributor,
                    paid: 1,
                    paid_at: new Date(),
                    paid_with: 'card',
                    barcode: barcode,
                    price_id: price.id,
                    event_id: eventId
                });
            });

            /**
             * Generates a barcode
             * @param {Function} callback Called when found a valid barcode
             */
            function generateBarcode (callback) {
                var base = 989000000000;
                var max =     999999999;
                var min =             0;

                var number = Math.floor(Math.random() * (max - min + 1) + min);
                var barcode = base + number;

                db.Ticket.count({
                    where: {
                        barcode: barcode
                    }
                }).complete(function (err, count) {
                    if (err) {
                        return Error.emit(res, 500, '500 - SQL Server error', err.toString());
                    }

                    if (count === 0) {
                        callback(barcode);
                    } else {
                        logger.warn('Needed to regenerate barcode.');
                        // Barcode already exists, call again
                        generateBarcode(callback);
                    }
                });
            }
        };
    };
};
