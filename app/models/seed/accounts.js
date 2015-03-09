/////////////////////////
// Seeds some accounts //
/////////////////////////

'use strict';

module.exports = function (db) {
    db.Account.create({
        username: 10155,
        right_id: 1,
        event_id: 1
    }).complete(function (err) {
        if (err) {
            Error.emit(null, 500, '500 - SQL Server error ', err.toString());
        }

        db.Account.create({
            username: 10155,
            right_id: 2,
            event_id: 1
        }).complete(function (err) {
            if (err) {
                Error.emit(null, 500, '500 - SQL Server error ', err.toString());
            }

            db.Account.create({
                username: 10155,
                right_id: 1,
                event_id: 2
            }).complete(function (err) {
                if (err) {
                    Error.emit(null, 500, '500 - SQL Server error ', err.toString());
                }

                db.Account.create({
                    username: 10155,
                    right_id: 2,
                    event_id: 2
                }).complete(function (err) {
                    if (err) {
                        Error.emit(null, 500, '500 - SQL Server error ', err.toString());
                    }
                });
            });
        });
    });
};
