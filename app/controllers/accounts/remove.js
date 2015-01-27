/////////////////////
// Account remover //
/////////////////////

'use strict';

module.exports = function (db) {
    return function (req, res) {
        db.Account.find(req.params.accountId).complete(function (err, account) {
            if (err) {
                Error.emit(res, 500, '500 - SQL Error', err.toString());
                return;
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
                    console.log('account not destroyed', errDestroy);
                    Error.emit(res, 500, '500 - SQL Error', errDestroy.toString());
                    return;
                }

                res.json({
                    status: 200
                });
            });
        });
    };
};
