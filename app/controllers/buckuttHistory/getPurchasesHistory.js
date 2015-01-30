//////////////////////////////////////////////
// Get the lasts purchases made by the user //
//////////////////////////////////////////////

'use strict';

module.exports = function (db, config) {
    var logger = require('../../lib/log')(config);
    var rest   = require('../../lib/rest')(config, logger);

    return function (req, res) {
        var url = 'purchases?buyerid=' + req.get('Auth-User') +
                  '&embed=article,point,seller'
        rest.get(url).success(function (data) {
            var purchases = [];
            data.forEach(function (purchaseData) {
                var newPurchase = {
                    date: purchaseData.date,
                    price: purchaseData.price / 100,
                    article: purchaseData.Article.name,
                    where: purchaseData.Point.name,
                    seller: purchaseData.Seller.firstname.nameCapitalize()
                            + ' ' +
                            purchaseData.Seller.lastname.nameCapitalize()
                };

                purchases.push(newPurchase);
            });

            res.json(purchases);
        }).error(function () {
            Error.emit(res, 500, '500 - Buckutt server error', 'Get purchases');
        });
    };
};
