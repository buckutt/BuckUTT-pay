////////////////////////////////////
// Accounts getter (with user id) //
////////////////////////////////////

'use strict';

module.exports = function (db, config) {
    var logger = require('../../lib/log')(config);

    return function (req, res) {
        db.Account.findAll({
            where: {
                username: req.params.userId
            }
        }).complete(function (err, accounts) {
            if (err) {
                return Error.emit(res, 500, '500 - SQL Server error', err);
            }

            var sentAccounts = [];

            if (!accounts) {
                accounts = [];
            }

            accounts.forEach(function (account, i) {
                sentAccounts.push({
                    event: account.event_id,
                    admin: (account.right_id === 1)
                });
            });

            res.json(sentAccounts);
        });
    };
};
