///////////////////////////////////
// Get username from meanoflogin //
///////////////////////////////////

'use strict';

module.exports = function (db, config) {
    var logger = require('../../lib/log')(config);
    var rest   = require('../../lib/rest')(config, logger);

    return function (req, res) {
        rest
            .get('meanofloginsusers?data=' + req.params.id + '&MeanOfLoginId=2')
            .then(function (molRes) {
                var data = molRes.data.data;

                if (!data) {
                    return Error.emit(res, 404, '404 - Not Found', 'no user found');
                }

                return res
                        .status(200)
                        .json({
                            username: data.UserId
                        })
                        .end();
            })
            .catch(function (err) {
                return Error.emit(res, 500, '500 - Buckutt server error', err);
            });
    };
};
