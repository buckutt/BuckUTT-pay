////////////////////////////////
// Auth the etu with back-end //
////////////////////////////////

'use strict';

var crypto  = require('crypto');
var bcrypt  = require('bcryptjs');

module.exports = function (db, config) {
    var logger = require('../../lib/log')(config);
    var rest   = require('../../lib/rest')(config, logger);

    return function (req, res, next) {
        if (!req.form.isValid) {
            return Error.emit(res, 400, '400 - Bad Request', req.form.errors);
        }

        var username = req.form.username;
        var password = req.form.password;

        logger.info('Asking axel back end with : ' + username + '/' + password);

        // username is a positive number => auth with card number
        if (!Number.isPositiveNumeric(username)) {
            // Auth with email
            rest.get('users?mail=' + username).success(function (data) {
                goAhead(data, checkPassword);
            }).error(function () {
                return Error.emit(res, 500, '500 - Buckutt server error', 'Mail failed');
            });
        } else {
            // First get the user id (via its meanoflogin)
            rest.get('meanofloginsusers?data=' + username).success(function (data) {
                goAhead(data, function (data) {
                    // Then auth with userid
                    rest.get('users?id=' + data.UserId).success(function (data) {
                        goAhead(data, checkPassword);
                    }).error(function () {
                        return Error.emit(res, 500, '500 - Buckutt server error', 'User data after etu card failed');
                    });
                });
            }).error(function () {
                return Error.emit(res, 500, '500 - Buckutt server error', 'Etu card number failed');
            });
        }

        /**
         * Callback wrapper
         * @param  {object}   data Data to pass to next callback
         * @param  {Function} next Callback
         */
        function goAhead (data, next) {
            if (data === null) {
                return Error.emit(res, 401, '401 - Invalid username/password');
            }
            next(data);
        }

        /**
         * Checks if the passwords matches and call getTickets
         * @param  {object} data User data
         */
        function checkPassword (data) {
            if (bcrypt.compareSync(req.form.password, data.password)) {
                req.user = data;

                req.user.firstname = req.user.firstname.nameCapitalize();
                req.user.lastname  = req.user.lastname.nameCapitalize();

                getTickets();
            } else {
                return Error.emit(res, 401, '401 - Invalid username/password');
            }
        }

        /**
         * Gets the user tickets and call checkIfFundationAccount
         */
        function getTickets () {
            db.Ticket.findAll({
                where: {
                    username: req.user.id
                }
            }).done(function (err, tickets) {
                if (err) {
                    return Error.emit(res, 500, '500 - SQL Server error', err);
                }

                var realTickets = [];
                tickets.forEach(function (ticket) {
                    realTickets.push(ticket.dataValues);
                });

                req.user.tickets = realTickets;

                checkIfFundationAccount();
            });
        }

        /**
         * Checks if the user is an account user (with fund_user right) and call checkIfAdmin
         */
        function checkIfFundationAccount () {
            rest.get('users/' + req.user.id + '/rights').success(function (rights) {
                if (!rights || rights.length === 0) {
                    return checkIfAdmin(rights);
                }

                rights.forEach(function (right) {
                    if (right.name === 'fund_user') {
                        req.user.fundation = {
                            id: right.UsersRights.FundationId
                        };

                        // Récupérer le nom de l'asso
                        rest.get('fundations/' + right.UsersRights.FundationId).success(function (fundationData) {
                            req.user.fundation.name = fundationData.name;
                            checkIfAdmin(rights);
                        }).error(function () {
                            return Error.emit(res, 500, '500 - Buckutt server error', 'Fundation failed');
                        });
                    }
                });
            }).error(function () {
                return Error.emit(res, 500, '500 - Buckutt server error', 'Rights failed');
            });
        }

        /**
         * Check if the user is an admin and call the next middleware
         * @param  {object} rights The rights object from checkIfFundationAccount (avoid same request)
         */
        function checkIfAdmin (rights) {
            req.user.isAdmin = false;
            rights.forEach(function (right) {
                if (right.name === 'droit_admin') {
                    req.user.isAdmin = true;
                }
            });
            next();
        }
    };
};
