// Pay - /app/models/seed/price.js

// Seeds some price

'use strict';

module.exports = function (db) {
    db.Price.create({
        name: 'Gala 2015 - Prix étudiant cottisant en prévente',
        price: 25.0
    }).complete(function (err, priceGalaEtuCotisant) {
        if (err) {
            Error.emit(null, 500, '500 - SQL Server error', err.toString());
        }

        db.Price.create({
            name: 'Gala 2015 - Prix étudiant cottisant hors prévente',
            price: 25.0
        }).complete(function (err, priceGalaEtu) {
            if (err) {
                Error.emit(null, 500, '500 - SQL Server error', err.toString());
            }

            db.Event.find({ name: 'Gala 2015' }).complete(function (err, gala2015) {
                gala2015.setPrices([priceGalaEtuCotisant, priceGalaEtu]);
            });
        });
    });
};
