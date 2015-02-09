//////////////////////
// Auth middlewares //
//////////////////////

'use strict';

var jwt = require('jsonwebtoken');

module.exports = function (db, config) {
    var logger = require('./log')(config);
    var rest   = require('./rest')(config, logger);

    /**
     * Checks for the token to be present on the request. If it is, add the token value (ie. the user data) to the request.
     * @param  {object}   req  Request object
     * @param  {object}   res  Response object
     * @param  {Function} next Next middleware to call
     */
    var checkToken = function (req, res, next) {
        var encodedToken = req.get('Auth-JWT');
        if (encodedToken === -1) {
            return next();
        }

        jwt.verify(encodedToken, config.secret, function (err, decoded) {
            if (err) {
                logger.warn('Auth - JWT failed');
                logger.warn(err);
                return next();
            }

            if (!decoded.id || !decoded.mail || !decoded.password) {
                logger.warn('Auth - Fields missing')
                return next();
            }

            if (!Number.isPositiveNumeric(decoded.id + '')) {
                logger.warn('Auth - Id is not numeric');
                return next();
            }

            // Verify user token
            var mail = decoded.mail;
            var token = decoded.token;

            rest.get('users?mail=' + mail).success(function (data) {
                var idOkay = data.id === decoded.id;
                var hashOkay = data.password === decoded.password;

                if (!idOkay || !hashOkay) {
                    logger.warn('Auth - Password or id do not match');
                    return next();
                }

                req.user = decoded;
                next();
            }).error(function () {
                logger.warn('Auth - No email in database');
                return next();
            });
        });
    };

    /**
     * Checks for the token to be present on the request. If it is, add the token value (ie. the user data) to the request.
     * @param  {object}   req  Request object
     * @param  {object}   res  Response object
     * @param  {Function} next Next middleware to call
     */
    var checkAuth = function (req, res, next) {
        if (!req.user) {
            return Error.emit(res, 401, '401 - Unauthorized', 'No user');
        }
        next();
    };

    /**
     * Appends the token to the body so that the browser keeps it.
     * @param {object}   req  Request object
     * @param {object}   res  Response object
     */
    var addAuth = function (req, res) {
        var token = jwt.sign(req.user, config.secret, {
            algorithm: config.tokenAlgorithm
        });

        req.user.jwt = token;

        if (typeof token === 'string' && token.split('.').length === 3) {
            res.json(req.user);
            res.end();
        } else {
            return Error.emit(res, status, '401 - Unauthorized');
        }
    };

    /**
     * Checks if the user has an account for the event
     * Can do admin or seller by returning the middleware
     * @param  {string}   right "admin" or "vendor"
     * @return {Function}      The middleware
     */
    var isInEvent = function (right) {
        return function (req, res, next) {
            checkAuth();
            var eventId = req.params.eventId;
            db.Account.count({
                where: {
                    username: req.user.id,
                    event_id: req.params.eventId,
                    right_id: (right === "admin") ? 1 : 2
                }
            }).complete(function (err, countAc) {
                if (err) {
                    return Error.emit(res, 500, '500 - Buckutt server error', err);
                }

                if (countAc === 0) {
                    // If there is no account, don't emit already,
                    // Find out if it's because of the account, or the event.
                    db.Event.count({
                        where: {
                            id: req.params.eventId
                        }
                    }).complete(function (err, countEv) {
                        if (err) {
                            return Error.emit(res, 500, '500 - Buckutt server error', err);
                        }

                        if (countEv === 0) {
                            return Error.emit(res, 404, '404 - Not Found', 'No event');
                        }

                        return Error.emit(res, 401, '401 - Unauthorized', 'No admin account');
                    });
                } else {
                    next();
                }
            });
        };
    };

    var isSuperAdmin = function (req, res, next) {
        checkAuth();
        if (!req.user.isAdmin) {
            return Error.emit(res, 401, '401 - Unauthorized', 'No super admin');
        }
        next();
    };

    var isFundationAccount = function (req, res, next) {
        checkAuth();
        if (!req.user.fundation) {
            return Error.emit(res, 401, '401 - Unauthorized', 'No fundation account');
        }
        next();
    };

    var noAuth = function (req, res, next) {
        next();
    };

    return {
        addAuth: addAuth,
        checkAuth: checkAuth,
        checkToken: checkToken,
        isFundationAccount: isFundationAccount,
        isInEvent: isInEvent,
        isSuperAdmin: isSuperAdmin,
        noAuth: noAuth
    };
};
