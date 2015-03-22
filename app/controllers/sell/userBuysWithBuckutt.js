//////////////////////////////////////
// User buys one ticket for himself //
//////////////////////////////////////

'use strict';

var Promise = require('bluebird');

module.exports = function (db, config) {
    var logger          = require('../../lib/log')(config);
    var rest            = require('../../lib/rest')(config, logger);
    var generateBarcode = require('../../lib/generateBarcode');

    return function (req, res) {
        var eventId = req.params.eventId;
        if (!req.form.isValid) {
            return Error.emit(res, 400, '400 - Bad Request', req.form.errors);
        }

        var priceWanted;
        var priceWantedBackend;
        var priceWantedExt;
        var priceWantedExtBackend;
        var articleId;
        var articleIdExt;
        var newTicketId;

        var additionalExtTickets = req.body.additionalExtTickets || [];

        new Promise(function (resolve, reject) {
            if (req.user.inBDE) {
                db.Price.find({
                    where: {
                        event_id: eventId,
                        name: { like: '%cotisant en prévente' }
                    }
                }).complete(function (err, price) {
                    if (err) {
                        return Error.emit(res, 500, '500 - SQL Server error', err);
                    }

                    if (!price) {
                        Error.emit(res, 404, '404 - Not found', err, 'no price');
                        return reject();
                    }

                    resolve(price);
                });
            } else {
                db.Price.find({
                    where: {
                        event_id: eventId,
                        name: { like: '%non-cotisant en prévente' }
                    }
                }).complete(function (err, price) {
                    if (err) {
                        return Error.emit(res, 500, '500 - SQL Server error', err);
                    }

                    if (!price) {
                        Error.emit(res, 404, '404 - Not found', err, 'no price');
                        return reject();
                    }

                    resolve(price);
                });
            }
        })
        .then(function (price) {
            priceWanted = price;
            return rest.get('prices/' + price.backendId);
        })
        .then(function (resBackendPrice) {
            priceWantedBackend = resBackendPrice.data.data;
            return rest.get('articles/' + priceWantedBackend.ArticleId);
        })
        .then(function (resArticle) {
            articleId = resArticle.data.data.id;
        })
        .then(function () {
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
                        Error.emit(res, 404, '404 - Not found', err);
                        return reject();
                    }

                    resolve(price);
                });
            });
        })
        .then(function (price) {
            priceWantedExt = price;
            return rest.get('prices/' + price.backendId);
        })
        .then(function (resBackendPrice) {
            priceWantedExtBackend = resBackendPrice.data.data;
            return rest.get('articles/' + priceWantedExtBackend.ArticleId);
        })
        .then(function (resArticle) {
            articleIdExt = resArticle.data.data.id;
        })
        .then(function () {
            return rest.post('services/purchase', {
                PointId: 1,
                SellerId: req.user.id,
                BuyerId: req.user.id,
                cart: [
                    {
                        article: {
                            id: articleId,
                            price: priceWantedBackend.credit,
                            FundationId: priceWantedBackend.FundationId,
                            type: 'product'
                        },
                        quantity: 1
                    },
                    {
                        article: {
                            id: articleIdExt,
                            price: priceWantedExtBackend.credit,
                            FundationId: priceWantedExtBackend.FundationId,
                            type: 'product'
                        },
                        quantity: additionalExtTickets.length
                    }
                ]
            });
        })
        .then(function () {
            return new Promise(function (resolve, reject) {
                generateBarcode(resolve, db.Ticket);
            });
        })
        .then(function (barcode) {
            return db.Ticket.create({
                username: req.user.id,
                displayName: req.user.firstname.nameCapitalize() + ' ' + req.user.lastname.nameCapitalize(),
                birthdate: req.form.birthdate,
                mail: req.user.mail,
                student: 1,
                contributor: req.user.inBDE,
                paid: 1,
                paid_at: new Date(),
                paid_with: 'buckutt',
                validatedDate: null,
                temporarlyOut: false,
                barcode: barcode,
                price_id: priceWanted.id,
                event_id: eventId
            });
        })
        .then(function (newTicket) {
            newTicketId = newTicket.id;
            if (additionalExtTickets) {
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
            if (additionalExtTickets) {
                return additionalExtTickets.map(function (additionalExtTicket, i) {
                    return db.Ticket.create({
                        username: req.user.id,
                        displayName: additionalExtTicket.displayName,
                        birthdate: additionalExtTicket.birthdate,
                        mail: req.user.mail,
                        student: 0,
                        contributor: 0,
                        paid: 1,
                        paid_at: new Date(),
                        paid_with: 'buckutt',
                        barcode: barcodes[i],
                        price_id: priceWantedExt.id,
                        event_id: eventId,
                        mainTicket: newTicketId
                    })
                });
            }
        })
        .then(function () {
            res.status(200).json({
                id: newTicketId
            }).end();
        }).catch(function (err) {
            console.dir(err);
            res.end();
        });
    };
};
