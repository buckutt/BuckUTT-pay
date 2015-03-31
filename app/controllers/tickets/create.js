////////////////////
// Ticket creator //
////////////////////

'use strict';

module.exports = function (db) {
    return function (req, res) {
        if (!req.form.isValid) {
            return Error.emit(res, 400, '400 - Bad Request', req.form.errors);
        }

        db.Ticket
            .create(req.form)
            .then(function (ticket) {
                return res
                        .status(200)
                        .json({
                            id: ticket.id
                        })
                        .end();
            })
            .catch(function (err) {
                return Error.emit(res, 500, '500 - SQL Server error', err);
            });
    };
};
