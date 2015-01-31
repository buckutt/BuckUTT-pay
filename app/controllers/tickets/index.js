////////////////////////
// Tickets controller //
////////////////////////

'use strict';

module.exports = function (db, config) {
    return {
        getAll:          require('./getAll')(db),
        getAllFromEvent: require('./getAllFromEvent')(db),
        print:           require('./print')(db),
        forgot:          require('./forgot')(db, config)
    };
};
