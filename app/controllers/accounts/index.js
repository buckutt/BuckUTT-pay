/////////////////////////
// Accounts controller //
/////////////////////////

'use strict';

module.exports = function (db, config) {
    return {
        create: require('./create')(db, config),
        getAll: require('./getAll')(db, config),
        remove: require('./remove')(db, config),
        getAllFromUserId: require('./getAllFromUserId')(db, config)
    };
};
