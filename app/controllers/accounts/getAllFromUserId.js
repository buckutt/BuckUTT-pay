////////////////////////////////////
// Accounts getter (with user id) //
////////////////////////////////////

'use strict';

module.exports = function (db, config) {
    return function (req, res) {
        db.Account
            .findAll({
                where: {
                    username: req.params.userId
                }
            })
            .then(function (accounts) {
                var sentAccounts = [];

                if (!accounts) {
                    accounts = [];
                }

                accounts.forEach(function (account) {
                    sentAccounts.push({
                        event: account.event_id,
                        admin: (account.right_id === 1)
                    });
                });

                return res
                        .status(200)
                        .json(sentAccounts)
                        .end();
            })
            .catch(function (err) {
                return Error.emit(res, 500, '500 - SQL Server error', err);
            });
    };
};
