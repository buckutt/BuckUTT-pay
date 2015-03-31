//////////////////////
// BankPrice editor //
//////////////////////

'use strict';

module.exports = function (db, config) {
    var fs     = require('fs');
    var logger = require('../../lib/log')(config);

    return function (req, res) {
        if (!req.form.isValid) {
            return Error.emit(res, 400, '400 - Bad Request', req.form.errors);
        }

        config.bankPrice = req.form.value;
        var configPath = './app/config.json';

        if (fs.existsSync(configPath)) {
            fs.writeFile(configPath, JSON.stringify(config, null, 4), function (err) {
                if (err) {
                    return Error.emit(res, 500, '500 - Cannot write config file', 'Error during config file write');
                }
            });

            logger.warn('Wrote config file');
            return res
                    .status(200)
                    .end();
        } else {
            return Error.emit(res, 500, '500 - Cannot write config file', 'Config file inexistant');
        }
    };
};
