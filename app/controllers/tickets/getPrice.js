/////////////////////////
// Gets an event price //
/////////////////////////

'use strict';

module.exports = function (db) {
    return function (req, res) {
        var eid = req.params.eventId;
        // If an user is connected
        if (req.user) {
            // If he's in bde
            if (req.user.inBDE) {
                db.Price
                    .find({
                        where: {
                            event_id: eid,
                            name: { like: '%cotisant en prévente' }
                        }
                    })
                    .then(treatPrice)
                    .catch(treatPriceErr);
            } else {
                db.Price
                    .find({
                        where: {
                            event_id: eid,
                            name: { like: '%non-cotisant en prévente' }
                        }
                    })
                    .then(treatPrice)
                    .catch(treatPriceErr);
            }
        } else {
            var mail = (req.query.mail === 'undefined') ? undefined : req.query.mail;
            db.SchoolDomain
                .findAll()
                .then(function (domains) {
                    var partnerPrice = false;
                    domains.forEach(function (domain) {
                        var reg = new RegExp('@' + domain.domain + '$', 'i');
                        if (reg.test(mail)) {
                            partnerPrice = true;
                        }
                    });

                    if (partnerPrice) {
                        db.Price
                            .find({
                                where: {
                                    event_id: eid,
                                    name: { like: '%partenaire en prévente' }
                                }
                            })
                            .then(function (price) {
                                if (!price) {
                                    db.Price
                                        .find({
                                            where: {
                                                event_id: eid,
                                                name: { like: '%extérieur en prévente' }
                                            }
                                        })
                                        .then(treatPrice)
                                        .catch(treatPriceErr);
                                }

                                return res
                                        .status(200)
                                        .end(price.price.toString());
                            })
                            .catch(function (err) {
                                return Error.emit(res, 500, '500 - SQL Server error', err);
                            });
                    } else {
                        db.Price
                            .find({
                                where: {
                                    event_id: eid,
                                    name: { like: '%extérieur en prévente' }
                                }
                            })
                            .then(treatPrice)
                            .catch(treatPriceErr);
                    }
                })
                .catch(function (err) {
                    return Error.emit(res, 500, '500 - SQL Server error', err);
                });
        }

        function treatPrice (price) {
            if (!price) {
                return res
                        .status(404)
                        .end();
            }

            return res
                    .status(200)
                    .end(price.price.toString());
        }

        function treatPriceErr (err) {
            return Error.emit(res, 500, '500 - SQL Server error', err);
        }
    };
};
