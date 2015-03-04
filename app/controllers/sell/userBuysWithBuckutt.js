// User buys one ticket for himself //
//////////////////////////////////////

'use strict';

var Promise = require('bluebird');

module.exports = function (db, config) {
    var logger   = require('../../lib/log')(config);
    var rest     = require('../../lib/rest')(config, logger);

    return function (req, res) {
        var eventId = req.params.eventId;
        
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
                            FundationId: article.FundationId,
                            type: 'product'
                        },
                        quantity: 1
                    }
                ]
            });
        })
        .then(function () {
            return new Promise(function (resolve, reject) {
                generateBarcode(resolve);
            });
        })
        .then(function (barcode) {
            return db.Ticket.create({
                username: req.user.id,
                displayName: req.user.firstname.nameCapitalize() + ' ' + req.user.lastname.nameCapitalize(),
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
