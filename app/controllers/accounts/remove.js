/////////////////////
// Account remover //
/////////////////////

'use strict';

module.exports = function (db) {
    return function (req, res) {
        db.Account.find(req.params.accountId).complete(function (err, account) {
            if (err) {
                return Error.emit(res, 500, '500 - SQL Error', err.toString());
            }

            if (!account) {
                res.json({
                    status: 200
                });
                res.end();
                return;
            }

            account.destroy().complete(function (errDestroy) {
                if (errDestroy) {
                    return Error.emit(res, 500, '500 - SQL Error', errDestroy.toString());
                }

                res.json({
                    status: 200
                });
            });
        });
    };
};
