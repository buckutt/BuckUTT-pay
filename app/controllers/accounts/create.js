/////////////////////
// Account creator //
/////////////////////

'use strict';

module.exports = function (db, config) {
    return function (req, res) {
        if (!req.form.isValid) {
            return Error.emit(res, 400, '400 - Bad Request', req.form.errors);
        }

        db.Account
            .create(req.form)
            .then(function (user) {
                return res
                        .status(200)
                        .json({
                            id: user.id
                        }).end();
            })
            .catch(function (err) {
                return Error.emit(res, 500, '500 - SQL Server error', err);
            });
    };
};
