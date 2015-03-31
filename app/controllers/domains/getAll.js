////////////////////
// Domains getter //
////////////////////

'use strict';

module.exports = function (db) {
    return function (req, res) {
        db.SchoolDomain
            .findAll()
            .then(function (domains) {
                return res
                        .status(200)
                        .json(domains || {})
                        .end();
            })
            .catch(function (err) {
                return Error.emit(res, 500, '500 - SQL Server error', err);
            });
    };
};
