////////////////////////////////////////////////////
// Redirects user when the ticket has been bought //
////////////////////////////////////////////////////

'use strict';

var Promise = require('bluebird');

module.exports = function () {
    return function (req, res, next) {
        if (req.user) {
            res.redirect('/#/ticketBought/' + encodeURIComponent(JSON.stringify(req.user)));
            return;
        }

        res.redirect('/#/ticketBought');
    };
};