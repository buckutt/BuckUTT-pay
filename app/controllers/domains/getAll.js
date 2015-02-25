////////////////////
// Domains getter //
////////////////////

'use strict';

module.exports = function (db) {
    return function (req, res) {
        db.SchoolDomain.findAll().complete(function (err, domains) {
            if (err) {
                return Error.emit(res, 500, '500 - SQL Server error', err);
            }
            
            res.json(domains || {});
        });
    };
};
