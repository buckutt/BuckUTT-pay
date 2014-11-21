// Pay - /app/controllers/bankPrice/edit.js

// BankPrice editor

'use strict';

module.exports = function (db, config) {
    var fs     = require('fs')
    var logger = require('../../log')(config);

    return function (req, res) {
        config.bankPrice = req.body.value;
        config = JSON.stringify(config, null, 4);
        var configPath = './app/config.json';
        
        if (fs.existsSync(configPath)) {
            fs.writeFile(configPath, config, function (err) {
                if (err) {
                    Error.emit(res, 500, '500 - Cannot write config file', 'Error during file write');
                    return;
                }
            });

            logger.warn('Wrote config file');
            res.json({
                status: 200
            });
        } else {
            Error.emit(res, 500, '500 - Cannot write config file', 'Config file inexistant');
            return;
        }
    };
};