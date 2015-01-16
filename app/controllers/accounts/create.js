/////////////////////
// Account creator //
/////////////////////

'use strict';

module.exports = function (db, config) {
    var logger = require('../../lib/log')(config);

    return function (req, res) {
        if (!req.form.isValid) {
            Error.emit(res, 400, '400 - Bad Request', req.form.errors);
            return;
        }

        db.Account.create(req.form).complete(function (err) {
            if (err) {
                Error.emit(res, 500, '500 - SQL Server error', err.toString());
                return;
            }

            res.json({
                status: 200
            });
        });
    };
};
