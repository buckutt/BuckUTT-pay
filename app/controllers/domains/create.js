////////////////////
// Domain creator //
////////////////////

'use strict';

module.exports = function (db, config) {
    var logger = require('../../lib/log')(config);

    return function (req, res) {
        if (!req.form.isValid) {
            return Error.emit(res, 400, '400 - Bad Request', req.form.errors);
        }

        db.SchoolDomain.create(req.form).complete(function (err) {
            if (err) {
                return Error.emit(res, 500, '500 - SQL Server error', err.toString());
            }

            res.json({
                status: 200
            });
        });
    };
};
