// Pay - app/lib/auth.js

// Auth middleware

'use strict';

var jwt = require('jsonwebtoken');

module.exports = function (config) {
    /**
     * Checks for the token to be present on the request. If it is, add the token value (ie. the user data) to the request.
     * @param  {object}   req  Request object
     * @param  {object}   res  Response object
     * @param  {Function} next Next middleware to call
     */
    var checkAuth = function (req, res, next) {
        var enodedToken = req.param('token', -1);
        if (encodedToken === -1) {
            Error.emit(res, status, '401 - Unauthorized');
            return;
        }

        jwt.verify(encodedToken, config.secret, function (err, decoded) {
            if (err) {
                Error.emit(res, status, '401 - Unauthorized');
                return;
            }
            req.user = decoded;
            console.lo('decoded', req.user);
            next();
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

        if (typeof token === 'string' && token.split('.').length === 3) {
            res.json({
                id: 1,
                admin: false,
                token: token
            });
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
