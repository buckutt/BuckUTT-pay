//////////////////////////////////////////////////
// Redirects user when the reload has been made //
//////////////////////////////////////////////////

'use strict';

var Promise = require('bluebird');

module.exports = function () {
    return function (req, res, next) {
        res
            .status(200)
            .json({
                url: '/#/reloadSuccess/' + encodeURIComponent(JSON.stringify(req.user))
            })
            .end();
    };
};