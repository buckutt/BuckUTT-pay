// Pay - /app/controllers/etu/index.js

// Do the CORS request to the site etu
// Or refresh the token

'use strict';

var request = require('request');

module.exports = function (db, config) {
    return function (req, res) {
        var form = '';
        if (req.body.hasOwnProperty('code')) {
            form = {
                grant_type: 'authorization_code',
                code: req.body.code
            };
        } else if (req.body.hasOwnProperty('refreshToken')) {
            form = {
                grant_type: 'refresh_token',
                refresh_token: req.body.refreshToken
            };
        } else {
            Error.emit(res, 400, '400 - Bad Request');
        }

        request.post({
            url: config.app.link + 'oauth/token',
            form: form,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
                'Authorization': 'Basic ' + new Buffer(config.app.clientId + ':' + config.app.clientSecret).toString('base64')
            }
        }, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                var response = JSON.parse(body).response;
                var token = response.access_token;
                var refreshToken = response.refresh_token;
                request.get({
                    url: config.app.link + 'private/user/account?access_token=' + token
                }, function (error, response, body) {
                    var userData = JSON.parse(body).response.data;
                    userData.refreshToken = refreshToken;
                    res.json(userData);
                });
            } else {
                Error.emit(res, 500, '500 - Etu server is not responding', true);
            }
        });
    };
};
