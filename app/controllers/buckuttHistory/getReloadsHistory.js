////////////////////////////////////////////
// Get the lasts reloads made by the user //
////////////////////////////////////////////

'use strict';

module.exports = function (db, config) {
    var logger = require('../../lib/log')(config);
    var rest   = require('../../lib/rest')(config, logger);

    return function (req, res) {
        rest.get('reloads?buyerid=' + req.user.id + '&embed=point').success(function (data) {
            var reloads = [];
            data.forEach(function (reloadData) {
                var newReload = {
                    date: reloadData.date,
                    price: reloadData.credit / 100,
                    where: reloadData.Point.name
                };

                reloads.push(newReload);
            });

            res.json(reloads);
        }).error(function () {
            Error.emit(res, 500, '500 - Buckutt server error', 'Get reloads');
        });
    };
};
