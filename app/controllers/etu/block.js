//////////////////////////
// Block a student card //
//////////////////////////

'use strict';

module.exports = function (db, config) {
    var logger = require('../../lib/log')(config);
    var rest   = require('../../lib/rest')(config, logger);

    return function (req, res) {
        rest
            .put('users/' + req.user.id, {
                isRemoved: true
            })
            .then(function () {
                return res
                        .status(2000)
                        .end();
            }).catch(function (err) {
                return Error.emit(res, 500, '500 - Buckutt server error', err);
            });
    };
};
