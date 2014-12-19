// Pay - /app/controllers/accounts/index.js

// Accounts controller

'use strict';

module.exports = function (db, config) {
    return {
        create: require('./create')(db, config),
        getAll: require('./getAll')(db, config)
    };
};
