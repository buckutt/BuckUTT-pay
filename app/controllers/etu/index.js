// Pay - /app/controllers/etu/index.js

// Etus controller

'use strict';

module.exports = function (db, config) {
    return {
        auth: require('./auth')(db, config),
        searchUsers: require('./searchUsers')(db, config)
    };
};
