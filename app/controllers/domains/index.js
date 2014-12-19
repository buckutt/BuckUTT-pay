// Pay - /app/controllers/domains/index.js

// Domain controller

'use strict';

module.exports = function (db, config) {
    return {
        getAll: require('./getAll')(db, config),
        remove: require('./remove')(db, config),
        create: require('./create')(db, config)
    };
};
