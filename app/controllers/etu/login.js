////////////////////////////////
// Auth the etu with back-end //
////////////////////////////////

'use strict';

var crypto  = require('crypto');
var bcrypt  = require('bcryptjs');
var Promise = require('bluebird');

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

        // username is a positive number and not login etu => auth with card number
        if (!Number.isPositiveNumeric(username) && !/^\w[\w_]+\d?$/i.test(username)) {
            // Auth with email
            rest.get('users?mail=' + username)
            .then(function (uRes) {
                return uRes.data;
            })
            .then(checkPassword)
            .then(getTickets)
            .then(checkIfFundationAccount)
            .then(checkIfAdmin)
            .catch(function () {
                return Error.emit(res, 500, '500 - Buckutt server error', 'Mail auth failed');
            });
        } else {
            // First get the user id (via its meanoflogin)
            // can be carte etu number or login
            rest.get('meanofloginsusers?data=' + username)
            .then(function (mRes) {
                return mRes.data.data;
            })
            .then(function (mol) {
                return new Promise(function (resolve, reject) {
                    if (!mol || !mol.UserId) {
                        reject('nouser');
                    }
                    // Then auth with userid
                    rest.get('users?id=' + mol.UserId).then(function (uRes) {
                        req.wantedUser = uRes.data.data;
                        resolve(uRes.data.data);
                    }, reject);
                });
            })
            .then(checkPassword)
            .then(getTickets)
            .then(checkIfFundationAccount)
            .then(checkIfAdmin)
            .catch(function (err) {
                if (err === 'bcrypt' || err === 'nouser') {
                    return Error.emit(res, 401, '401 - Invalid username/password');
                }
                console.dir(err);
                return Error.emit(res, 500, '500 - Buckutt server error');
            });
        }

        /**
         * Checks if the passwords matches
         * @param  {object}   
         * @return {function} Bluebird instance
         */
        /**
         * Checks if the passwords matches
         * @param  {object} wantedUser [description]
         * @return {[type]}            [description]
         */
        function checkPassword (wantedUser) {
            return new Promise(function (resolve, reject) {
                var t = bcrypt.compareSync(req.form.password, wantedUser.password);
                if (bcrypt.compareSync(req.form.password, wantedUser.password)) {
                    req.user = wantedUser;

                    req.user.firstname = req.user.firstname.nameCapitalize();
                    req.user.lastname  = req.user.lastname.nameCapitalize();
                    resolve();
                } else {
                    reject('bcrypt');
                }
            });
        }

        /**
         * Gets the user tickets and call checkIfFundationAccount
         */
        function getTickets () {
            return new Promise(function (resolve, reject) {
                db.Ticket.findAll({
                    where: {
                        username: req.user.id
                    }
                }).complete(function (err, tickets) {
                    if (err) {
                        reject(err);
                    }

                    tickets = (tickets) ? tickets : [];

                    var realTickets = [];
                    tickets.forEach(function (ticket) {
                        realTickets.push(ticket.dataValues);
                    });

                    req.user.tickets = realTickets;

                    resolve();
                });
            });
        }

        /**
         * Checks if the user is an account user (with fund_user right) and call checkIfAdmin
         */
        function checkIfFundationAccount () {
            return new Promise(function (resolve, reject) {
                rest.get('users/' + req.user.id + '/rights').then(function (uRes) {
                    var rights = uRes.data.data;
                    if (!rights || rights.length === 0) {
                        resolve(rights);
                    }

                    var work = false;
                    rights.forEach(function (right) {
                        if (right.name === 'fund_chef') {
                            req.user.fundation = {
                                id: right.UsersRights.FundationId
                            };

                            // Récupérer le nom de l'asso
                            work = true;
                            rest.get('fundations/' + right.UsersRights.FundationId).then(function (fRes) {
                                req.user.fundation.name = fRes.data.data.name;
                                resolve(rights);
                            }, function () {
                                reject()
                            });
                        }
                    });

                    if (!work) {
                        resolve(rights);
                    }
                }, reject);
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
