////////////////////////
// Tickets controller //
////////////////////////

'use strict';

module.exports = function (db) {
    return {
        getAll: require('./getAll')(db),
        getAllFromEvent: require('./getAllFromEvent')(db),
        print: require('./print')(db)
    };
};
