////////////////////
// Domains getter //
////////////////////

'use strict';

module.exports = function (db) {
    return function (req, res) {
        db.SchoolDomain.findAll().done(function (err, domains) {
            if (err) {
                Error.emit(res, 500, '500 - SQL Server error', err);
                return;
            }
            
            res.json(domains || {});
        });
    };
};
