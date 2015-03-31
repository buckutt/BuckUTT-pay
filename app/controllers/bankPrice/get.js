//////////////////////
// BankPrice getter //
//////////////////////

'use strict';

module.exports = function (db, config) {
    return function (req, res) {
        return res
                .status(200)
                .json({
                    bankPrice: config.bankPrice
                })
                .end();
    };
};
