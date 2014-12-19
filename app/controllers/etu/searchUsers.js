// Pay - /app/controllers/etu/auth.js

// Do the CORS request to the back-end
// Or refresh the token

'use strict';

var request = require('request');

module.exports = function (db, config) {
    var logger = require('../../log')(config);

    return function (req, res) {
        res.json([
            {
                fullName: 'Thomas Chauchefoin',
                id: 1
            },
            {
                fullName: 'Julien Canat',
                id: 2
            },
            {
                fullName: 'Gabriel Juchault',
                id: 3
            },
            {
                fullName: 'Hugo Collignon',
                id: 4
            }
        ]);
    }
};