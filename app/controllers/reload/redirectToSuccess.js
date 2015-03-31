//////////////////////////////////////////////////
// Redirects user when the reload has been made //
//////////////////////////////////////////////////

'use strict';

module.exports = function () {
    return function (req, res) {
        return res
                .status(200)
                .json({
                    url: '/#/reloadSuccess/' + encodeURIComponent(JSON.stringify(req.user))
                })
                .end();
    };
};