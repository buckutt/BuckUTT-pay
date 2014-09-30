// Pay - /app/controllers/etu/index.js

// Do the CORS request to the site etu

'use strict';

var request = require('request');

module.exports = function (db, config) {
    return function (req, res) {
        request.post({
            url: 'https://etu.utt.fr/api/oauth/token',
            form: {
                grant_type: 'authorization_code',
                code: req.body.code
            },
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
                'Authorization': 'Basic ' + new Buffer(config.app.clientId + ':' + config.app.clientSecret).toString('base64')
            }
        }, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                res.json(JSON.parse(body));
            }
        });
    };
};
