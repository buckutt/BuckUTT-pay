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
    return function (req, res, next) {
        var enodedToken = req.param('token', -1);
        if (encodedToken === -1) {

        }
    };
};
