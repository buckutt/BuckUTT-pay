// Pay - /app/controllers/domains/create.js

// Event editor

'use strict';

module.exports = function (db, config) {
    var logger = require('../../log')(config);

    return function (req, res) {
        if (!req.form.isValid) {
            Error.emit(res, 400, '400 - Bad Request', req.form.errors);
            return;
        }

        db.SchoolDomain.create(req.form).complete(function (err) {
            if (err) {
                Error.emit(res, 500, '500 - SQL Server error', err.toString());
            }

            res.json({
                status: 200
            });
        });
    };
};