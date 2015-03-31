////////////////////////////////////////////
// Get the lasts reloads made by the user //
////////////////////////////////////////////

'use strict';

module.exports = function (db, config) {
    var logger = require('../../lib/log')(config);
    var rest   = require('../../lib/rest')(config, logger);

    return function (req, res) {
        rest
            .get('reloads?buyerid=' + req.user.id + '&embed=point')
            .then(function (rRes) {
                var reloads = [];
                rRes.data.data.forEach(function (reloadData) {
                    var newReload = {
                        date: reloadData.date,
                        price: reloadData.credit / 100,
                        where: reloadData.Point.name
                    };

                    reloads.push(newReload);
                });

                return res
                        .status(200)
                        .json(reloads)
                        .end();
            })
            .catch(function (err) {
                return Error.emit(res, 500, '500 - Buckutt server error', err);
            });
    };
};
