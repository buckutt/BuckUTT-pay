////////////////////////////////////////////////////
// Redirects user when the ticket has been bought //
////////////////////////////////////////////////////

'use strict';

module.exports = function () {
    return function (req, res) {
        if (req.user) {
            return res
                    .status(200)
                    .json({
                        url: '/#/ticketBought/' + encodeURIComponent(JSON.stringify(req.user) +
                             '?ticketId=' + req.ticketId + '&sherlocksToken=' + req.sherlocksToken)
                    })
                    .end();
        }

        return res
                .status(200)
                .json({
                    url: '/#/ticketBought/?ticketId=' + req.ticketId + '&sherlocksToken='+ req.sherlocksToken
                })
                .end();
    };
};