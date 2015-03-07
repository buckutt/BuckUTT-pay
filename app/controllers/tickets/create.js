////////////////////
// Ticket creator //
////////////////////

'use strict';

module.exports = function (db, config) {
    var logger = require('../../lib/log')(config);

    return function (req, res) {
        if (!req.form.isValid) {
            console.dir(req.form.errors);
            return Error.emit(res, 400, '400 - Bad Request');
        }

        db.Ticket.create(req.form).complete(function (err, ticket) {
            if (err) {
                return Error.emit(res, 500, '500 - SQL Server error', err.toString());
            }

            res.json({
                status: 200,
                id: ticket.id
            });
        });
    };
};
