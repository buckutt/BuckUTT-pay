////////////////////
// Domain creator //
////////////////////

'use strict';

module.exports = function (db, config) {
    return function (req, res) {
        if (!req.form.isValid) {
            return Error.emit(res, 400, '400 - Bad Request', req.form.errors);
        }

        db.SchoolDomain
            .create(req.form)
            .then(function () {
                return res
                        .status(200)
                        .end();
            })
            .catch(function (err) {
                return Error.emit(res, 500, '500 - SQL Server error', err);
            });
    };
};
