//////////////////////////////////////////////
// Gets an event price for an external user //
//////////////////////////////////////////////

'use strict';

module.exports = function (db, config) {
    return function (req, res) {
        var logger = require('../../lib/log')(config);

        var eid = req.params.eventId;
        // If an user is connected
        db.Price
            .find({
                where: {
                    event_id: eid,
                    name: { like: '%extérieur en prévente' }
                }
            })
            .then(function (price) {
                if (!price) {
                    return res
                            .status(404)
                            .end();
                }

                return res
                        .status(200)
                        .end(price.price.toString());
            })
            .catch(function (err) {
                return Error.emit(res, 500, '500 - SQL Server error', err);
            });
    };
};
