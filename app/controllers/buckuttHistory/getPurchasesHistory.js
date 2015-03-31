//////////////////////////////////////////////
// Get the lasts purchases made by the user //
//////////////////////////////////////////////

'use strict';

module.exports = function (db, config) {
    var logger = require('../../lib/log')(config);
    var rest   = require('../../lib/rest')(config, logger);

    return function (req, res) {
        var url = 'purchases?buyerid=' + req.user.id + '&embed=article,point,seller';

        rest
            .get(url)
            .then(function (pRes) {
                var purchases = [];
                pRes.data.data.forEach(function (purchaseData) {
                    var newPurchase = {
                        date: purchaseData.date,
                        price: purchaseData.price / 100,
                        article: purchaseData.Article.name,
                        where: purchaseData.Point.name,
                        seller: purchaseData.Seller.firstname.nameCapitalize() +
                                ' ' + purchaseData.Seller.lastname.nameCapitalize()
                    };

                    purchases.push(newPurchase);
                });

                return res
                        .status(200)
                        .json(purchases)
                        .end();
            })
            .catch(function (err) {
                return Error.emit(res, 500, '500 - Buckutt server error', err);
            });
    };
};
