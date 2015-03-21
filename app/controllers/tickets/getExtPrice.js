//////////////////////////////////////////////
// Gets an event price for an external user //
//////////////////////////////////////////////

'use strict';

module.exports = function (db, config) {
    return function (req, res) {
        var logger = require('../../lib/log')(config);
        var rest   = require('../../lib/rest')(config, logger);

        var eid = req.params.eventId;
        // If an user is connected
        db.Price.find({
            where: {
                event_id: eid,
                name: { like: '%extérieur en prévente' }
            }
        }).complete(treatPrice);

        function treatPrice (err, price) {
            if (err) {
                return Error.emit(res, 500, '500 - SQL Server error', err);
            }

            if (!price) {
                return res.status(404).end();
            }

            var priceValue = price.price || price.dataValues.price;
            res.status(200).end(priceValue.toString());
        }
    };
};
