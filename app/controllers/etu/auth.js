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

        /**
         * Callback wrapper
         * @param  {object}   data Data to pass to next callback
         * @param  {Function} next Callback
         */
        function goAhead (data, next) {
            if (data === null) {
                Error.emit(res, 400, '400 - Invalid username/password');
                return;
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

                req.user.token = token;

                getTickets();
            } else {
                Error.emit(res, 400, '400 - Invalid username/password');
                return;
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
                    Error.emit(res, 500, '500 - SQL Server error', err);
                    return;
                }

                req.user.tickets = tickets;

                checkIfFundationAccount();
            });
        }

        /**
         * Checks if the user is an account user (with fund_user right) and call checkIfAdmin
         */
        function checkIfFundationAccount () {
            rest.get('users/' + req.user.id + '/rights').success(function (rights) {
                if (!rights || rights.length === 0) {
                    checkIfAdmin(rights);
                    return;
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
                            Error.emit(res, 500, '500 - Buckutt server error', 'Fundation failed');
                            return;
                        });
                    }
                });
            }).error(function () {
                Error.emit(res, 500, '500 - Buckutt server error', 'Rights failed');
                return;
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
