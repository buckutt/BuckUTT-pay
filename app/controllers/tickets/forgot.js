/////////////////////////////////////////
// Send a mail with all user's tickets //
/////////////////////////////////////////

'use strict';

module.exports = function (db, config) {
    return function (req, res) {
        var logger = require('../../lib/log')(config);
        var mailer = require('../../lib/mailer')(config);
        var rest   = require('../../lib/rest')(config, logger);

        // Get username from mail
        rest.get('users?mail=' + req.params.mail).success(function (user) {
            if (!user) {
                Error.emit(res, 400, '400 - Bad Request', 'No mail');
                return;
            }

            var username = user.id;

            // Get tickets
            db.Ticket.findAll({
                where: {
                    username: username
                }
            }).done(function (err, tickets) {
                if (err) {
                    Error.emit(res, 500, '500 - SQL Server error', err);
                    return;
                }

                if (!tickets) {
                    res.status(404);
                    res.end();
                    return;
                }

                var places = {};
                var todo = tickets.length;
                tickets.forEach(function (ticket) {
                    ticket.getEvent().then(function (event) {
                        --todo;

                        places[event.name] = 'http//www.google.fr/';

                        if (todo === 0) {
                            mailer('gabriel.juchault@gmail.com', 'Places Buckutt', places);
                            res.json({
                                status: 200
                            });
                        }
                    }, function (err) {
                        console.log(err);
                    });
                });
            });
        }).error(function () {
            Error.emit(res, 500, '500 - Buckutt server error', 'Get mail');
        });
    };
};
