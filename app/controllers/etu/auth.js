// Pay - /app/controllers/etu/auth.js

// Do the CORS request to the back-end
// Or refresh the token

'use strict';

var request = require('request');
var bcrypt = require('bcryptjs');

module.exports = function (db, config) {
    var logger = require('../../lib/log')(config);

    return function (req, res, next) {
        if (!req.form.isValid) {
            Error.emit(res, 400, '400 - Bad Request', req.form.errors);
            return;
        }

        var username = req.form.username;
        var password = req.form.password;
        var hash = req.form.password;

        logger.info('Asking axel back end with : ' + username + '/' + password);
        bcrypt.compare(req.form.password, hash, function (err, hash) {
            /*
            setTimeout(function () {
                Error.emit(res, 400, '400 - Invalid username/password');
            }, 1400);
            */
            req.user = {
                username: username,
                password: password
            };
            next();
        });
    };
};
