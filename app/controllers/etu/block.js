//////////////////////////
// Block a student card //
//////////////////////////

'use strict';

module.exports = function (db, config) {
    var logger = require('../../lib/log')(config);
    var rest   = require('../../lib/rest')(config, logger);

    return function (req, res) {
        rest.put('users/' + req.user.id, {
            isRemoved: true
        }).then(function () {
            res.end();
        }, function () {
            Error.emit(res, 500, '500 - Buckutt server error', 'isRemoved failed');
        });
    };
};
