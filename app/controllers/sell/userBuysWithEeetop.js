//////////////////////////////////////////
// User buys one ticket from an eee-top //
//////////////////////////////////////////

'use strict';

var Promise = require('bluebird');

module.exports = function (db, config) {
    var logger          = require('../../lib/log')(config);
    var rest            = require('../../lib/rest')(config, logger);
    var generateBarcode = require('../../lib/generateBarcode');

    return function (req, res) {
        var user     = req.body.user || null;
        var article  = req.body.article || null;
        var price    = req.body.price || null;
        var purchase = req.body.purchase || null;

        if (!user || !article || !price || !purchase) {
            return Error.emit(res, 400, '400 - Bad Request', 'missing user, article, price or purchase');
        }

        var barcode;
        var priceLocal;

        // First, check article and purchase exists
        rest
            .get('purchases/' + purchase.id)
            .then(function (purchaseRes) {
                if (!purchaseRes.data.data.id) {
                    throw 'no purchase (forged request or bug)';
                }
                return rest.get('articles/' + article.id);
            })
            .then(function () {
                // Then, get the price
                return db.Price.find({
                    where: {
                        backendId: price.id
                    }
                });
            })
            .then(function (priceLocal_) {
                priceLocal = priceLocal_;

                // Genreates a barcode
                return new Promise(function (resolve) {
                    generateBarcode(resolve, reject, db.Ticket);
                });
            })
            .then(function (newBarcode) {
                barcode = newBarcode;
                return rest.get('users/' + user.id + '?isInBDE=1');
            })
            .then(function (inBDERes) {
                user.inBDE = Boolean(inBDERes.data);
                // Third, make the Ticket
                return db.Ticket.create({
                    username: user.id,
                    displayName: user.firstname.nameCapitalize() + ' ' + user.lastname.nameCapitalize(),
                    student: 1,
                    mail: user.mail,
                    contributor: user.inBDE,
                    paid: 1,
                    paid_at: purchase.date,
                    paid_with: 'buckutt',
                    temporarlyOut: false,
                    barcode: barcode,
                    price_id: priceLocal.id,
                    event_id: priceLocal.event_id
                });
            })
            .then(function (ticket) {
                return res
                        .status(200)
                        .json({
                            ticket_id: ticket.id
                        })
                        .end();
            })
            .catch(function (err) {
                return Error.emit(res, 500, '500 - Server Error', err);
            });
    };
};
