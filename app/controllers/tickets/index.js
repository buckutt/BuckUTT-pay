////////////////////////
// Tickets controller //
////////////////////////

'use strict';

module.exports = function (db, config) {
    return {
        getAll:            require('./getAll')(db),
        getAllFromEvent:   require('./getAllFromEvent')(db),
        generatePrintLink: require('./generatePrintLink')(db, config),
        forgot:            require('./forgot')(db, config),
        getPrice:          require('./getPrice')(db, config),
        create:            require('./create')(db, config)
    };
};
