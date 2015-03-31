/////////////////////
// Account remover //
/////////////////////

'use strict';

module.exports = function (db) {
    return function (req, res) {
        db.Account
            .find(req.params.accountId)
            .then(function (account) {
                if (!account) {
                    return res
                            .status(200)
                            .end();
                }

                account
                    .destroy()
                    .then(function () {
                        return res
                                .status(200)
                                .end();
                    })
                    .catch(function (err) {
                        return Error.emit(res, 500, '500 - SQL Error', err);
                    });
            })
            .catch(function (err) {
                return Error.emit(res, 500, '500 - SQL Error', err);
            });
    };
};
