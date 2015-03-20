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

                    resolve(price);
                });
            }
        })
        .then(function (price) {
            priceWanted = price;
            return rest.get('prices/' + price.backendId)
        })
        .then(function (resBackendPrice) {
            priceWantedBackend = resBackendPrice.data.data;
            return rest.get('articles/' + priceWantedBackend.ArticleId);
        })
        .then(function (resArticle) {
            var article = resArticle.data.data;
            rest.post('services/purchase', {
                PointId: 1,
                SellerId: req.user.id,
                BuyerId: req.user.id,
                cart: [
                    {
                        article: {
                            id: article.id,
                            price: priceWantedBackend.credit,
                            FundationId: priceWantedBackend.FundationId,
                            type: 'product'
                        },
                        quantity: 1
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
                mail: req.form.mail,
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
        .then(function () {
            res.end();
        });
    };
};
