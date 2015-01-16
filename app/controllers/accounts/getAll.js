/////////////////////
// Accounts getter //
/////////////////////

'use strict';

module.exports = function (db, config) {
    var logger = require('../../lib/log')(config);

    function getDisplayName (id, callback) {
        logger.info('Asking axel back end for username (from id : ' + id + ')');
        callback(null, 'Thomas Chauchefoin');
    }

    return function (req, res) {
        if (!Number.isPositiveNumeric(req.params.eventId)) {
            Error.emit(res, 400, '400 - Bad Request');
            return;
        }

        db.Account.findAll({
            where: {
                event_id: req.params.eventId
            }
        }).done(function (err, accounts) {
            if (err) {
                Error.emit(res, 500, '500 - SQL Server error', err);
                return;
            }

            var sentAccounts = [];

            accounts.forEach(function (account, i) {
                getDisplayName(account.username, function (err, displayName) {
                    if (err) {
                        Error.emit(res, 500, '500 - SQL Server error', err);
                        return;
                    }

                    var newlyAccount = [displayName];

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
