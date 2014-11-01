// Pay - /app/controllers/etu/auth.js

// Do the CORS request to the site etu
// Or refresh the token

'use strict';

var request = require('request');

module.exports = function (db, config) {
    var logger = require('../../log')(config);

    return function (req, res) {
        res.json([
            {
                fullName: 'Thomas Chauchefoin'
            },
            {
                fullName: 'Julien Canat'
            },
            {
                fullName: 'Gabriel Juchault'
            },
            {
                fullName: 'Hugo Collignon'
            }
        ]);
    }
};