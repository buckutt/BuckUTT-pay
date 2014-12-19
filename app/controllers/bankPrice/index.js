// Pay - /app/controllers/bankPrice/index.js

// BankPrice controller

'use strict';

module.exports = function (db, config) {
    return {
        edit: require('./edit')(db, config),
        get: require('./get')(db, config)
    };
};
