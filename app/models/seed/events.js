// Pay - /app/models/seed/events.js

// Seeds some events

'use strict';

module.exports = function (db) {
    db.Event.create({
        name: 'Gala 2015',
        picture: 'gala2015.png',
        description: 'Viens au gala on est bien bien bien bien',
        date: new Date(2015, 5, 20, 20, 0, 0)
    });
    
    db.Event.create({
        name: 'R2D A2015',
        picture: 'gala2015.png',
        description: 'Bis Viens au gala on est bien bien bien bien',
        date: new Date(2015, 5, 20, 20, 0, 0)
    });
};
