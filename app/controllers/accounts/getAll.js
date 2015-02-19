/////////////////////
// Accounts getter //
/////////////////////

'use strict';

module.exports = function (db, config) {
    var logger = require('../../lib/log')(config);
    var rest   = require('../../lib/rest')(config, logger);

    return function (req, res) {
        db.Account.findAll({
            where: {
                event_id: req.params.eventId
            }
        }).done(function (err, accounts) {
            if (err) {
                return Error.emit(res, 500, '500 - SQL Server error', err);
            }

            if (accounts.length === 0) {
                res.json([]);
                res.end();
                return;
            }

            var sentAccounts = [];

            accounts.forEach(function (account, i) {
                rest.get('users/' + account.username).then(function (uRes) {
                    return uRes.data.data.firstname.nameCapitalize() + ' '
                         + uRes.data.data.lastname.nameCapitalize();
                }, function () {
                    Error.emit(res, 500, '500 - Buckutt server error', 'Get mail');
                    return false;
                }).then(function (displayName) {
                    if (!displayName) {
                        return;
                    }

                    var newlyAccount = [displayName, account.id];

                    account.getRight().complete(function (err, right) {
                        if (err) {
                            return Error.emit(null, 500, '500 - SQL Server error ', err.toString());
                        }

                        newlyAccount.push(right.id);
                        sentAccounts.push(newlyAccount);

                        if (accounts.length - 1 === i) {
                            res.json(sentAccounts || []);
                        }
                    });
                });
            });
        });
    };
};
