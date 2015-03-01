/////////////////////////
// Gets an event price //
/////////////////////////

'use strict';

module.exports = function (db, config) {
    return function (req, res) {
        var logger = require('../../lib/log')(config);
        var rest   = require('../../lib/rest')(config, logger);

        // If an user is connected
        if (req.user) {
            var uid = req.user.id;
            var eid = req.params.eventId;
            // If he's in bde
            if (req.user.inBDE) {
                db.Price.find({
                    where: {
                        event_id: eid,
                        name: { like: '%cotisant en prévente' }
                    }
                }).complete(treatPrice);
            } else {
                db.Price.find({
                    where: {
                        event_id: eid,
                        name: { like: '%non-cotisant en prévente' }
                    }
                }).complete(treatPrice);
            }
        } else {
            res.json({
                price: 20
            });
        }

        function treatPrice (err, price) {
            if (err) {
                return Error.emit(res, 500, '500 - SQL Server error', err);
            }

            if (!price) {
                return res.status(400).end();
            }

            var priceValue = price.price || price.dataValues.price;
            res.status(200).end(priceValue.toString());
        }
    };
};
