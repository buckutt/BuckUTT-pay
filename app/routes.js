// Pay - /app:routes.js

// Routing

'use strict';

var validators = require('./controllers/validators');

module.exports = function (router, db, config) {
    var controllers = require('./controllers')(db, config);

    // Tickets
    router.get(
        '/tickets',
        controllers.tickets.getAll
    );

    // Events
    router.route('/events').
        get(
            controllers.events.getAll
        )
        .post(
            validators.createEvent,
            controllers.events.create
        )
        .put(
            validators.editEvent,
            controllers.events.edit
        );

    router.route('/events/:eventId')
        .delete(
            controllers.events.remove
        )
        .get(
            controllers.events.getOne
        );

    // Events ticket
    router.get(
        '/events/:eventId/tickets',
        controllers.tickets.getAllFromEvent
    );

    // Auth etu
    router.post(
        '/authEtu',
        controllers.etu
    );

    router.param('eventId', function (req, res, next, eventId) {
        if (Number.isPositiveNumeric(eventId)) {
            req.body.eventId = eventId;
            next();
        } else {
            Error.emit(res, 400, '400 - Bad Request');
        }
    });
};
