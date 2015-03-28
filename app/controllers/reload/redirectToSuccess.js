//////////////////////////////////////////////////
// Redirects user when the reload has been made //
//////////////////////////////////////////////////

'use strict';

var Promise = require('bluebird');

module.exports = function () {
    return function (req, res, next) {
        res.redirect('/#/reloadSuccess/' + encodeURIComponent(JSON.stringify(req.user)));
    };
};