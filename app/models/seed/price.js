//////////////////////
// Seeds some price //
//////////////////////

'use strict';

module.exports = function (db) {
    db.Price.create({
        name: 'Gala 2015 - Prix étudiant cotisant en prévente',
        price: 25.0,
        backendId: 0
    }).complete(function (err, priceGalaEtuCotisantPre) {
        if (err) {
            Error.emit(null, 500, '500 - SQL Server error', err.toString());
        }

        db.Price.create({
            name: 'Gala 2015 - Prix étudiant cotisant hors prévente',
            price: 25.0,
            backendId: 0
        }).complete(function (err, priceGalaEtuNonPre) {
            if (err) {
                Error.emit(null, 500, '500 - SQL Server error', err.toString());
            }

            db.Price.create({
                name: 'Gala 2015 - Prix étudiant non-cotisant en prévente',
                price: 25.0,
                backendId: 0
            }).complete(function (err, priceGalaEtuNonCotPre) {
                if (err) {
                    Error.emit(null, 500, '500 - SQL Server error', err.toString());
                }

                db.Price.create({
                    name: 'Gala 2015 - Prix étudiant non-cotisant en prévente',
                    price: 25.0,
                    backendId: 0
                }).complete(function (err, priceGalaEtuNonCotNonPre) {
                    if (err) {
                        Error.emit(null, 500, '500 - SQL Server error', err.toString());
                    }

                    db.Event.find({ name: 'Gala 2015' }).complete(function (err, gala2015) {
                        gala2015.setPrices([priceGalaEtuCotisantPre, priceGalaEtuNonPre,
                                            priceGalaEtuNonCotPre,   priceGalaEtuNonCotNonPre]);
                    });
                });
            });
        });
    });
};
