/////////////////////////////////
// Search among back-end users //
/////////////////////////////////

'use strict';

var request = require('request');

module.exports = function (db, config) {
    var logger = require('../../lib/log')(config);

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
