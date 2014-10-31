// Pay - /app/models/seed/events.js

// Seeds some events

'use strict';

module.exports = function (db) {
    db.Event.create({
        name: 'Gala 2015',
        picture: 'gala2015.png',
        description: 'Viens au gala on est bien bien bien bien',
        date: new Date(2015, 5, 20, 20, 0, 0),
        maximumTickets: 3600,
        opened: true
    }).complete(function (err, gala2015) {
        if (err) {
            Error.emit(null, 500, '500 - SQL Server error ', err.toString());
        }

        db.Association.find({ name: 'BDE' }).complete(function (err, bde) {
            if (err) {
                Error.emit(null, 500, '500 - SQL Server error', err.toString());
            }

            gala2015.setAssociation(bde);
        });
    
        db.Event.create({
            name: 'R2D A2015',
            picture: 'gala2015.png',
            description: 'Bis Viens au gala on est bien bien bien bien',
            date: new Date(2015, 5, 20, 20, 0, 0),
            maximumTickets: 1600,
            opened: false
        }).complete(function (err, r2d2015) {
            if (err) {
                Error.emit(null, 500, '500 - SQL Server error', err.toString());
            }

            db.Association.find({ name: 'BDE' }).complete(function (err, bde) {
                if (err) {
                    Error.emit(null, 500, '500 - SQL Server error', err.toString());
                }

                r2d2015.setAssociation(bde);
            });
        });
    });
};
