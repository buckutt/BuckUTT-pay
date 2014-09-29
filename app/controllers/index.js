// Pay - /app/controllers/index.js

// Controllers regroupment file

'use strict';

module.exports = function (db) {
    return {
        tickets: require('./tickets')(db),
        events: require('./events')(db)
    };
};
