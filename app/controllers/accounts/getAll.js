/////////////////////
// Accounts getter //
/////////////////////

'use strict';

module.exports = function (db, config) {
    var logger = require('../../lib/log')(config);
    var rest   = require('../../lib/rest')(config, logger);

    function getDisplayName (id, callback) {
        rest.get('users/' + id).success(function (user) {
            callback(user.firstname.nameCapitalize() + ' ' + user.lastname.nameCapitalize());
        }).error(function () {
            Error.emit(res, 500, '500 - Buckutt server error', 'Get mail');
            callback(false);
        });
    }

    return function (req, res) {
        db.Account.findAll({
            where: {
                event_id: req.params.eventId
            }
        }).done(function (err, accounts) {
            if (err) {
                Error.emit(res, 500, '500 - SQL Server error', err);
                return;
            }

            if (accounts.length === 0) {
                res.json([]);
                res.end();
                return;
            }

            var sentAccounts = [];

            accounts.forEach(function (account, i) {
                getDisplayName(account.username, function (displayName) {
                    if (!displayName) {
                        return;
                    }

                    var newlyAccount = [displayName, account.id];

                    account.getRight().complete(function (err, right) {
                        if (err) {
                            Error.emit(null, 500, '500 - SQL Server error ', err.toString());
                            return;
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
