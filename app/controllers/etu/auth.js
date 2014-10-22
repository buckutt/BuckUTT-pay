// Pay - /app/controllers/etu/auth.js

// Do the CORS request to the site etu
// Or refresh the token

'use strict';

var request = require('request');

module.exports = function (db, config) {
    var logger = require('../../log')(config);

    function arrayEquals(a, b) {
        if (!b || a.length !== b.length) {
            return false;
        }
        for (var i = a.length - 1; i >= 0; i--) {
            if (a[i] !== b[i]) {
                return false;
            }
        }
        return true;
    }

    return function (req, res) {
        var form = '';
        if (req.body.hasOwnProperty('code')) {
            form = {
                grant_type: 'authorization_code',
                authorization_code: req.body.code
            };
        } else if (req.body.hasOwnProperty('refreshToken')) {
            form = {
                grant_type: 'refresh_token',
                refresh_token: req.body.refreshToken
            };
        } else {
            Error.emit(res, 400, '400 - Bad Request');
            return;
        }

        var authHeaders = {
            'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
            'Authorization': 'Basic ' + new Buffer(
                config.app.clientId + ':' + config.app.clientSecret
            ).toString('base64')
        };

        request.post({
            url: config.app.link + 'oauth/token',
            form: form,
            headers: authHeaders
        }, function (authError, authResponse, authBody) {
            if (!authError && authResponse.statusCode == 200) {
                var authResponse = JSON.parse(authBody).response;

                    if (!arrayEquals(authResponse.scopes, ['public',
                                                          'private_user_account',
                                                          'private_user_organizations'])) {
                    Error.emit(res, 400, '400 - Not enough scopes');
                    return;
                }

                var token = authResponse.access_token;
                logger.debug('Token to be used : ' + token);
                var refreshToken = authResponse.refresh_token;
                request.get({
                    url: config.app.link + 'private/user/account?access_token=' + token
                }, function (infoError, infoResponse, infoBody) {
                    var userData = JSON.parse(infoBody).response.data;
                    userData.token = token;
                    userData.refreshToken = refreshToken;

                    request.get({
                        url: config.app.link + 'private/user/organizations?access_token=' + token
                    }, function (orgsError, orgsResponse, orgsBody) {
                        
                        var orgsData = JSON.parse(orgsBody);
                        res.json(userData);
                    });
                });
            } else {
                Error.emit(res, 500, '500 - Etu server is not responding');
                return;
            }
        });
    };
};
