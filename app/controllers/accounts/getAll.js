/////////////////////
// Accounts getter //
/////////////////////

'use strict';

module.exports = function (db, config) {
    var logger = require('../../lib/log')(config);
    var rest   = require('../../lib/rest')(config, logger);

    return function (req, res) {
        db.Account
            .findAll({
                where: {
                    event_id: req.params.eventId
                }
            })
            .then(function (accounts) {
                if (accounts.length === 0) {
                    return res
                            .status(200)
                            .json([])
                            .end();
                }

                var sentAccounts = [];

                // Use foreach to keep "i" in scope and use it to detect the end
                accounts.forEach(function (account, i) {
                    rest
                        .get('users/' + account.username)
                        .then(function (uRes) {
                            return uRes.data.data.firstname.nameCapitalize() +
                             ' ' + uRes.data.data.lastname.nameCapitalize();
                        })
                        .catch(function (err) {
                            Error.emit(res, 500, '500 - Buckutt server error', err);
                            return false;
                        })
                        .then(function (displayName) {
                            if (!displayName) {
                                return;
                            }

                            var newlyAccount = [displayName, account.id];

                            account
                                .getRight()
                                .then(function (right) {
                                    newlyAccount.push(right.id);
                                    sentAccounts.push(newlyAccount);

                                    if (accounts.length - 1 === i) {
                                        return res
                                                .status(200)
                                                .json(sentAccounts || [])
                                                .end();
                                    }
                                })
                                .catch(function (err) {
                                    return Error.emit(null, 500, '500 - SQL Server error ', err);
                                });
                        });
                });
            })
            .catch(function (err) {
                return Error.emit(res, 500, '500 - SQL Server error', err);
            });
    };
};
