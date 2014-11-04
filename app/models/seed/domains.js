// Pay - /app/models/seed/domains.js

// Seeds some domains

'use strict';

module.exports = function (db) {
    db.SchoolDomain.create({
        domain: 'utc.fr'
    }).complete(function (err) {
        if (err) {
            Error.emit(null, 500, '500 - SQL Server error ', err.toString());
        }

        db.SchoolDomain.create({
            domain: 'utbm.fr'
        }).complete(function (err) {
            if (err) {
                Error.emit(null, 500, '500 - SQL Server error ', err.toString());
            }
        });
    });
};
