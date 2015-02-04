/////////////////////
// Auth middleware //
/////////////////////

'use strict';

var jwt = require('jsonwebtoken');

module.exports = function (config) {
    var logger = require('./log')(config);
    var rest   = require('./rest')(config, logger);

    /**
     * Checks for the token to be present on the request. If it is, add the token value (ie. the user data) to the request.
     * @param  {object}   req  Request object
     * @param  {object}   res  Response object
     * @param  {Function} next Next middleware to call
     */
    var checkAuth = function (req, res, next) {
        var encodedToken = req.get('Auth-JWT');
        if (encodedToken === -1) {
            return Error.emit(res, 401, '401 - Unauthorized');
        }

        jwt.verify(encodedToken, config.secret, function (err, decoded) {
            if (err) {
                return Error.emit(res, 401, '401 - Unauthorized', err);
            }

            if (!decoded.id || !decoded.mail || !decoded.password) {
                return Error.emit(res, 401, '401 - Unauthorized');
            }

            if (!Number.isPositiveNumeric(decoded.id + '')) {
                return Error.emit(res, 401, '401 - Unauthorized');
            }

            // Verify user token
            var mail = decoded.mail;
            var token = decoded.token;

            rest.get('users?mail=' + mail).success(function (data) {
                var idOkay = data.id === decoded.id;
                var hashOkay = data.password === decoded.password;

                if (!idOkay || !hashOkay) {
                    return Error.emit(res, 401, '401 - Unauthorized');
                }

                req.user = decoded;
                next();
            }).error(function () {
                return Error.emit(res, 500, '500 - Buckutt server error', 'Auth failed');
            });
        });
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
            Error.emit(res, status, '401 - Unauthorized');
            return;
        }
    };

    return {
        checkAuth: checkAuth,
        addAuth: addAuth
    };
};
