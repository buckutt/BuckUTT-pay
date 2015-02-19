///////////////////////
// Seeds some events //
///////////////////////

'use strict';

module.exports = function (db) {
    db.Event.create({
        name: 'Gala 2015',
        picture: 'gala2015.png',
        description: 'Viens au gala on est bien bien bien bien',
        date: new Date(2015, 5, 20, 20, 0, 0),
        maximumTickets: 3600,
        opened: true,
        fundationId: 1,
        backendId: 1
    }).complete(function (err) {
        if (err) {
            Error.emit(null, 500, '500 - SQL Server error ', err.toString());
        }
    
        db.Event.create({
            name: 'R2D A2015',
            picture: 'gala2015.png',
            description: 'Bis Viens au gala on est bien bien bien bien',
            date: new Date(2015, 5, 20, 20, 0, 0),
            maximumTickets: 1600,
            opened: false,
            fundationId: 1,
            backendId: 1
        }).complete(function (err) {
            if (err) {
                Error.emit(null, 500, '500 - SQL Server error', err.toString());
            }
        });
    });
};
