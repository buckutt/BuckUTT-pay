////////////////////////////////
// Auth the etu with back-end //
////////////////////////////////

'use strict';

var bcrypt  = require('bcryptjs');
var Promise = require('bluebird');

module.exports = function (db, config) {
    var logger = require('../../lib/log')(config);
    var rest   = require('../../lib/rest')(config, logger);

    return function (req, res, next) {
        if (!res.locals.shouldNotCheckPassword && !req.form.isValid) {
            return Error.emit(res, 400, '400 - Bad Request', req.form.errors);
        }

        var username = (!res.locals.shouldNotCheckPassword) ? req.form.username : res.locals.forcedUsername;
        var password = (!res.locals.shouldNotCheckPassword) ? req.form.password : undefined;

        logger.info('Asking axel back end with : ' + username + '/' + password);

        // username is a positive number and not login etu => auth with card number
        if (!Number.isPositiveNumeric(username) && !/^\w[\w_]+\d?$/i.test(username)) {
            // Auth with email
            rest
                .get('users?mail=' + username)
                .then(function (uRes) {
                    return uRes.data;
                })
                .then(checkPassword)
                .then(getTickets)
                .then(checkIfFundationAccount)
                .then(checkIfAdmin)
                .then(checkBdeMember)
                .catch(function (err) {
                    return Error.emit(res, 500, '500 - Buckutt server error', 'Mail auth failed', err);
                });
        } else {
            // First get the user id (via its meanoflogin)
            // can be carte etu number or login
            rest
                .get('meanofloginsusers?data=' + username + '&MeanOfLoginId=1&MeanOfLoginId=2')
                .then(function (mRes) {
                    return mRes.data.data;
                })
                .then(function (mol) {
                    return new Promise(function (resolve, reject) {
                        // If forced auth, get userid directly
                        if (res.locals.shouldNotCheckPassword) {
                            mol = { UserId: username };
                        }

                        if (!mol || !mol.UserId) {
                            return reject('nouser');
                        }

                        // Then auth with userid
                        rest
                            .get('users?id=' + mol.UserId)
                            .then(function (uRes) {
                                req.wantedUser = uRes.data.data;
                                return resolve(uRes.data.data);
                            })
                            .catch(reject);
                    });
                })
                .then(checkPassword)
                .then(getTickets)
                .then(checkIfFundationAccount)
                .then(checkIfAdmin)
                .then(checkBdeMember)
                .catch(function (err) {
                    if (err === 'bcrypt' || err === 'nouser') {
                        return Error.emit(res, 401, '401 - Invalid username/password', err);
                    }
                    return Error.emit(res, 500, '500 - Buckutt server error', err);
                });
        }

        /**
         * Checks if the passwords matches
         * @param  {object}   wantedUser The user data
         * @return {Function}            Bluebird instance
         */
        function checkPassword (wantedUser) {
            return new Promise(function (resolve, reject) {
                // True when the user buys a ticket and get redirected on pay after sherlocks
                if (res.locals.shouldNotCheckPassword) {
                    req.user = wantedUser;

                    req.user.firstname = req.user.firstname.nameCapitalize();
                    req.user.lastname  = req.user.lastname.nameCapitalize();
                    return resolve();
                }

                if (bcrypt.compareSync(req.form.password, wantedUser.password)) {
                    req.user = wantedUser;

                    req.user.firstname = req.user.firstname.nameCapitalize();
                    req.user.lastname  = req.user.lastname.nameCapitalize();
                    return resolve();
                } else {
                    return reject('bcrypt');
                }
            });
        }

        /**
         * Gets the user tickets and call checkIfFundationAccount
         */
        function getTickets () {
            return new Promise(function (resolve, reject) {
                db.Ticket
                    .findAll({
                        where: {
                            username: req.user.id
                        }
                    })
                    .then(function (tickets) {
                        tickets = (tickets) ? tickets : [];

                        var realTickets = [];
                        tickets.forEach(function (ticket) {
                            realTickets.push({
                                id: ticket.dataValues.id,
                                event_id: ticket.dataValues.event_id
                            });
                        });

                        req.user.tickets = realTickets;

                        return resolve();
                    })
                    .catch(function (err) {
                        return reject(err);
                    });
            });
        }

        /**
         * Checks if the user is an account user (with fund_user right) and call checkIfAdmin
         */
        function checkIfFundationAccount () {
            return new Promise(function (resolve, reject) {
                rest
                    .get('users/' + req.user.id + '/rights')
                    .then(function (uRes) {
                        var rights = uRes.data.data;
                        if (!rights || rights.length === 0) {
                            return resolve(rights);
                        }

                        var work = false;
                        rights.forEach(function (right) {
                            if (right.name === 'fund_chef') {
                                req.user.fundation = {
                                    id: right.UsersRights.FundationId
                                };

                                // Récupérer le nom de l'asso
                                work = true;
                                rest
                                    .get('fundations/' + right.UsersRights.FundationId)
                                    .then(function (fRes) {
                                        req.user.fundation.name = fRes.data.data.name;
                                        return resolve(rights);
                                    })
                                    .catch(reject);
                            }
                        });

                        if (!work) {
                            return resolve(rights);
                        }
                    })
                    .catch(reject);
            });
        }

        /**
         * Checks if the user is an admin
         * @param {object} rights The rights object from checkIfFundationAccount (avoid same request)
         */
        function checkIfAdmin (rights) {
            req.user.isAdmin = false;
            rights.forEach(function (right) {
                if (right.name === 'droit_admin') {
                    req.user.isAdmin = true;
                }
            });
        }

        /**
         * Checks if the user is in the BDE
         * @return {Function} Bluebird instance
         */
        function checkBdeMember () {
            return new Promise(function (resolve, reject) {
                rest
                    .get('users/' + req.user.id + '?isInBDE=true')
                    .then(function (uRes) {
                        req.user.inBDE = Boolean(uRes.data);
                        resolve();
                        return next();
                    })
                    .catch(reject);
            });
        }
    };
};
