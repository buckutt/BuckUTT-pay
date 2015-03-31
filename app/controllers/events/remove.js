///////////////////
// Event remover //
///////////////////

'use strict';

var Promise = require('bluebird');
var fs      = require('fs');
var path    = require('path');

module.exports = function (db, config) {
    var logger = require('../../lib/log')(config);
    var rest   = require('../../lib/rest')(config, logger);

    return function (req, res) {
        db.Event
            .find(req.params.eventId)
            .then(function (event) {
                var prices;

                // Get prices to remove periods
                rest
                    .get('prices?ArticleId=' + event.backendId)
                    .then(function (rPrices) {
                        prices = rPrices.data.data;
                        var periodId = prices[0].PeriodId;

                        // Remove period
                        return rest.delete('periods/' + periodId);
                    })
                    .then(function () {
                        // Remove prices
                        prices = prices.map(function (price) {
                            return rest.delete('prices/' + price.id);
                        });

                        return Promise.all(prices);
                    })
                    .then(function () {
                        // Remove Article (should remove ArticlePoints too)
                        return rest.delete('articles/' + event.backendId);
                    })
                    .then(function () {
                        var picturePath = path.resolve(process.cwd() + '/app/public/static/img/upload') + '/' + event.picture;
                        var newPicturePath = picturePath + '.deleted';
                        fs.rename(picturePath, newPicturePath);
                        logger.info('Moving file ' + picturePath + ' to ' + newPicturePath);

                        event
                            .destroy()
                            .complete(function () {
                                return res
                                        .status(200)
                                        .end();
                            })
                            .catch(function (err) {
                                return Error.emit(res, 500, '500 - SQL Error', err);
                            });
                    })
                    .catch(function (err) {
                        Error.emit(res, 500, '500 - Buckutt server error', err);
                    });
            })
            .catch(function (err) {
                return Error.emit(res, 500, '500 - SQL Error', err);
            });
    };
};
