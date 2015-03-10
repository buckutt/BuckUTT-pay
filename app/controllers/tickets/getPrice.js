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
            var mail = (req.query.mail === 'undefined') ? undefined : req.query.mail;
            db.SchoolDomain.findAll().complete(function (err, domains) {
                if (err) {
                    return Error.emit(res, 500, '500 - SQL Server error', err);
                }

                var partnerPrice = false;
                domains.forEach(function (domain) {
                    var reg = new RegExp('@' + domain.domain + '$', 'i');
                    if (reg.test(mail)) {
                        partnerPrice = true;
                    }
                });

                if (partnerPrice) {
                    db.Price.find({
                        where: {
                            event_id: eid,
                            name: { like: '%extérieur en prévente' }
                        }
                    }).complete(treatPrice);
                } else {
                    db.Price.find({
                        where: {
                            event_id: eid,
                            name: { like: '%partenaire en prévente' }
                        }
                    }).complete(treatPrice);
                }
            });
            return;
        }

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
