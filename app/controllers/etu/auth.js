////////////////////////////////
// Auth the etu with back-end //
////////////////////////////////

'use strict';

var crypto  = require('crypto');
var request = require('request');
var bcrypt  = require('bcryptjs');

module.exports = function (db, config) {
    var logger = require('../../lib/log')(config);
    var rest   = require('../../lib/rest')(config, logger);

    return function (req, res, next) {
        if (!req.form.isValid) {
            Error.emit(res, 400, '400 - Bad Request', req.form.errors);
            return;
        }

        var username = req.form.username;
        var password = req.form.password;
        var hash = bcrypt.hashSync(password);
        var sha512 = crypto.createHash('sha512');
        sha512.update(username + ':' + password);
        var token = sha512.digest('hex');

        logger.info('Asking axel back end with : ' + username + '/' + password);

        var result;
        // username is a positive number => auth with card number
        if (!Number.isPositiveNumeric(username)) {
            // Auth with email
            result = rest.get('users?mail=' + username).success(function (data) {
                goAhead(data, checkPassword);
            }).error(function () {
                Error.emit(res, 500, '500 - Buckutt server error', 'Mail failed');
                return;
            });
        } else {
            // First get the user id (via its meanoflogin)
            rest.get('meanofloginsusers?data=' + username).success(function (data) {
                goAhead(data, function (data) {
                    // Then auth with userid
                    rest.get('users?id=' + data.UserId).success(function (data) {
                        goAhead(data, checkPassword);
                    }).error(function () {
                        Error.emit(res, 500, '500 - Buckutt server error', 'User data after etu card failed');
                        return;
                    });
                });
            }).error(function () {
                Error.emit(res, 500, '500 - Buckutt server error', 'Etu card number failed');
                return;
            });
        }

        // Callback wrapper
        function goAhead (data, next) {
            if (data === null) {
                Error.emit(res, 400, '400 - Invalid username/password');
                return;
            }
            next(data);
        }

        function checkPassword (data) {
            if (bcrypt.compareSync(req.form.password, data.password)) {
                req.user = data;
                req.user.token = token;

                // Get tickets
                db.Ticket.findAll({
                    where: {
                        username: req.user.id
                    }
                }).done(function (err, tickets) {
                    if (err) {
                        Error.emit(res, 500, '500 - SQL Server error', err);
                        return;
                    }

                    req.user.tickets = tickets;

                    req.user.fundations = [
                        { id: 1, name: 'BDE', isInBoard: true },
                        { id: 2, name: 'UNG', isInBoard: false }
                    ];
                    req.user.isAdmin = false;
                    next();
                });
            } else {
                Error.emit(res, 400, '400 - Invalid username/password');
                return;
            }
        }
    };
};
