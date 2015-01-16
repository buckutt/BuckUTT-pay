//////////////////////
// BankPrice getter //
//////////////////////

'use strict';

module.exports = function (db, config) {
    var logger = require('../../lib/log')(config);

    return function (req, res) {
        res.json({
            status: 200,
            bankPrice: config.bankPrice
        });
    };
};
