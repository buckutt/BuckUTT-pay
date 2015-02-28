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
            console.log(eid);
            var date = new Date();
            // If he's in bde
            rest.get('users/' + uid + '?isInBDE=true').then(function (uRes) {
                var inBDE = Boolean(uRes.data);;
                if (inBDE) {
                    db.Price.find({
                        where: {
                            event_id: eid,
                            name: { like: '%cotisant en prévente' }
                        }
                    }).complete(function (err, price) {
                        if (err) {
                            return Error.emit();
                        }

                        res.status(200).end(price.price);
                    });
                } else {
                    db.Price.find({
                        where: {
                            event_id: eid,
                            name: { like: '%cotisant en prévente' }
                        }
                    }).complete(function (err, price) {
                        if (err) {
                            return Error.emit();
                        }

                        res.status(200).end(price.price);
                    });
                }
            }, function () {
                Error.emit(res, 500, '500 - Buckutt server error', 'Check isInBDE');
            });
        } else {
            res.json({
                price: 20
            });
        }
    };
};
