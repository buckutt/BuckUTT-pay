// Pay - /app/controllers/etu/auth.js

// Do the CORS request to the site etu
// Or refresh the token

'use strict';

var request = require('request');

module.exports = function (db, config) {
    var logger = require('../../log')(config);

    return function (req, res) {
        if (typeof req.query.query === 'undefined') {
            Error.emit(res, 400, '400 - Bad Request', 'name is undefined');
            return;
        }
        if (typeof req.query.token === 'undefined') {
            Error.emit(res, 400, '400 - Bad Request', 'token is undefined');
            return;
        }
        if (typeof req.query.query.length < 3) {
            return;
        }

        var usersHeaders = {
            'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
            'Authorization': 'Basic ' + new Buffer(
                config.app.clientId + ':' + config.app.clientSecret
            ).toString('base64')
        };

        request.get({
            url: config.app.link + 'public/users?access_token=' + req.query.token + '&name=' + req.query.query,
            headers: usersHeaders
        }, function (usersError, usersResponse, usersBody) {
            if (!usersError && usersResponse.statusCode == 200) {
                res.json(JSON.parse(usersBody));
            } else {
                var body = JSON.parse(usersBody);
                if (body.response && body.response.error === 'invalid_token') {
                    Error.emit(res, 500, '500 - Invalid token', body);
                    return;
                }
                Error.emit(res, 500, '500 - Etu server is not responding', usersBody);
                return;
            }
        });
    }
};