//////////////////////////////////////
// User buys one ticket for himself //
//////////////////////////////////////

'use strict';

var Promise = require('bluebird');

module.exports = function (db) {
    return function (req, res) {
        var eventId = req.eventId;
        
        /**
         * Gets the price for this event
         * @return {Function} Bluebird instance
         */
        function getPrice () {
            return new Promise(function (resolve, reject) {
                if (req.user.inBDE) {
                    db.Price.find({
                        where: {
                            event_id: eid,
                            name: { like: '%cotisant en prévente' }
                        }
                    }).complete(function (err, price) {
                        if (err) {
                            return Error.emit(res, 500, '500 - SQL Server error', err);
                        }

                        resolve(price.price);
                    });
                }

                db.Price.find({
                    where: {
                        event_id: eid,
                        name: { like: '%non-cotisant en prévente' }
                    }
                }).complete(function (err, price) {
                    if (err) {
                        return Error.emit(res, 500, '500 - SQL Server error', err);
                    }

                    resolve(price.price);
                });
            });
        }

        /**
         * Checks if the user has enought credit
         * @param  {number}  price The ticket price
         * @return {Function}      Bluebird instance
         */
        function checkCredit (price) {
            return new Promise(function (resolve, reject) {
                if (req.user.credit < price) {
                    Error.emit(res, 402, '402 - Refused payement', req.user.credit - price);
                    return reject();
                }

                return resolve;
            });
        }

        function doPayement () {
            return new Promise(function (resolve, reject) {
                
            });
        }
    };
};
